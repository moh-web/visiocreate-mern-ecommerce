const express = require('express');
const router = express.Router();

const {
    updateProfile,
    changePassword,
    toggleWishlist,
    getWishlist,
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');


router.put('/profile', protect, upload.single('avatar'), updateProfile);

router.put('/change-password', protect, changePassword);

router.get('/wishlist', protect, getWishlist);

router.post('/wishlist/:productId', protect, toggleWishlist);

module.exports = router;