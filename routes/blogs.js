const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

// GET /api/blogs - Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs', message: error.message });
  }
});

// GET /api/blogs/:id - Get a blog post by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(blog);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid blog ID format' });
    }
    res.status(500).json({ error: 'Failed to fetch blog', message: error.message });
  }
});

// POST /api/blogs - Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, body, author } = req.body;
    
    // Validation
    if (!title || !body) {
      return res.status(400).json({ 
        error: 'Title and body are required' 
      });
    }
    
    const blog = new Blog({ title, body, author });
    const savedBlog = await blog.save();
    
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create blog', message: error.message });
  }
});

// PUT /api/blogs/:id - Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, body, author } = req.body;
    
    // Validation
    if (!title || !body) {
      return res.status(400).json({ 
        error: 'Title and body are required' 
      });
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, body, author },
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json(blog);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid blog ID format' });
    }
    res.status(400).json({ error: 'Failed to update blog', message: error.message });
  }
});

// DELETE /api/blogs/:id - Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid blog ID format' });
    }
    res.status(500).json({ error: 'Failed to delete blog', message: error.message });
  }
});

module.exports = router;