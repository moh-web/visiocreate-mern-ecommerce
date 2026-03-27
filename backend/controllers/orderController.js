// ============================================
// controllers/orderController.js - الطلبات
// ============================================

const Order = require('../models/Order');

// ---- POST /api/orders - إنشاء طلب جديد ----
exports.createOrder = async (req, res) => {
  try {
    // إضافة ID المستخدم الحالي للطلب
    const orderData = {
      ...req.body,
      user: req.user._id,
    };

    const newOrder = await Order.create(orderData);
    res.status(201).json(newOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/orders/my - طلبات المستخدم الحالي ----
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // الأحدث أولاً

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/orders/:id - طلب واحد بالتفاصيل ----
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // التحقق أن المستخدم هو صاحب الطلب أو أدمن
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/orders/admin - كل الطلبات (أدمن فقط) ----
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'firstName lastName email') // جلب بيانات المستخدم
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- PUT /api/orders/:id/status - تغيير حالة الطلب (أدمن) ----
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
