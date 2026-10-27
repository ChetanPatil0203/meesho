import express from 'express';
import { reviewController } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', reviewController.getProductReviews);
router.get('/:productId', reviewController.getProductReviews);
router.post('/', reviewController.createReview);

export default router;
