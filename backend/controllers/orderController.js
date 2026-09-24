import { orderService } from '../services/orderService.js';

export const orderController = {
  // GET /api/orders
  async getOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders(req.query.userId);
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/orders/:id
  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/orders
  async createOrder(req, res) {
    try {
      const result = await orderService.createOrder(req.body);
      res.status(201).json({
        message: result.source === 'database' ? 'Order created successfully' : 'Order created (in-memory mode)',
        order: result.order,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/orders/:id/status
  async updateOrderStatus(req, res) {
    try {
      const { status, tracking_step } = req.body;
      const success = await orderService.updateOrderStatus(req.params.id, { status, tracking_step });
      if (success) {
        return res.json({ message: 'Order status updated' });
      }
      res.status(404).json({ error: 'Order not found or update failed' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
