import express from 'express';
import { adminController } from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Admin Authentication (Public login endpoint, checks role === 'admin')
router.post('/login', adminController.login);

// All subsequent admin routes are strictly guarded by requireAuth + requireAdmin
router.use(requireAuth);
router.use(requireAdmin);

// 2. Dashboard Analytics
router.get('/dashboard', adminController.getDashboard);

// 3. User Management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', adminController.updateUserStatus);

// 4. Permission Management
router.get('/permissions', adminController.getPermissionsOverview);
router.get('/users/:id/permissions', adminController.getUserPermissions);
router.put('/users/:id/permissions', adminController.updateUserPermissions);

// 5. Login Activity
router.get('/login-activity', adminController.getLoginActivity);

// 6. Products Management
router.get('/products', adminController.getProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// 7. Orders Management
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// 8. Categories Management
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// 9. Reviews Moderation
router.get('/reviews', adminController.getReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// 10. Reports & Analytics
router.get('/reports', adminController.getReports);

// 11. Platform Settings
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

export default router;
