import pool from '../config/db.js';

export const userModel = {
  // Find user by email
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  // Find user by ID
  async findById(id) {
    const [rows] = await pool.query('SELECT id, name, email, phone, role, address FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Create new user
  async create({ id, name, email, phone, password, role = 'customer', address = {} }) {
    await pool.query(
      'INSERT INTO users (id, name, email, phone, password, role, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, email, phone, password, role, JSON.stringify(address)]
    );
    return { id, name, email, phone, role };
  },
};
