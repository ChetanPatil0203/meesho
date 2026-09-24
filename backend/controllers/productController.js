import { productService } from '../services/productService.js';

export const productController = {
  // GET /api/products
  async getProducts(req, res) {
    try {
      const filters = {
        category: req.query.category,
        search: req.query.search,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
        sort: req.query.sort,
        page: req.query.page || 1,
        limit: req.query.limit || 50,
      };
      const products = await productService.getAllProducts(filters);
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/products/:id
  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/products
  async createProduct(req, res) {
    try {
      const id = await productService.createProduct(req.body);
      res.status(201).json({ message: 'Product created successfully', id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/products/:id
  async updateProduct(req, res) {
    try {
      const success = await productService.updateProduct(req.params.id, req.body);
      res.json({ message: 'Product updated successfully', success });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/products/:id
  async deleteProduct(req, res) {
    try {
      const success = await productService.deleteProduct(req.params.id);
      res.json({ message: 'Product deleted successfully', success });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
