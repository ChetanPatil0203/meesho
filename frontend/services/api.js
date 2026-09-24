// Frontend API service connecting to Express.js Backend with fallback to local mock data
import { products as localProducts, categories as localCategories } from '../data/products.js';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('API getProducts fallback:', err.message);
      let list = [...localProducts];
      if (params.category && params.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
      }
      return list;
    }
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      console.warn('API getProductById fallback:', err.message);
      return localProducts.find(p => p.id === id) || null;
    }
  },

  // Categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return await res.json();
    } catch (err) {
      return localCategories;
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Order creation failed');
      return await res.json();
    } catch (err) {
      console.warn('API createOrder fallback:', err.message);
      return {
        message: 'Order placed successfully',
        order: {
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          ...orderData,
          status: 'Placed',
          tracking_step: 1,
          created_at: new Date().toISOString(),
        },
      };
    }
  },

  async getOrders(userId) {
    try {
      const res = await fetch(`${API_BASE}/orders${userId ? `?userId=${userId}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (err) {
      return [];
    }
  },

  // Auth
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      return await res.json();
    } catch (err) {
      return {
        message: 'Local login',
        user: { id: 'u_demo', name: email.split('@')[0], email, role: 'customer' },
      };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      return await res.json();
    } catch (err) {
      return {
        message: 'Registration successful',
        user: { id: `u_${Date.now()}`, ...userData },
      };
    }
  },

  // Dashboards
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/dashboard/admin`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (err) {
      return {
        totalProducts: localProducts.length,
        totalOrders: 142,
        totalRevenue: 284500,
        totalUsers: 954,
        recentOrders: [],
      };
    }
  },

  async getSellerStats(seller) {
    try {
      const res = await fetch(`${API_BASE}/dashboard/seller?seller=${encodeURIComponent(seller || 'Fashion Hub')}`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (err) {
      return {
        sellerName: seller || 'Fashion Hub',
        totalProducts: 8,
        totalOrders: 38,
        revenue: 48900,
        rating: 4.3,
      };
    }
  },
};

export default api;
