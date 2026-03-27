// ============================================
// routes/blogRoutes.js - روتس المقالات
// ============================================

const express = require('express');
const router  = express.Router();

const { getBlogs, getBlog, createBlog, deleteBlog } = require('../controllers/blogController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// GET /api/blog      -> جلب كل المقالات
router.get('/', getBlogs);

// GET /api/blog/:id  -> مقال واحد
router.get('/:id', getBlog);

// POST /api/blog     -> إضافة مقال (أدمن فقط)
router.post('/', protect, adminOnly, upload.single('image'), createBlog);

// DELETE /api/blog/:id -> حذف مقال (أدمن فقط)
router.delete('/:id', protect, adminOnly, deleteBlog);

module.exports = router;
