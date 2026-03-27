const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProduct,
    getFeatured,
    getNewArrivals,
    createProduct,
    updateProduct,
    deleteProduct,
    addReview,
} = require('../controllers/productController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/new-arrivals', getNewArrivals); // GET /api/products/new-arrivals
router.get('/:id', getProduct); // GET /api/products/:id

// ---- Protected Routes 
router.post('/:id/reviews', protect, addReview); // 

// ---- Admin Only Routes ----
// upload.array('images', 5) = 
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;