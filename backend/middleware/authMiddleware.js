// ============================================
// middleware/authMiddleware.js - حماية الـ Routes
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ---- protect: يتحقق أن المستخدم مسجل دخول ----
// بيشتغل كـ middleware قبل أي route محمي
const protect = async (req, res, next) => {
  let token = null;

  // نتحقق من وجود التوكن في الـ Authorization header
  // الهيدر بيبقى بالشكل: "Bearer eyJhbGciOiJIUzI1NiIsInR..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // نأخذ الجزء بعد كلمة Bearer
  }

  // لو مفيش توكن، نرفض الطلب
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, please login first' });
  }

  try {
    // نفك التشفير ونتحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // نجيب بيانات المستخدم ونحطها في req.user
    // select('-password') = ما نرجعش الباسورد
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // نكمل للـ route الأصلي
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

// ---- adminOnly: يتحقق أن المستخدم أدمن ----
// لازم يتعمل بعد protect في الـ route
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // أدمن، كمّل
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};

module.exports = { protect, adminOnly };
