const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Validation middleware
const registerValidation = [
  body('username').trim().isLength({ min: 3 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
];

// Register route
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create and send JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Longer expiration for new users
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Must be true when sameSite is 'none'
      sameSite: 'none', // Changed to none to work with any origin
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Also return token in response for client-side storage
    res.status(201).json({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, rememberMe = false } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token with expiration based on rememberMe
    const expiresIn = rememberMe ? '30d' : '1d';
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // Set HTTP-only cookie with expiration based on rememberMe
    const maxAge = rememberMe 
      ? 30 * 24 * 60 * 60 * 1000  // 30 days
      : 24 * 60 * 60 * 1000;      // 1 day

    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Must be true when sameSite is 'none'
      sameSite: 'none', // Changed to none to work with any origin
      maxAge
    });

    // Also return token in response for client-side storage
    res.json({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      },
      token,
      rememberMe
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Clear the HTTP-only cookie
  res.cookie('token', '', {
    httpOnly: true,
    secure: true, // Must be true when sameSite is 'none'
    sameSite: 'none', // Changed to none to work with any origin
    expires: new Date(0)
  });
  
  res.json({ message: 'Logged out successfully' });
});

// Get current user route
router.get('/me', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.token || 
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json({ user });
    } catch (err) {
      console.error('Token verification error:', err);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 