const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: String,
    image: String,
    color: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    orderCode: { type: String, unique: true },

    items: [orderItemSchema],

    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },

    contactInfo: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
    },

    paymentMethod: { type: String, enum: ['Credit Card', 'PayPal'], default: 'Credit Card' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    shippingMethod: { type: String, enum: ['free', 'express', 'pickup'], default: 'free' },
    shippingCost: { type: Number, default: 0 },

    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: String,
    total: { type: Number, required: true },

    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
}, { timestamps: true });

orderSchema.pre('save', function(next) {
    if (!this.orderCode) {
        const randomCode = Math.random().toString(36).substr(2, 7).toUpperCase();
        this.orderCode = '#' + randomCode;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);