// ============================================
// controllers/authController.js - التسجيل وتسجيل الدخول
// ============================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ---- دالة مساعدة: إنشاء توكن JWT ----
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

// ---- دالة مساعدة: تنسيق بيانات المستخدم اللي بنبعتها ----
function formatUserResponse(user, token) {
  return {
    _id:         user._id,
    firstName:   user.firstName,
    lastName:    user.lastName,
    displayName: user.displayName,
    email:       user.email,
    avatar:      user.avatar,
    role:        user.role,
    address:     user.address,
    token:       token,
  };
}

// ---- POST /api/auth/register - تسجيل مستخدم جديد ----
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // التحقق من وجود كل البيانات المطلوبة
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // التحقق من طول الباسورد
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // التحقق من عدم وجود حساب بنفس الإيميل
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    // إنشاء المستخدم (الباسورد بيتعمله hash تلقائياً في الـ model)
    const newUser = await User.create({ firstName, lastName, email, password });

    // إنشاء التوكن وإرجاع البيانات
    const token = generateToken(newUser._id);
    res.status(201).json(formatUserResponse(newUser, token));

  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ---- POST /api/auth/login - تسجيل الدخول ----
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود البيانات
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'No account found with this email' });
    }

    // مقارنة الباسورد المدخل مع المحفوظ
    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // إنشاء التوكن وإرجاع البيانات
    const token = generateToken(user._id);
    res.json(formatUserResponse(user, token));

  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ---- GET /api/auth/me - بيانات المستخدم الحالي ----
exports.getMe = async (req, res) => {
  try {
    // req.user موجود لأن protect middleware حطه
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
