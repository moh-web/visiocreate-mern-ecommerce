// ============================================
// routes/orderRoutes.js - 
// ============================================

const express = require('express');
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus,
} = require('../controllers/orderController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);

router.get('/my', protect, getMyOrders);

// GET /api/orders/admin  
router.get('/admin', protect, adminOnly, getAllOrders);

// GET /api/orders/:id  
router.get('/:id', protect, getOrder);

// PUT /api/orders/:id/status
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;