import express from 'express';
import { productController } from '../controllers/productController.js';
import { requireAuth, requirePermission } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public product browsing
router.get('/', productController.getProducts);
router.get('/style-recommendations/:id', productController.getStyleRecommendations);
router.get('/:id', productController.getProductById);

// Protected product management (enforcing add_product, edit_product, delete_product permissions)
router.post('/', requireAuth, requirePermission('add_product'), productController.createProduct);
router.put('/:id', requireAuth, requirePermission('edit_product'), productController.updateProduct);
router.delete('/:id', requireAuth, requirePermission('delete_product'), productController.deleteProduct);

export default router;
