const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { success, error } = require('../utils/response');

const generateToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET || 'fallback_secret_change_in_production',
    { expiresIn: '7d' }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 'Email and password are required', 400);
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return error(res, 'Invalid email or password', 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return error(res, 'Invalid email or password', 401);
    }

    const token = generateToken(admin);

    res.cookie('adminToken', token, cookieOptions);

    return success(res, { admin: admin.toJSON(), token }, 'Login successful');
  } catch (err) {
    console.error('login error:', err.message);
    return error(res, 'Login failed', 500);
  }
};

const logout = (req, res) => {
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  return success(res, null, 'Logged out successfully');
};

const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) return error(res, 'Admin not found', 404);
    return success(res, { admin });
  } catch (err) {
    console.error('getMe error:', err.message);
    return error(res, 'Failed to fetch admin profile', 500);
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) return error(res, 'Admin not found', 404);

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) return error(res, 'Current password is incorrect', 400);

    admin.password = newPassword;
    await admin.save();

    return success(res, null, 'Password changed successfully');
  } catch (err) {
    console.error('changePassword error:', err.message);
    return error(res, 'Failed to change password', 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) return error(res, 'Admin not found', 404);

    if (email && email.toLowerCase().trim() !== admin.email) {
      const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (existing) return error(res, 'Email already in use', 400);
      admin.email = email.toLowerCase().trim();
    }

    if (name !== undefined && name !== null) {
      admin.name = name;
    }

    await admin.save();

    return success(res, { admin: admin.toJSON() }, 'Profile updated successfully');
  } catch (err) {
    console.error('updateProfile error:', err.message);
    return error(res, 'Failed to update profile', 500);
  }
};

module.exports = { login, logout, getMe, changePassword, updateProfile };
