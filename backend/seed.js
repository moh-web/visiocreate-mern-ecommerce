// Run with: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');

const seed = async() => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Drop collections cleanly
    const collections = ['users', 'products', 'orders', 'blogs'];
    for (const col of collections) {
        try {
            await mongoose.connection.db.dropCollection(col);
            console.log(`  Dropped: ${col}`);
        } catch {}
    }

    // Import models AFTER dropping
    const User = require('./models/User');
    const Product = require('./models/Product');
    const Blog = require('./models/Blog');

    // ---- Users ----
    const admin = await User.create({
        firstName: 'Admin',
        lastName: 'VisioCreate',
        email: 'admin@visiocreate.com',
        password: 'admin123',
        role: 'admin',
    });

    await User.create({
        firstName: 'Sofia',
        lastName: 'Havertz',
        email: 'sofia@example.com',
        password: 'user123',
        role: 'user',
    });

    console.log('✅ Users created');

    // ---- Products ----
    const products = await Product.insertMany([{
            name: 'Loveseat Sofa',
            images: ["/uploads/livingRooms/image1.jpg"],
            description: 'Compact and elegant loveseat perfect for cozy living spaces.',
            price: 199,
            originalPrice: 400,
            discount: 50,
            category: 'Living Room',
            isNew: true,
            isFeatured: true,
            sku: 'LS001',
            measurements: '60 × 32 × 30"',
            stock: 10,
            rating: 4.5,
            numReviews: 8,
            colors: [
                { name: 'Gray', hex: '#a0a0a0' },
                { name: 'Beige', hex: '#d4c5a9' }
            ]
        },
        {
            name: 'Luxury Sofa',
            images: ["/uploads/livingRooms/image2.jpg"],
            description: 'Premium luxury sofa with deep cushioning.',
            price: 299,
            originalPrice: 500,
            discount: 50,
            category: 'Living Room',
            isNew: true,
            isFeatured: true,
            sku: 'LS002',
            stock: 5,
            rating: 5,
            numReviews: 12
        },
        {
            name: 'Table Lamp',
            images: ["/uploads/livingRooms/image3.jpg"],
            description: 'Modern table lamp.',
            price: 19,
            category: 'Living Room',
            stock: 25
        }
    ]);

    console.log(`✅ ${products.length} products created`);

    // Add review
    products[0].reviews.push({
        user: admin._id,
        name: 'Admin VisioCreate',
        rating: 5,
        comment: 'Great product!'
    });

    products[0].calcAvgRating();
    await products[0].save();

    // ---- Blogs ----
    await Blog.insertMany([{
            title: '7 ways to decor your home',
            excerpt: 'Transform your space',
            content: "Design tips for a better home...",
            authorName: 'VisioCreate Team',
            author: admin._id,
            isFeatured: true
        },
        {
            title: 'Decor your bedroom for your children',
            excerpt: 'Make kids happy',
            content: "Balancing fun and functionality in a child's bedroom requires creative planning...",
            authorName: 'VisioCreate Team',
            author: admin._id
        },
        {
            title: 'Small space ideas',
            excerpt: 'Make space bigger',
            content: "Living in a small space doesn't mean compromising on style...",
            authorName: 'VisioCreate Team',
            author: admin._id
        }
    ]);

    console.log('✅ Blogs created');

    console.log('\n🎉 Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin: admin@visiocreate.com / admin123');
    console.log('User: sofia@example.com / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
};

seed().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});