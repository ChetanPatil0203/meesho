import { orderModel } from '../models/orderModel.js';

// Format raw order row
function formatOrder(row) {
  if (!row) return null;
  return {
    ...row,
    total_amount: Number(row.total_amount),
    subtotal: Number(row.subtotal || row.total_amount),
    discount: Number(row.discount || 0),
    shipping_fee: Number(row.shipping_fee || 0),
    tracking_step: Number(row.tracking_step || 1),
    shipping_address: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : row.shipping_address || {},
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items || [],
  };
}

// In-memory fallback if MySQL is disconnected
const fallbackOrders = [];

export const orderService = {
  async getAllOrders(userId) {
    try {
      const rows = await orderModel.findAll(userId);
      return rows.map(formatOrder);
    } catch (err) {
      console.warn('MySQL fallback in orderService.getAllOrders:', err.message);
      if (userId) {
        return fallbackOrders.filter(o => o.user_id === userId);
      }
      return fallbackOrders;
    }
  },

  async getOrderById(id) {
    try {
      const row = await orderModel.findById(id);
      if (row) return formatOrder(row);
      return fallbackOrders.find(o => o.id === id) || null;
    } catch (err) {
      return fallbackOrders.find(o => o.id === id) || null;
    }
  },

  async createOrder(data) {
    const orderId = data.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderData = {
      id: orderId,
      user_id: data.userId || 'u_guest',
      customer_name: data.name || 'Customer',
      customer_phone: data.phone || '',
      shipping_address: data.address || {},
      items: data.items || [],
      subtotal: data.subtotal || data.totalAmount || 0,
      shipping_fee: data.shippingFee || 0,
      discount: data.discount || 0,
      total_amount: data.totalAmount || 0,
      payment_method: data.paymentMethod || 'COD',
      payment_status: data.paymentMethod === 'COD' ? 'Pending' : 'Completed',
      status: 'Placed',
      tracking_step: 1,
      created_at: new Date().toISOString(),
    };

    try {
      await orderModel.create(orderData);
      return { order: orderData, source: 'database' };
    } catch (err) {
      console.warn('MySQL fallback in orderService.createOrder:', err.message);
      fallbackOrders.unshift(orderData);
      return { order: orderData, source: 'memory' };
    }
  },

  async updateOrderStatus(id, { status, tracking_step }) {
    try {
      const success = await orderModel.updateStatus(id, { status, tracking_step });
      return success;
    } catch (err) {
      const found = fallbackOrders.find(o => o.id === id);
      if (found) {
        if (status) found.status = status;
        if (tracking_step) found.tracking_step = tracking_step;
        return true;
      }
      return false;
    }
  },

  async cancelOrder(id) {
    return await this.updateOrderStatus(id, { status: 'Cancelled', tracking_step: 0 });
  },
};
