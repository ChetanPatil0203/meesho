import { categoryModel } from '../models/categoryModel.js';
import { categories as fallbackCategories } from '../../frontend/data/products.js';

export const categoryService = {
  async getAllCategories() {
    try {
      const rows = await categoryModel.findAll();
      if (rows && rows.length > 0) {
        return rows;
      }
      return fallbackCategories;
    } catch (err) {
      return fallbackCategories;
    }
  },
};
