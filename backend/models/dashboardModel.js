import pool from '../config/db.js';

export const dashboardModel = {
  // Query aggregate metrics for admin
  async getAdminStats() {
    const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalRevenue }]] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) AS totalRevenue FROM orders');
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');

    return {
      totalProducts: Number(totalProducts),
      totalOrders: Number(totalOrders),
      totalRevenue: Number(totalRevenue),
      totalUsers: Number(totalUsers),
      recentOrders: [],
    };
  },

  // Query seller products
  async getSellerProducts(seller) {
    const [rows] = await pool.query('SELECT * FROM products WHERE seller LIKE ?', [`%${seller}%`]);
    return rows;
  },
};
