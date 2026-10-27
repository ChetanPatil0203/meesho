import { reviewModel } from '../models/reviewModel.js';

// In-memory fallback reviews
const initialFallbackReviews = [
  {
    id: 'rev_1',
    product_id: 'p1',
    user_name: 'Priya Mahajan',
    rating: 5,
    comment: 'Fabric is so soft and comfortable! The floral print is vibrant and looks exactly like the photo. Fits true to size. Delivered in 2 days.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'rev_2',
    product_id: 'p1',
    user_name: 'Sneha Deshmukh',
    rating: 4,
    comment: 'Very good product at this wholesale price! Material is pure rayon, stitched well. Perfect for daily office wear.',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'rev_3',
    product_id: 'p2',
    user_name: 'Rahul Kadam',
    rating: 5,
    comment: 'Awesome quality cotton shirt! Fits perfectly and looks very premium for the price. Fast delivery!',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

let fallbackReviews = [...initialFallbackReviews];

export const reviewService = {
  async getByProductId(productId) {
    try {
      const rows = await reviewModel.findByProductId(productId);
      if (rows && rows.length > 0) return rows;
      // If DB has no rows for this product, return any fallback reviews
      const filtered = fallbackReviews.filter((r) => r.product_id === productId);
      return filtered.length > 0 ? filtered : initialFallbackReviews.slice(0, 2);
    } catch (err) {
      console.warn('MySQL fallback in reviewService.getByProductId:', err.message);
      const filtered = fallbackReviews.filter((r) => r.product_id === productId);
      return filtered.length > 0 ? filtered : initialFallbackReviews.slice(0, 2);
    }
  },

  async addReview({ productId, userName, rating, comment }) {
    const id = `rev_${Date.now()}`;
    const newReview = {
      id,
      product_id: productId,
      user_name: userName || 'Verified Buyer',
      rating: Number(rating) || 5,
      comment: comment || '',
      created_at: new Date().toISOString(),
    };

    try {
      await reviewModel.create(newReview);
      return newReview;
    } catch (err) {
      console.warn('MySQL fallback in reviewService.addReview:', err.message);
      fallbackReviews.unshift(newReview);
      return newReview;
    }
  },
};
