import pool from '../config/db.js';

export const reviewModel = {
  // Query reviews by product_id
  async findByProductId(productId) {
    const [rows] = await pool.query(
      'SELECT id, product_id, user_name, rating, comment, created_at FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
      [productId]
    );
    return rows;
  },

  // Insert a new review
  async create({ id, product_id, user_name, rating, comment }) {
    await pool.query(
      'INSERT INTO reviews (id, product_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [id, product_id, user_name, rating, comment]
    );
    return { id, product_id, user_name, rating, comment, created_at: new Date().toISOString() };
  },
};
