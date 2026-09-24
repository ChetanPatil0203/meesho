import pool from '../config/db.js';

export const orderModel = {
  // Query all orders or filter by user_id
  async findAll(userId = null) {
    let query = 'SELECT * FROM orders';
    const params = [];
    if (userId) {
      query += ' WHERE user_id = ?';
      params.push(userId);
    }
    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Query order by ID
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Insert a new order
  async create(orderData) {
    await pool.query(
      `INSERT INTO orders (
        id, user_id, customer_name, customer_phone, shipping_address, items,
        subtotal, shipping_fee, discount, total_amount, payment_method,
        payment_status, status, tracking_step
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderData.id,
        orderData.user_id,
        orderData.customer_name,
        orderData.customer_phone,
        JSON.stringify(orderData.shipping_address),
        JSON.stringify(orderData.items),
        orderData.subtotal,
        orderData.shipping_fee,
        orderData.discount,
        orderData.total_amount,
        orderData.payment_method,
        orderData.payment_status,
        orderData.status,
        orderData.tracking_step,
      ]
    );
    return orderData;
  },

  // Update order status & tracking step
  async updateStatus(id, { status, tracking_step }) {
    const [result] = await pool.query(
      'UPDATE orders SET status = COALESCE(?, status), tracking_step = COALESCE(?, tracking_step) WHERE id = ?',
      [status, tracking_step, id]
    );
    return result.affectedRows > 0;
  },
};
