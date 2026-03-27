// ============================================
// server.js - نقطة البداية للسيرفر
// ============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// تحميل متغيرات البيئة من ملف .env
dotenv.config();

// إنشاء التطبيق
const app = express();

// ---- Middleware ----
// السماح للفرونت اند بالتواصل مع الباك اند
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// تحليل بيانات JSON القادمة من الطلبات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// طباعة تفاصيل كل طلب في الكونسول (مفيد للـ development)
app.use(morgan('dev'));

// جعل مجلد uploads متاح كملفات ستاتيك
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// ---- Routes ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));

// ---- Error Handler ----
// أي error يمر من أي route يصل هنا
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// ---- الاتصال بـ MongoDB ثم تشغيل السيرفر ----
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
    });