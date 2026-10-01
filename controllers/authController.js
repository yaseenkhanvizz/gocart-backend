const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: { message: 'User already exists', status: 400 } });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ error: { message: 'Invalid user data', status: 400 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ error: { message: 'Invalid email or password', status: 401 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // In a real app, you might want to blacklist the token
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
exports.refreshToken = async (req, res) => {
  try {
    const token = generateToken(req.user._id);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found', status: 404 } });
    }

    // In a real app, generate reset token and send email
    // For now, just return success
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    // In a real app, verify the reset token
    // For now, just return success
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.avatar = avatar || user.avatar;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: { message: 'User not found', status: 404 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } else {
      res.status(401).json({ error: { message: 'Current password is incorrect', status: 401 } });
    }
  } catch (error) {
    res.status(500).json({ error: { message: error.message, status: 500 } });
  }
};
