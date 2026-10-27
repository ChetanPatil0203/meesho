import { authService } from '../services/authService.js';

export const authController = {
  // POST /api/auth/register
  async register(req, res) {
    const { name, email, phone, password, role = 'customer' } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
      const meta = {
        ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || '',
      };
      const result = await authService.register({ name, email, phone, password, role }, meta);
      res.status(201).json({
        message: 'Registration successful',
        user: result.user,
        token: result.token,
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
      const meta = {
        ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || '',
      };
      const result = await authService.login(email, password, meta);
      res.json({
        message: 'Login successful',
        user: result.user,
        token: result.token,
        permissions: result.permissions,
      });
    } catch (err) {
      if (err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      if (err.message === 'ACCOUNT_BLOCKED') {
        return res.status(403).json({ error: 'Your account has been blocked by an administrator. Please contact support.' });
      }
      if (err.message === 'ACCOUNT_SUSPENDED') {
        return res.status(403).json({ error: 'Your account is suspended. Please contact administrator.' });
      }
      if (err.message === 'LOGIN_PERMISSION_DENIED') {
        return res.status(403).json({ error: 'Login access has been revoked for this account.' });
      }
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/auth/send-otp
  async sendOtp(req, res) {
    const { phone } = req.body;
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number' });
    }

    try {
      const result = await authService.sendOtp(cleanPhone);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/auth/verify-otp
  async verifyOtp(req, res) {
    const { phone, otp, name, email, password } = req.body;
    const cleanPhone = (phone || '').replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return res.status(400).json({ error: 'Valid 10-digit mobile number is required' });
    }
    if (!otp) {
      return res.status(400).json({ error: 'OTP is required' });
    }

    try {
      const meta = {
        ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || '',
      };
      const result = await authService.verifyOtp({ phone: cleanPhone, otp: otp.trim(), name, email, password }, meta);
      res.json(result);
    } catch (err) {
      if (err.message === 'INVALID_OTP') {
        return res.status(400).json({ error: 'Invalid OTP entered. Please check and try again.' });
      }
      if (err.message === 'OTP_EXPIRED') {
        return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
      }
      if (err.message === 'ACCOUNT_BLOCKED') {
        return res.status(403).json({ error: 'Account has been blocked by administrator.' });
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
