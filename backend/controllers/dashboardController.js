import { dashboardService } from '../services/dashboardService.js';

export const dashboardController = {
  // GET /api/dashboard/admin
  async getAdminDashboard(req, res) {
    try {
      const stats = await dashboardService.getAdminStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/dashboard/seller
  async getSellerDashboard(req, res) {
    try {
      const { seller = 'Fashion Hub' } = req.query;
      const stats = await dashboardService.getSellerStats(seller);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
