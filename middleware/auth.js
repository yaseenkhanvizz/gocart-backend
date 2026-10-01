const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ error: { message: 'User not found', status: 401 } });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: { message: 'Not authorized, token failed', status: 401 } });
    }
  }

  if (!token) {
    return res.status(401).json({ error: { message: 'Not authorized, no token', status: 401 } });
  }
};

// Admin middleware - check if user is admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: { message: 'Not authorized as admin', status: 403 } });
  }
};
