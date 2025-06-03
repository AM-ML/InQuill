const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const { auth, authorize } = require('../middleware/auth');
const { uploadBase64Image } = require('../utils/cloudinaryConfig');

// Validation middleware
const articleValidation = [
  body('title').trim().isLength({ min: 3 }).escape()
    .withMessage('Title must be at least 3 characters long'),
  body('content').isObject()
    .withMessage('Content must be a valid object'),
  body('status').optional().isIn(['draft', 'published'])
    .withMessage('Invalid status'),
  body('tags').optional().isArray()
    .withMessage('Tags must be an array')
];

// GET all articles with search, filtering, and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = 'published', 
      sort = 'newest',
      search = '',
      category = '',
      tags = ''
    } = req.query;
    
    // Base query - filter by status
    let query = { status };
    
    // If user is authenticated, allow them to see their own drafts
    if (req.user) {
      if (status === 'all') {
        // If status is 'all', show published articles + user's drafts
        query = {
          $or: [
            { status: 'published' },
            { status: 'draft', author: req.user._id }
          ]
        };
      } else if (status === 'my-drafts') {
        // Show only user's drafts
        query = { status: 'draft', author: req.user._id };
      }
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Tags filter (can be comma-separated)
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    // Sorting options
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      popular: { views: -1 },
      trending: { likes: -1 }
    };
    
    const sortBy = sortOptions[sort] || sortOptions.newest;

    // Execute query with pagination
    const articles = await Article.find(query)
      .populate('author', 'username avatar')
      .sort(sortBy)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Get total count for pagination
    const count = await Article.countDocuments(query);

    // Get available categories for filtering
    const categories = await Article.distinct('category', { status: 'published' });
    
    // Get popular tags
    const popularTags = await Article.aggregate([
      { $match: { status: 'published' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      articles,
      totalArticles: count,
      totalPages: Math.ceil(count / Number(limit)),
      currentPage: Number(page),
      categories,
      popularTags: popularTags.map(tag => ({ name: tag._id, count: tag.count }))
    });
  } catch (error) {
    console.error('Error in GET /articles:', error);
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
});

// GET article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username avatar');
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // If article is draft, only author or admin can view it
    if (article.status === 'draft') {
      if (!req.user || (req.user._id.toString() !== article.author._id.toString() && req.user.role !== 'admin')) {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      // Increment view count for published articles
      article.views += 1;
      await article.save();
    }

    // Get comments for the article
    const comments = await Comment.find({ 
      article: req.params.id,
      parentComment: null // Only get top-level comments
    })
    .populate('author', 'username avatar')
    .sort({ createdAt: -1 });

    res.json({ article, comments });
  } catch (error) {
    console.error('Error in GET /articles/:id:', error);
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
});

// POST new article
router.post('/', [auth, authorize('writer', 'admin'), ...articleValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, content, status, category, tags, coverImage } = req.body;
    
    // Upload cover image to Cloudinary if it's a base64 string
    let coverImageUrl = coverImage;
    if (coverImage && coverImage.startsWith('data:')) {
      try {
        const uploadResult = await uploadBase64Image(coverImage, 'covers');
        coverImageUrl = uploadResult.secure_url;
      } catch (err) {
        return res.status(400).json({ message: 'Error uploading cover image', error: err.message });
      }
    }

    // Process content for embedded base64 images
    if (content && content.blocks) {
      // Find and replace base64 images with Cloudinary URLs
      for (let i = 0; i < content.blocks.length; i++) {
        const block = content.blocks[i];
        if (block.type === 'image' && block.data && block.data.file && block.data.file.url && block.data.file.url.startsWith('data:')) {
          try {
            const uploadResult = await uploadBase64Image(block.data.file.url, 'article-content');
            content.blocks[i].data.file.url = uploadResult.secure_url;
          } catch (err) {
            console.error('Error uploading embedded image:', err);
            // Continue with other images
          }
        }
      }
    }

    const article = new Article({
      title,
      description: description || '',
      content,
      author: req.user._id,
      status: status || 'draft',
      category: category || 'Uncategorized',
      tags: Array.isArray(tags) ? tags : (tags ? [tags] : []),
      coverImage: coverImageUrl || ''
    });

    await article.save();
    await article.populate('author', 'username avatar');
    
    res.status(201).json(article);
  } catch (error) {
    console.error('Error in POST /articles:', error);
    res.status(500).json({ message: 'Error creating article', error: error.message });
  }
});

// PUT update article
router.put('/:id', [auth, ...articleValidation], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Check if user is author or admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, content, status, category, tags, coverImage } = req.body;
    
    // Upload cover image to Cloudinary if it's a base64 string
    let coverImageUrl = coverImage;
    if (coverImage && coverImage.startsWith('data:')) {
      try {
        const uploadResult = await uploadBase64Image(coverImage, 'covers');
        coverImageUrl = uploadResult.secure_url;
      } catch (err) {
        return res.status(400).json({ message: 'Error uploading cover image', error: err.message });
      }
    }

    // Process content for embedded base64 images
    if (content && content.blocks) {
      // Find and replace base64 images with Cloudinary URLs
      for (let i = 0; i < content.blocks.length; i++) {
        const block = content.blocks[i];
        if (block.type === 'image' && block.data && block.data.file && block.data.file.url && block.data.file.url.startsWith('data:')) {
          try {
            const uploadResult = await uploadBase64Image(block.data.file.url, 'article-content');
            content.blocks[i].data.file.url = uploadResult.secure_url;
          } catch (err) {
            console.error('Error uploading embedded image:', err);
            // Continue with other images
          }
        }
      }
    }
    
    // Update article fields
    article.title = title;
    article.description = description || article.description;
    article.content = content;
    article.status = status || article.status;
    article.category = category || article.category;
    article.tags = Array.isArray(tags) ? tags : (tags ? [tags] : article.tags);
    
    // Only update coverImage if provided
    if (coverImageUrl) {
      article.coverImage = coverImageUrl;
    }

    await article.save();
    await article.populate('author', 'username avatar');

    res.json(article);
  } catch (error) {
    console.error('Error in PUT /articles/:id:', error);
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
});

// DELETE article
router.delete('/:id', [auth], async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Check if user is author or admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete associated comments
    await Comment.deleteMany({ article: req.params.id });
    
    // Delete the article
    await Article.findByIdAndDelete(req.params.id);

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /articles/:id:', error);
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
});

// POST like an article
router.post('/:id/like', [auth], async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    
    // Increment like count
    article.likes += 1;
    await article.save();
    
    res.json({ likes: article.likes });
  } catch (error) {
    console.error('Error in POST /articles/:id/like:', error);
    res.status(500).json({ message: 'Error liking article', error: error.message });
  }
});

module.exports = router; 