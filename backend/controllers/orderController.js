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
      const { items, totalAmount, total_amount } = req.body;
      const finalAmount = totalAmount ?? total_amount;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }
      if (finalAmount === undefined || isNaN(Number(finalAmount)) || Number(finalAmount) < 0) {
        return res.status(400).json({ error: 'Valid totalAmount is required' });
      }

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

  // PUT /api/orders/:id/cancel
  async cancelOrder(req, res) {
    try {
      const success = await orderService.cancelOrder(req.params.id);
      if (success) {
        return res.json({ message: 'Order cancelled successfully', id: req.params.id, status: 'Cancelled' });
      }
      res.status(404).json({ error: 'Order not found or cancel failed' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
