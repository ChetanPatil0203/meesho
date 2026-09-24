import { categoryService } from '../services/categoryService.js';

export const categoryController = {
  // GET /api/categories
  async getCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
