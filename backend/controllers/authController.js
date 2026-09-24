import { authService } from '../services/authService.js';

export const authController = {
  // POST /api/auth/register
  async register(req, res) {
    const { name, email, phone, password, role = 'customer' } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
      const user = await authService.register({ name, email, phone, password, role });
      res.status(201).json({
        message: 'Registration successful',
        user,
      });
    } catch (err) {
      if (err.message === 'EMAIL_EXISTS') {
        return res.status(409).json({ error: 'User already exists with this email' });
      }
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await authService.login(email, password);
      res.json({
        message: 'Login successful',
        user,
      });
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/auth/profile/:id
  async getProfile(req, res) {
    try {
      const user = await authService.getProfile(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
