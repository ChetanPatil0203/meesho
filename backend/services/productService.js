import { productModel } from '../models/productModel.js';
import { products as fallbackProducts } from '../../frontend/data/products.js';

// Format raw MySQL row into typed JSON
function formatProduct(row) {
  if (!row) return null;
  return {
    ...row,
    price: Number(row.price),
    mrp: Number(row.mrp),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    sellerRating: Number(row.sellerRating || 4.0),
    inStock: Boolean(row.inStock),
    images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images || [],
    colors: typeof row.colors === 'string' ? JSON.parse(row.colors) : row.colors || [],
    sizes: typeof row.sizes === 'string' ? JSON.parse(row.sizes) : row.sizes || [],
    specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : row.specifications || {},
  };
}

export const productService = {
  async getAllProducts(filters) {
    try {
      const rows = await productModel.findAll(filters);
      return rows.map(formatProduct);
    } catch (err) {
      console.warn('MySQL fallback in productService.getAllProducts:', err.message);
      let filtered = [...fallbackProducts];
      if (filters.category && filters.category !== 'All') {
        filtered = filtered.filter(p => p.category?.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
      }
      return filtered;
    }
  },

  async getProductById(id) {
    try {
      const row = await productModel.findById(id);
      if (row) return formatProduct(row);
      return fallbackProducts.find(p => p.id === id) || null;
    } catch (err) {
      return fallbackProducts.find(p => p.id === id) || null;
    }
  },

  async createProduct(productData) {
    return await productModel.create(productData);
  },

  async updateProduct(id, productData) {
    return await productModel.update(id, productData);
  },

  async deleteProduct(id) {
    return await productModel.delete(id);
  },
};
