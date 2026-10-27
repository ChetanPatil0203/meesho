import { reviewService } from '../services/reviewService.js';

export const reviewController = {
  // GET /api/reviews?productId=... or GET /api/reviews/:productId
  async getProductReviews(req, res) {
    try {
      const productId = req.params.productId || req.query.productId;
      if (!productId) {
        return res.status(400).json({ error: 'productId parameter is required' });
      }
      const reviews = await reviewService.getByProductId(productId);
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/reviews
  async createReview(req, res) {
    try {
      const { productId, userName, rating, comment } = req.body;
      if (!productId) {
        return res.status(400).json({ error: 'productId is required' });
      }
      if (!rating || Number(rating) < 1 || Number(rating) > 5) {
        return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
      }
      if (!comment || !comment.trim()) {
        return res.status(400).json({ error: 'comment text cannot be empty' });
      }

      const review = await reviewService.addReview({
        productId,
        userName: userName?.trim() || 'Verified Buyer',
        rating: Number(rating),
        comment: comment.trim(),
      });

      res.status(201).json({
        message: 'Review submitted successfully',
        review,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
