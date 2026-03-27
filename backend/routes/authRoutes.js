// ============================================
// routes/authRoutes.js - روتس التوثيق
// ============================================

const express = require('express');
const router  = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { protect }                = require('../middleware/authMiddleware');

// POST /api/auth/register  -> تسجيل مستخدم جديد
router.post('/register', register);

// POST /api/auth/login  -> تسجيل الدخول
router.post('/login', login);

// GET /api/auth/me  -> بيانات المستخدم الحالي (محمي)
router.get('/me', protect, getMe);

module.exports = router;
