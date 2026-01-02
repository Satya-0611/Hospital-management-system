const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect Routes (Check if user is logged in)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token ID & attach to request object
      // We exclude the password for security (-password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next step
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Admin Check (Check if user is admin)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const doctor = (req, res, next) => {
    if (req.user && req.user.role === 'doctor') {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as a doctor' });
    }
};

module.exports = { protect, admin, doctor };