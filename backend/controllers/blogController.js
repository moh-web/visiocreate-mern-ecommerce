// ============================================
// controllers/blogController.js - المقالات
// ============================================

const Blog = require('../models/Blog');

// ---- GET /api/blog - جلب المقالات ----
exports.getBlogs = async (req, res) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 9;
    const featured = req.query.featured;

    // لو featured=true نجيب المميزة فقط
    const searchQuery = featured === 'true' ? { isFeatured: true } : {};

    const total = await Blog.countDocuments(searchQuery);
    const skip  = (page - 1) * limit;

    const blogs = await Blog.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ blogs: blogs, total: total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/blog/:id - مقال واحد ----
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- POST /api/blog - إضافة مقال جديد (أدمن فقط) ----
exports.createBlog = async (req, res) => {
  try {
    let image = '';
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }

    const newBlog = await Blog.create({
      ...req.body,
      image:      image,
      author:     req.user._id,
      authorName: req.user.firstName + ' ' + req.user.lastName,
    });

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- DELETE /api/blog/:id - حذف مقال (أدمن فقط) ----
exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
