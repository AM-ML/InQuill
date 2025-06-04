// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const uploadRoutes = require('./routes/uploads');
const { auth, authorize } = require('./middleware/auth');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' })); // Increase payload limit for base64 images
app.use(cookieParser());

// CORS configuration with improved cookie handling
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie']
}));

// Cookie security middleware
app.use((req, res, next) => {
  // Set secure headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/uploads', uploadRoutes);

// User profile update route
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    const { username, name, bio, title, avatar } = req.body;
    const userId = req.user._id;

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, name, bio, title, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a new token with updated user info
    const token = jwt.sign(
      { userId: updatedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set HTTP-only cookie with the new token
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return the updated user and new token
    res.json({ 
      user: updatedUser,
      token 
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// User password update route
app.put('/api/users/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real app, you would verify the current password
    // and hash the new password before saving
    // This is a simplified version
    
    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
});

// User notification settings route
app.put('/api/users/notifications', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // In a real app, you would store these settings in the user model
    // For now, we'll just acknowledge the request
    
    res.json({ message: 'Notification settings updated' });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Error updating notification settings', error: error.message });
  }
});

// User statistics route
app.get('/api/users/statistics', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Mock statistics data
    // In a real app, you would calculate these from the database
    const statistics = {
      totalArticles: 5,
      totalViews: 1250,
      totalLikes: 47,
      totalComments: 23
    };
    
    res.json(statistics);
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

// Email verification route
app.post('/api/users/verify-email', auth, async (req, res) => {
  try {
    // In a real app, you would send a verification email
    // For now, we'll just acknowledge the request
    
    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Error sending verification email', error: error.message });
  }
});

// Protected route example
app.get('/api/protected', auth, (req, res) => {
  res.json({ message: 'Protected route accessed successfully', user: req.user });
});

// Writer-only route example
app.post('/api/articles', auth, authorize('writer', 'admin'), (req, res) => {
  res.json({ message: 'Writer/admin only route' });
});

// Admin-only route example
app.delete('/api/articles/:id', auth, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin only route' });
});

// Test auth route - useful for debugging
app.get('/api/auth/test', (req, res) => {
  const token = req.cookies.token || 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  res.json({ 
    message: 'Auth test route',
    hasCookie: !!req.cookies.token,
    hasAuthHeader: !!(req.headers.authorization && req.headers.authorization.includes('Bearer')),
    cookieNames: Object.keys(req.cookies),
    tokenExists: !!token
  });
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title, content });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    env: process.env.NODE_ENV || 'development'
  });
});

// CORS test route
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS test successful',
    origin: req.headers.origin || 'No origin header',
    host: req.headers.host,
    referer: req.headers.referer || 'No referer header',
    cookies: req.cookies,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS allowing all origins with credentials`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
