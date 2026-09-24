import express from 'express';
import { orderController } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);

export default router;
