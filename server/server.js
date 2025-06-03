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
