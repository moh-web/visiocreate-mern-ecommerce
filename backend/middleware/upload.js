// ============================================
// middleware/upload.js - رفع الصور
// ============================================

const multer = require('multer');
const path = require('path');

// ---- إعداد مكان الحفظ واسم الملف ----
const storage = multer.diskStorage({
    // المجلد اللي هيتحفظ فيه الملف
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // اسم الملف = timestamp + رقم عشوائي + امتداد الملف الأصلي
    // مثال: 1701234567890-123456789.jpg
    filename: function(req, file, cb) {
        const uniqueNumber = Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        cb(null, Date.now() + '-' + uniqueNumber + extension);
    },
});

// ---- فلتر أنواع الملفات: صور فقط ----
const fileFilter = function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const isValidExtension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMimetype = allowedTypes.test(file.mimetype);

    if (isValidExtension && isValidMimetype) {
        cb(null, true); // قبول الملف
    } else {
        cb(new Error('Images only (jpeg, jpg, png, webp)')); // رفض الملف
    }
};

// ---- إنشاء multer مع الإعدادات ----
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // الحد الأقصى 5 ميجابايت
    },
});

module.exports = upload;