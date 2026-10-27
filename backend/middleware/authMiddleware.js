import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { getDefaultPermissionsForRole } from '../database/initDb.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shopio_super_secret_jwt_key_2026';

/**
 * Middleware to verify JWT authentication token
 */
export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user still exists in database and is active
    try {
      const [rows] = await pool.query('SELECT id, name, email, role, status FROM users WHERE id = ?', [decoded.id]);
      if (!rows || rows.length === 0) {
        return res.status(401).json({ error: 'User account no longer exists.' });
      }

      const dbUser = rows[0];
      if (dbUser.status === 'blocked' || dbUser.status === 'suspended') {
        return res.status(403).json({ error: `Account has been ${dbUser.status}. Access denied.` });
      }

      req.user = {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        status: dbUser.status,
      };
    } catch (dbErr) {
      // If DB read fails, fall back to decoded token info
      req.user = decoded;
    }

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
}

/**
 * Middleware to verify that the authenticated user is an administrator
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
  }

  next();
}

/**
 * Middleware factory to verify that the user possesses a specific permission
 * @param {string} permissionName
 */
export function requirePermission(permissionName) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Admins always bypass individual permission checks
    if (req.user.role === 'admin') {
      return next();
    }

    try {
      // Check user_permissions table in MySQL
      const [rows] = await pool.query(
        'SELECT is_allowed FROM user_permissions WHERE user_id = ? AND permission_name = ?',
        [req.user.id, permissionName]
      );

      if (rows && rows.length > 0) {
        if (!rows[0].is_allowed) {
          return res.status(403).json({
            error: `Permission denied: You do not have '${permissionName}' permission enabled on your account.`,
            permission: permissionName,
          });
        }
        return next();
      }

      // If no custom row, check role-based default
      const roleDefaults = getDefaultPermissionsForRole(req.user.role);
      if (!roleDefaults[permissionName]) {
        return res.status(403).json({
          error: `Permission denied: Action requires '${permissionName}' which is not allowed for role '${req.user.role}'.`,
          permission: permissionName,
        });
      }

      next();
    } catch (err) {
      console.warn('Permission check DB warning:', err.message);
      // Fail closed for security if error
      return res.status(500).json({ error: 'Permission verification failed on server.' });
    }
  };
}
