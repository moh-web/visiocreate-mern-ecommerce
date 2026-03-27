const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: String,
    content: { type: String, required: true },
    image: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: String,
    isFeatured: { type: Boolean, default: false },
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);