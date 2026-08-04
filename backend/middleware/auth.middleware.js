const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const protect = (req, res, next) => {
  let token;

  // Check httpOnly cookie first
  if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  }
  // Fallback: Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return error(res, 'Not authenticated', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_in_production');
    req.admin = decoded;
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401);
  }
};

module.exports = { protect };
