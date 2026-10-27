import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { testConnection } from './config/db.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';

import reviewsRouter from './routes/reviews.js';
import resellerRouter from './routes/reseller.js';
import adminRouter from './routes/admin.js';
import virtualTryOnRouter from './routes/virtualTryOn.js';
import { productController } from './controllers/productController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Shopio Backend API (Node.js + Express + MySQL)',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get('/api/style-recommendations/:id', productController.getStyleRecommendations);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/reseller', resellerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/virtual-tryon', virtualTryOnRouter);

// 404 Route handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Shopio Server running on http://localhost:${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`=================================================`);
  await testConnection();
});

export default app;
