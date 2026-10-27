import pool from '../config/db.js';
import { ALL_PERMISSIONS, getDefaultPermissionsForRole } from '../database/initDb.js';

export const userModel = {
  // Find user by email (includes password hash for auth)
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, password, role, status, last_login, address, created_at FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  // Find user by ID (excludes password hash)
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, role, status, last_login, address, created_at FROM users WHERE id = ?',
      [id]
    );
    if (!rows[0]) return null;
    const user = rows[0];
    if (typeof user.address === 'string') {
      try {
        user.address = JSON.parse(user.address);
      } catch {
        user.address = {};
      }
    }
    return user;
  },

  // Create new user (enforces safe default role/status)
  async create({ id, name, email, phone, password, role = 'customer', status = 'active', address = {} }) {
    await pool.query(
      'INSERT INTO users (id, name, email, phone, password, role, status, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, phone, password, role, status, JSON.stringify(address)]
    );

    // Initialize default permissions for this user
    const defaultPerms = getDefaultPermissionsForRole(role);
    for (const [permName, isAllowed] of Object.entries(defaultPerms)) {
      await pool.query(
        'INSERT INTO user_permissions (user_id, permission_name, is_allowed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE is_allowed=VALUES(is_allowed)',
        [id, permName, isAllowed ? 1 : 0]
      );
    }

    return { id, name, email, phone, role, status };
  },

  // Find all users with dynamic filters (search, role, status)
  async findAll({ search, role, status, permissionStatus, limit = 100, page = 1 } = {}) {
    let query = `
      SELECT 
        u.id, u.name, u.email, u.phone, u.role, u.status, u.last_login, u.created_at,
        COUNT(CASE WHEN p.is_allowed = 1 THEN 1 END) as active_permissions_count,
        COUNT(p.id) as total_permissions_count
      FROM users u
      LEFT JOIN user_permissions p ON u.id = p.user_id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR u.id LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (role && role !== 'all') {
      query += ' AND u.role = ?';
      params.push(role);
    }

    if (status && status !== 'all') {
      query += ' AND u.status = ?';
      params.push(status);
    }

    query += ' GROUP BY u.id, u.name, u.email, u.phone, u.role, u.status, u.last_login, u.created_at';

    if (permissionStatus === 'restricted') {
      query += ' HAVING active_permissions_count < total_permissions_count';
    } else if (permissionStatus === 'full') {
      query += ' HAVING active_permissions_count = total_permissions_count AND total_permissions_count > 0';
    }

    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Update user account status (active, pending, suspended, blocked)
  async updateStatus(id, status) {
    const validStatuses = ['active', 'pending', 'suspended', 'blocked'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }

    const [result] = await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows > 0;
  },

  // Update user last login timestamp
  async updateLastLogin(id) {
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [id]);
  },

  // Get permissions for a specific user
  async getPermissions(userId) {
    const [rows] = await pool.query(
      'SELECT permission_name, is_allowed FROM user_permissions WHERE user_id = ?',
      [userId]
    );

    // If no custom rows exist yet, populate from role defaults
    const [userRows] = await pool.query('SELECT role FROM users WHERE id = ?', [userId]);
    const userRole = userRows[0]?.role || 'customer';
    const defaults = getDefaultPermissionsForRole(userRole);

    const permsMap = { ...defaults };
    for (const r of rows) {
      permsMap[r.permission_name] = Boolean(r.is_allowed);
    }

    return permsMap;
  },

  // Update single permission
  async updatePermission(userId, permissionName, isAllowed) {
    await pool.query(
      `INSERT INTO user_permissions (user_id, permission_name, is_allowed)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE is_allowed = VALUES(is_allowed)`,
      [userId, permissionName, isAllowed ? 1 : 0]
    );
    return true;
  },

  // Update multiple permissions in bulk
  async updateAllPermissions(userId, permissionsMap) {
    for (const [permName, isAllowed] of Object.entries(permissionsMap)) {
      if (ALL_PERMISSIONS.includes(permName)) {
        await pool.query(
          `INSERT INTO user_permissions (user_id, permission_name, is_allowed)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE is_allowed = VALUES(is_allowed)`,
          [userId, permName, isAllowed ? 1 : 0]
        );
      }
    }
    return this.getPermissions(userId);
  },

  // Get all users with their full permissions matrix for Permissions Page
  async getPermissionsOverview({ search, role, status } = {}) {
    let query = `
      SELECT id, name, email, role, status, created_at, last_login
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR id LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (role && role !== 'all') {
      query += ' AND role = ?';
      params.push(role);
    }

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const [users] = await pool.query(query, params);

    // Fetch permissions for all users
    const [allPerms] = await pool.query('SELECT user_id, permission_name, is_allowed FROM user_permissions');
    const permLookup = {};
    for (const p of allPerms) {
      if (!permLookup[p.user_id]) permLookup[p.user_id] = {};
      permLookup[p.user_id][p.permission_name] = Boolean(p.is_allowed);
    }

    return users.map((u) => {
      const defaults = getDefaultPermissionsForRole(u.role);
      const userPerms = { ...defaults, ...(permLookup[u.id] || {}) };
      const totalAllowed = Object.values(userPerms).filter(Boolean).length;
      return {
        ...u,
        permissions: userPerms,
        allowedCount: totalAllowed,
        totalCount: ALL_PERMISSIONS.length,
        permissionStatus: totalAllowed === ALL_PERMISSIONS.length ? 'Full Access' : totalAllowed === 0 ? 'No Access' : 'Customized',
      };
    });
  },

  // Record login activity
  async recordLoginActivity({ userId = null, email, ipAddress = '127.0.0.1', userAgent = '', status }) {
    try {
      const [res] = await pool.query(
        'INSERT INTO login_activity (user_id, email, ip_address, user_agent, status) VALUES (?, ?, ?, ?, ?)',
        [userId, email, ipAddress, userAgent.slice(0, 255), status]
      );
      return res.insertId;
    } catch (err) {
      console.warn('Failed to record login activity:', err.message);
      return null;
    }
  },

  // Get login activities with filters
  async getLoginActivity({ user, status, date, limit = 50, page = 1 } = {}) {
    let query = `
      SELECT 
        l.id, l.user_id, l.email, l.ip_address, l.user_agent, l.status, l.login_time, l.logout_time,
        COALESCE(u.name, 'Unknown') as user_name,
        u.role
      FROM login_activity l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (user) {
      query += ' AND (l.email LIKE ? OR u.name LIKE ? OR l.user_id LIKE ?)';
      const s = `%${user}%`;
      params.push(s, s, s);
    }

    if (status && status !== 'all') {
      query += ' AND l.status = ?';
      params.push(status);
    }

    if (date) {
      query += ' AND DATE(l.login_time) = ?';
      params.push(date);
    }

    query += ' ORDER BY l.login_time DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Platform Dashboard Overview Statistics
  async getDashboardStats() {
    const [[usersStats]] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
        COUNT(CASE WHEN status = 'blocked' THEN 1 END) as blocked_users,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_users,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_users,
        COUNT(CASE WHEN role = 'seller' THEN 1 END) as total_sellers,
        COUNT(CASE WHEN role = 'customer' THEN 1 END) as total_customers,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as total_admins
      FROM users
    `);

    const [[productsStats]] = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN inStock = 1 THEN 1 END) as in_stock_products,
        COUNT(CASE WHEN inStock = 0 THEN 1 END) as out_of_stock_products
      FROM products
    `);

    const [[ordersStats]] = await pool.query(`
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COUNT(CASE WHEN status = 'Placed' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'Delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled_orders
      FROM orders
    `);

    const [recentLogins] = await pool.query(`
      SELECT 
        l.id, l.user_id, l.email, l.ip_address, l.user_agent, l.status, l.login_time,
        COALESCE(u.name, 'Guest') as user_name
      FROM login_activity l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.login_time DESC
      LIMIT 6
    `);

    const [recentOrders] = await pool.query(`
      SELECT id, customer_name, total_amount, payment_method, payment_status, status, created_at
      FROM orders
      ORDER BY created_at DESC
      LIMIT 6
    `);

    return {
      users: usersStats,
      products: productsStats,
      orders: ordersStats,
      recentLogins,
      recentOrders,
    };
  },
};
