// ============================================
// controllers/userController.js - إدارة المستخدم
// ============================================

const User = require('../models/User');

// ---- PUT /api/users/profile - تعديل بيانات الحساب ----
exports.updateProfile = async (req, res) => {
  try {
    // البيانات المسموح بتعديلها
    const updateData = {};
    if (req.body.firstName)   updateData.firstName   = req.body.firstName;
    if (req.body.lastName)    updateData.lastName    = req.body.lastName;
    if (req.body.displayName) updateData.displayName = req.body.displayName;
    if (req.body.email)       updateData.email       = req.body.email;
    if (req.body.address)     updateData.address     = req.body.address;

    // لو في صورة مرفوعة، نضيف مسارها
    if (req.file) {
      updateData.avatar = '/uploads/' + req.file.filename;
    }

    // تحديث البيانات في قاعدة البيانات
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },   // $set = تعديل الحقول المحددة فقط
      { new: true }           // إرجاع النسخة الجديدة
    ).select('-password');    // بدون الباسورد

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// ---- PUT /api/users/change-password - تغيير الباسورد ----
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // التحقق من وجود البيانات
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // جلب المستخدم (مع الباسورد عشان نقارنه)
    const user = await User.findById(req.user._id);

    // التحقق من صحة الباسورد القديم
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // تغيير الباسورد (الـ model هيعمل hash تلقائياً)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- POST /api/users/wishlist/:productId - إضافة/إزالة من المفضلة ----
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    // نبحث عن المنتج في قائمة المفضلة
    const existingIndex = user.wishlist.findIndex(
      id => id.toString() === productId
    );

    let message = '';
    if (existingIndex > -1) {
      // المنتج موجود، نحذفه (toggle off)
      user.wishlist.splice(existingIndex, 1);
      message = 'Removed from wishlist';
    } else {
      // المنتج مش موجود، نضيفه (toggle on)
      user.wishlist.push(productId);
      message = 'Added to wishlist';
    }

    await user.save();
    res.json({ wishlist: user.wishlist, message: message });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/users/wishlist - جلب قائمة المفضلة ----
exports.getWishlist = async (req, res) => {
  try {
    // populate = جلب بيانات المنتجات كاملة بدل الـ IDs بس
    const user = await User.findById(req.user._id)
      .populate('wishlist', 'name price images rating category discount');

    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
