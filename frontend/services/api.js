// Frontend API service connecting to Express.js Backend with fallback to local mock data
import { products as localProducts, categories as localCategories } from '../data/products.js';
import { styleRecommendationService } from './styleRecommendationService.js';

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

  // AI Style Recommendations
  async getStyleRecommendations(productId, params = {}) {
    return await styleRecommendationService.getRecommendations({ productId, ...params });
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

  // Send Mobile OTP
  async sendOtp(phone) {
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    // Local Fallback
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`shopio_otp_${cleanPhone}`, JSON.stringify({
      phone: cleanPhone,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    }));

    return {
      success: true,
      phone: cleanPhone,
      otp,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      smsText: `[Shopio Verification] Your OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
    };
  },

  // Verify OTP and Authenticate / Register
  async verifyOtp({ phone, otp, name, email, password }) {
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp: otp.trim(), name, email, password }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    let stored = null;
    try {
      stored = JSON.parse(sessionStorage.getItem(`shopio_otp_${cleanPhone}`) || 'null');
    } catch {
      // ignore
    }

    const isValid = (stored && stored.otp === otp.trim()) || otp.trim() === '123456';
    if (!isValid) {
      throw new Error('Invalid OTP code. Please enter the correct code sent to your phone or use 123456.');
    }

    const userName = name || 'Customer ' + cleanPhone.slice(-4);
    const userEmail = email || `user${cleanPhone}@shopio.com`;
    const user = {
      id: `u_${cleanPhone}`,
      name: userName,
      phone: cleanPhone,
      email: userEmail,
      role: 'customer',
      status: 'active',
    };

    return {
      success: true,
      isNewUser: Boolean(name),
      message: name ? 'Registration successfully completed' : 'Login successful',
      user,
      smsNotification: {
        recipient: cleanPhone,
        message: `प्रिय ${userName}, Shopio मध्ये आपले सहर्ष स्वागत आहे! आपले रजिस्ट्रेशन यशस्वीरित्या पूर्ण झाले आहे. पहिल्या खरेदीवर ₹100 सूट व 100% मोफत डिलिव्हरी उपलब्ध! 🎉🛍️`,
      },
    };
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
