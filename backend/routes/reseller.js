import express from 'express';
import { resellerController } from '../controllers/resellerController.js';

const router = express.Router();

router.get('/profile', resellerController.getProfile);
router.put('/bank', resellerController.updateBank);
router.post('/withdraw', resellerController.withdraw);

export default router;
