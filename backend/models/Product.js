const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    likes: { type: Number, default: 0 },
}, { timestamps: true });


const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: null },
    discount: { type: Number, default: 0 },
    category: {
        type: String,
        required: true,
        enum: ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Dining', 'Outdoor'],
    },

    images: [{ type: String }],

    colors: [{
        name: String,
        hex: String,
        image: String,
    }, ],

    sku: { type: String, sparse: true },
    measurements: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    isNew: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    tags: [String],
}, { timestamps: true });

productSchema.methods.calcAvgRating = function() {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numReviews = 0;
        return;
    }

    // حساب المجموع ثم القسمة على العدد
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.numReviews = this.reviews.length;
    this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
};

module.exports = mongoose.model('Product', productSchema);