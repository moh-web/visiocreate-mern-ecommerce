require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_");
    console.log('✅ Connected');

    // Models
    const User = require('./models/User');
    const Product = require('./models/Product');

    // Clear
    await User.deleteMany();
    await Product.deleteMany();

    // ---- Users ----
    const users = await User.insertMany([
        {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@test.com',
            password: '123456',
            role: 'admin'
        },
        ...Array.from({ length: 5 }).map(() => ({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: '123456',
            role: 'user'
        }))
    ]);

    const admin = users[0];

    // ---- Image Sources (External URLs) ----
    const images = {
        living: [
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
            "https://images.unsplash.com/photo-1616627451515-cbc80e5ece35",
            "https://images.unsplash.com/photo-1567016432779-094069958ea5"
           
        ],
        bedroom: [
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
        ],
        kitchen: [
            "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
        ]
    };

    const categories = ["Living Room", "Bedroom", "Kitchen"];

    // ---- Generate Products ----
    const products = [];

    for (let i = 0; i < 30; i++) {
        const category = faker.helpers.arrayElement(categories);

        // let imageSet =
        //     category === "Living Room"
        //         ? images.living
        //         : category === "Bedroom"
        //         ? images.bedroom
        //         : images.kitchen;

        // const product = {
        //     name: faker.commerce.productName(),
        //     description: faker.commerce.productDescription(),
        //     price: Number(faker.commerce.price({ min: 50, max: 1000 })),
        //     originalPrice: Number(faker.commerce.price({ min: 100, max: 1500 })),
        //     discount: faker.number.int({ min: 10, max: 60 }),
        //     category,
        //     images: [faker.helpers.arrayElement(imageSet)],
        //     countInStock: faker.number.int({ min: 1, max: 50 }),
        //     isFeatured: faker.datatype.boolean(),
        //     rating: 0,
        //     numReviews: 0,
        //     user: admin._id,
        //     reviews: []
        // };
let imageSet =
    category === "Living Room"
        ? images.living
        : category === "Bedroom"
        ? images.bedroom
        : images.kitchen;
if (imageSet.length < 2) {
    throw new Error(`Not enough images for category: ${category}`);
}
// shuffle + unique selection
const shuffledImages = faker.helpers.shuffle([...imageSet]);

const numImages = faker.number.int({ min: 2, max: imageSet.length });

const product = {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: Number(faker.commerce.price({ min: 50, max: 1000 })),
    originalPrice: Number(faker.commerce.price({ min: 100, max: 1500 })),
    discount: faker.number.int({ min: 10, max: 60 }),
    category,
    images: shuffledImages.slice(0, numImages),
    countInStock: faker.number.int({ min: 1, max: 50 }),
    isFeatured: faker.datatype.boolean(),
    rating: 0,
    numReviews: 0,
    user: admin._id,
    reviews: []
};
        // ---- Random Reviews ----
        const numReviews = faker.number.int({ min: 1, max: 5 });

        for (let j = 0; j < numReviews; j++) {
            const randomUser = faker.helpers.arrayElement(users);

            product.reviews.push({
                user: randomUser._id,
                name: randomUser.firstName,
                rating: faker.number.int({ min: 3, max: 5 }),
                comment: faker.lorem.sentence(),
            });
        }

        // calc rating
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => acc + item.rating, 0) /
            product.reviews.length;

        products.push(product);
    }

    await Product.insertMany(products);

    console.log(`✅ ${products.length} products created`);

    process.exit();
};

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});