import pool from '../config/db.js';

export const categoryModel = {
  // Query all categories
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM categories');
    return rows;
  },
};
