import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/admin', dashboardController.getAdminDashboard);
router.get('/seller', dashboardController.getSellerDashboard);

export default router;
