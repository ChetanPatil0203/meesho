import { authService } from '../services/authService.js';
import { userModel } from '../models/userModel.js';
import { productModel } from '../models/productModel.js';
import { orderModel } from '../models/orderModel.js';
import { categoryModel } from '../models/categoryModel.js';
import { reviewModel } from '../models/reviewModel.js';
import pool from '../config/db.js';
import { ALL_PERMISSIONS } from '../database/initDb.js';

export const adminController = {
  // POST /api/admin/login
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const meta = {
        ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || '',
      };
      const result = await authService.adminLogin(email, password, meta);
      res.json({
        message: 'Admin authentication successful',
        user: result.user,
        token: result.token,
        permissions: result.permissions,
      });
    } catch (err) {
      if (err.message === 'INVALID_ADMIN_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid admin credentials or account does not have admin privileges' });
      }
      if (err.message === 'ADMIN_ACCOUNT_BLOCKED') {
        return res.status(403).json({ error: 'Admin account has been blocked or suspended' });
      }
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/dashboard
  async getDashboard(req, res) {
    try {
      const stats = await userModel.getDashboardStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/users
  async getUsers(req, res) {
    try {
      const { search, role, status, permissionStatus, page = 1, limit = 100 } = req.query;
      const users = await userModel.findAll({ search, role, status, permissionStatus, page, limit });
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/users/:id
  async getUserById(req, res) {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch user's permissions
      const permissions = await userModel.getPermissions(user.id);

      // Fetch user's orders
      const orders = await orderModel.findAll(user.id);

      // Fetch recent login activity for user
      const loginActivity = await userModel.getLoginActivity({ user: user.email, limit: 10 });

      res.json({
        ...user,
        permissions,
        orders,
        loginActivity,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/admin/users/:id/status
  async updateUserStatus(req, res) {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    try {
      const updated = await userModel.updateStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: `User status successfully updated to ${status}`, status });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // GET /api/admin/users/:id/permissions
  async getUserPermissions(req, res) {
    try {
      const permissions = await userModel.getPermissions(req.params.id);
      res.json({
        userId: req.params.id,
        permissions,
        availablePermissions: ALL_PERMISSIONS,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/admin/users/:id/permissions
  async updateUserPermissions(req, res) {
    const { permissions, permission_name, is_allowed } = req.body;

    try {
      if (permission_name !== undefined && is_allowed !== undefined) {
        // Single permission toggle
        await userModel.updatePermission(req.params.id, permission_name, is_allowed);
      } else if (permissions && typeof permissions === 'object') {
        // Bulk permissions update
        await userModel.updateAllPermissions(req.params.id, permissions);
      } else {
        return res.status(400).json({ error: 'Either permissions object or (permission_name, is_allowed) required' });
      }

      const updatedPerms = await userModel.getPermissions(req.params.id);
      res.json({
        message: 'Permissions updated successfully',
        userId: req.params.id,
        permissions: updatedPerms,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/permissions
  async getPermissionsOverview(req, res) {
    try {
      const { search, role, status } = req.query;
      const overview = await userModel.getPermissionsOverview({ search, role, status });
      res.json({
        users: overview,
        availablePermissions: ALL_PERMISSIONS,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/login-activity
  async getLoginActivity(req, res) {
    try {
      const { user, status, date, limit = 50, page = 1 } = req.query;
      const activity = await userModel.getLoginActivity({ user, status, date, limit, page });
      res.json(activity);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/products
  async getProducts(req, res) {
    try {
      const { category, search, minPrice, maxPrice, sort, page = 1, limit = 100 } = req.query;
      const products = await productModel.findAll({ category, search, minPrice, maxPrice, sort, page, limit });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/admin/products
  async createProduct(req, res) {
    try {
      const productId = await productModel.create(req.body);
      const newProduct = await productModel.findById(productId);
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/admin/products/:id
  async updateProduct(req, res) {
    try {
      const updated = await productModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      const product = await productModel.findById(req.params.id);
      res.json({ message: 'Product updated successfully', product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/admin/products/:id
  async deleteProduct(req, res) {
    try {
      const deleted = await productModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      res.json({ message: 'Product deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/orders
  async getOrders(req, res) {
    try {
      const { userId, status } = req.query;
      let query = 'SELECT * FROM orders WHERE 1=1';
      const params = [];

      if (userId) {
        query += ' AND user_id = ?';
        params.push(userId);
      }
      if (status && status !== 'all') {
        query += ' AND status = ?';
        params.push(status);
      }

      query += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(query, params);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/admin/orders/:id/status
  async updateOrderStatus(req, res) {
    const { status, tracking_step } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    try {
      let step = tracking_step;
      if (step === undefined) {
        if (status === 'Placed') step = 1;
        else if (status === 'Shipped') step = 2;
        else if (status === 'Out for Delivery') step = 3;
        else if (status === 'Delivered') step = 4;
        else if (status === 'Cancelled') step = 0;
        else step = 1;
      }

      const updated = await orderModel.updateStatus(req.params.id, { status, tracking_step: step });
      if (!updated) return res.status(404).json({ error: 'Order not found' });

      res.json({ message: 'Order status updated successfully', status, tracking_step: step });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/categories
  async getCategories(req, res) {
    try {
      const categories = await categoryModel.findAll();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/admin/categories
  async createCategory(req, res) {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    try {
      const id = name.toLowerCase().replace(/\s+/g, '-');
      await pool.query(
        'INSERT INTO categories (id, name, icon) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), icon=VALUES(icon)',
        [id, name, icon || '🛍️']
      );
      res.status(201).json({ id, name, icon: icon || '🛍️' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/admin/categories/:id
  async deleteCategory(req, res) {
    try {
      const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/reviews
  async getReviews(req, res) {
    try {
      const [rows] = await pool.query(`
        SELECT r.*, p.name as product_name, p.image as product_image
        FROM reviews r
        LEFT JOIN products p ON r.product_id = p.id
        ORDER BY r.created_at DESC
      `);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/admin/reviews/:id
  async deleteReview(req, res) {
    try {
      const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Review not found' });
      res.json({ message: 'Review deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/reports
  async getReports(req, res) {
    try {
      // 1. Category Revenue and Order Volume
      const [categoryDistribution] = await pool.query(`
        SELECT category, COUNT(*) as product_count, AVG(price) as avg_price
        FROM products
        GROUP BY category
      `);

      // 2. Orders status breakdown
      const [orderStatusBreakdown] = await pool.query(`
        SELECT status, COUNT(*) as count, COALESCE(SUM(total_amount), 0) as total_amount
        FROM orders
        GROUP BY status
      `);

      // 3. User roles breakdown
      const [roleBreakdown] = await pool.query(`
        SELECT role, status, COUNT(*) as count
        FROM users
        GROUP BY role, status
      `);

      // 4. Top selling products (or highest priced in stock)
      const [topProducts] = await pool.query(`
        SELECT id, name, category, price, rating, reviews, seller
        FROM products
        ORDER BY reviews DESC, rating DESC
        LIMIT 5
      `);

      // 5. Total analytics summary
      const [[summary]] = await pool.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM products) as total_products,
          (SELECT COUNT(*) FROM orders) as total_orders,
          (SELECT COALESCE(SUM(total_amount), 0) FROM orders) as total_revenue,
          (SELECT COUNT(*) FROM reviews) as total_reviews
      `);

      res.json({
        summary,
        categoryDistribution,
        orderStatusBreakdown,
        roleBreakdown,
        topProducts,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/admin/settings
  async getSettings(req, res) {
    try {
      const [rows] = await pool.query('SELECT setting_key, setting_value, description, updated_at FROM platform_settings');
      const settingsMap = {};
      for (const r of rows) {
        settingsMap[r.setting_key] = {
          value: r.setting_value,
          description: r.description,
          updated_at: r.updated_at,
        };
      }
      res.json(settingsMap);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/admin/settings
  async updateSettings(req, res) {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    try {
      for (const [key, value] of Object.entries(settings)) {
        await pool.query(
          'INSERT INTO platform_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
          [key, String(value)]
        );
      }
      res.json({ message: 'Platform settings saved successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
