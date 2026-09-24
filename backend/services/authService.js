import { userModel } from '../models/userModel.js';

// In-memory fallback users
const fallbackUsers = [
  { id: 'u_admin', name: 'Admin User', email: 'admin@meesho.com', password: 'admin123', role: 'admin' },
  { id: 'u_seller', name: 'Fashion Hub Seller', email: 'seller@meesho.com', password: 'seller123', role: 'seller' },
  { id: 'u_demo', name: 'Rahul Sharma', email: 'user@meesho.com', password: 'user123', role: 'customer' },
];

export const authService = {
  async register({ name, email, phone, password, role = 'customer' }) {
    const userId = `u_${Date.now()}`;
    const newUser = { id: userId, name, email, phone, password, role };

    try {
      const existing = await userModel.findByEmail(email);
      if (existing) {
        throw new Error('EMAIL_EXISTS');
      }

      await userModel.create(newUser);
      return { id: userId, name, email, phone, role };
    } catch (err) {
      if (err.message === 'EMAIL_EXISTS') throw err;
      console.warn('MySQL fallback in authService.register:', err.message);
      fallbackUsers.push(newUser);
      return { id: userId, name, email, phone, role };
    }
  },

  async login(email, password) {
    try {
      const user = await userModel.findByEmail(email);
      if (user && user.password === password) {
        return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role };
      }

      // Check fallback users
      const fbUser = fallbackUsers.find(u => u.email === email && u.password === password);
      if (fbUser) {
        return { id: fbUser.id, name: fbUser.name, email: fbUser.email, phone: fbUser.phone, role: fbUser.role };
      }

      throw new Error('INVALID_CREDENTIALS');
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') throw err;
      console.warn('MySQL fallback in authService.login:', err.message);
      const fbUser = fallbackUsers.find(u => u.email === email && u.password === password);
      if (fbUser) {
        return { id: fbUser.id, name: fbUser.name, email: fbUser.email, phone: fbUser.phone, role: fbUser.role };
      }
      // Demo fallback login
      return { id: 'u_demo', name: email.split('@')[0], email, role: 'customer' };
    }
  },

  async getProfile(id) {
    try {
      const user = await userModel.findById(id);
      if (user) {
        user.address = typeof user.address === 'string' ? JSON.parse(user.address) : user.address || {};
        return user;
      }
      return null;
    } catch (err) {
      return fallbackUsers.find(u => u.id === id) || fallbackUsers[2];
    }
  },
};
