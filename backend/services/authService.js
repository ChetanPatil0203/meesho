import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'shopio_super_secret_jwt_key_2026';
const otpMemory = new Map();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export const authService = {
  // Register new customer / seller (Admin registration blocked via public endpoint)
  async register({ name, email, phone, password, role = 'customer' }, meta = {}) {
    // Security: Do NOT allow anyone to become an admin via public registration
    let assignedRole = role;
    if (assignedRole === 'admin') {
      assignedRole = 'customer';
    }
    if (!['customer', 'seller'].includes(assignedRole)) {
      assignedRole = 'customer';
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      throw new Error('EMAIL_EXISTS');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const userId = `u_${Date.now()}`;

    const createdUser = await userModel.create({
      id: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      role: assignedRole,
      status: 'active',
      address: {},
    });

    // Record login activity on registration
    await userModel.recordLoginActivity({
      userId,
      email,
      ipAddress: meta.ip || '127.0.0.1',
      userAgent: meta.userAgent || '',
      status: 'Successful',
    });

    const token = generateToken({ id: userId, name, email, role: assignedRole });

    return {
      user: {
        id: userId,
        name,
        email,
        phone,
        role: assignedRole,
        status: 'active',
      },
      token,
    };
  },

  // Public / Customer / Seller Login
  async login(email, password, meta = {}) {
    const user = await userModel.findByEmail(email);

    if (!user) {
      await userModel.recordLoginActivity({
        userId: null,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Failed',
      });
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check account status
    if (user.status === 'blocked') {
      await userModel.recordLoginActivity({
        userId: user.id,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Blocked',
      });
      throw new Error('ACCOUNT_BLOCKED');
    }

    if (user.status === 'suspended') {
      await userModel.recordLoginActivity({
        userId: user.id,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Blocked',
      });
      throw new Error('ACCOUNT_SUSPENDED');
    }

    // Verify Password (bcrypt with legacy plain-text fallback)
    let isMatch = false;
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
      // Auto upgrade plaintext password to bcrypt hash
      if (isMatch) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        await userModel.updatePassword?.(user.id, hashed);
      }
    }

    if (!isMatch) {
      await userModel.recordLoginActivity({
        userId: user.id,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Failed',
      });
      throw new Error('INVALID_CREDENTIALS');
    }

    // Check login_access permission
    const perms = await userModel.getPermissions(user.id);
    if (perms['login_access'] === false) {
      await userModel.recordLoginActivity({
        userId: user.id,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Blocked',
      });
      throw new Error('LOGIN_PERMISSION_DENIED');
    }

    // Successful login: update last_login and log activity
    await userModel.updateLastLogin(user.id);
    await userModel.recordLoginActivity({
      userId: user.id,
      email,
      ipAddress: meta.ip || '127.0.0.1',
      userAgent: meta.userAgent || '',
      status: 'Successful',
    });

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        address: user.address,
      },
      token,
      permissions: perms,
    };
  },

  // Dedicated Admin Login Endpoint
  async adminLogin(email, password, meta = {}) {
    const user = await userModel.findByEmail(email);

    if (!user || user.role !== 'admin') {
      await userModel.recordLoginActivity({
        userId: user ? user.id : null,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Failed',
      });
      throw new Error('INVALID_ADMIN_CREDENTIALS');
    }

    if (user.status === 'blocked' || user.status === 'suspended') {
      await userModel.recordLoginActivity({
        userId: user.id,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Blocked',
      });
      throw new Error('ADMIN_ACCOUNT_BLOCKED');
    }

    let isMatch = false;
    if (user.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      isMatch = user.password === password;
    }

    if (!isMatch) {
      await userModel.recordLoginActivity({
        userId: user.id,
        email,
        ipAddress: meta.ip || '127.0.0.1',
        userAgent: meta.userAgent || '',
        status: 'Failed',
      });
      throw new Error('INVALID_ADMIN_CREDENTIALS');
    }

    await userModel.updateLastLogin(user.id);
    await userModel.recordLoginActivity({
      userId: user.id,
      email,
      ipAddress: meta.ip || '127.0.0.1',
      userAgent: meta.userAgent || '',
      status: 'Successful',
    });

    const token = generateToken(user);
    const perms = await userModel.getPermissions(user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
      token,
      permissions: perms,
    };
  },

  async getProfile(id) {
    return await userModel.findById(id);
  },

  async sendOtp(phone) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMemory.set(phone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    return {
      success: true,
      phone,
      otp,
      message: `OTP sent successfully to +91 ${phone}`,
      smsText: `[Shopio Verification] Your OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
    };
  },

  async verifyOtp({ phone, otp, name, email, password }, meta = {}) {
    const cached = otpMemory.get(phone);
    // Allow master test OTP '123456' for convenience along with generated OTP
    const isValid = (cached && cached.otp === otp && Date.now() <= cached.expiresAt) || otp === '123456';
    if (!isValid) {
      if (cached && Date.now() > cached.expiresAt) {
        throw new Error('OTP_EXPIRED');
      }
      throw new Error('INVALID_OTP');
    }

    // Check if user exists
    let user = null;
    try {
      user = await userModel.findByEmail(email || `${phone}@shopio.com`);
    } catch {
      // ignore
    }

    if (user) {
      if (user.status === 'blocked') throw new Error('ACCOUNT_BLOCKED');
      const token = generateToken(user);
      otpMemory.delete(phone);
      return {
        success: true,
        message: 'Login successful',
        isNewUser: false,
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone || phone, role: user.role, status: user.status },
        token,
        smsNotification: {
          recipient: phone,
          message: `Dear ${user.name}, you have successfully signed in to Shopio! Welcome back. 🎉`,
        },
      };
    }

    // New User Registration
    const userName = name || 'Customer ' + phone.slice(-4);
    const userEmail = email || `user${phone}@shopio.com`;
    const userId = `u_${Date.now()}`;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'Shopio@123', salt);

    let createdUser;
    try {
      createdUser = await userModel.create({
        id: userId,
        name: userName,
        email: userEmail,
        phone,
        password: hashedPassword,
        role: 'customer',
        status: 'active',
      });
    } catch {
      createdUser = { id: userId, name: userName, email: userEmail, phone, role: 'customer', status: 'active' };
    }

    const token = generateToken({ id: userId, name: userName, email: userEmail, role: 'customer' });
    otpMemory.delete(phone);

    return {
      success: true,
      message: 'Registration successfully completed',
      isNewUser: true,
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        phone,
        role: 'customer',
        status: 'active',
      },
      token,
      smsNotification: {
        recipient: phone,
        message: `प्रिय ${userName}, Shopio मध्ये आपले सहर्ष स्वागत आहे! आपले रजिस्ट्रेशन यशस्वीरित्या पूर्ण झाले आहे. पहिल्या खरेदीवर ₹100 सूट व मोफत डिलिव्हरी उपलब्ध! 🎉🛍️`,
      },
    };
  },
};
