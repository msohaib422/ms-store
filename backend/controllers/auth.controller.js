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
  const admin = await Admin.findById(req.admin.id).select('-password');
  if (!admin) return error(res, 'Admin not found', 404);
  return success(res, { admin });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin.id);

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) return error(res, 'Current password is incorrect', 400);

  admin.password = newPassword;
  await admin.save();

  return success(res, null, 'Password changed successfully');
};

module.exports = { login, logout, getMe, changePassword };
