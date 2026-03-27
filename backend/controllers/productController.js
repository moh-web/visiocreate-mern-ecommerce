// ============================================
// controllers/productController.js - المنتجات
// ============================================

const Product = require('../models/Product');

// ---- GET /api/products - جلب كل المنتجات مع الفلتر ----
exports.getProducts = async (req, res) => {
  try {
    // استخراج الفلاتر من الـ URL
    // مثال: /api/products?category=Bedroom&minPrice=50&page=2
    const { category, minPrice, maxPrice, sort, search } = req.query;
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 12;

    // بناء شرط البحث خطوة بخطوة
    const searchQuery = {};

    if (category && category !== 'All Rooms') {
      searchQuery.category = category;
    }

    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    if (search) {
      searchQuery.name = { $regex: search, $options: 'i' }; // بحث غير case-sensitive
    }

    // تحديد ترتيب النتائج
    let sortOptions = {};
    if (sort === 'price_asc')  sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating')     sortOptions = { rating: -1 };
    else sortOptions = { createdAt: -1 }; // الأحدث أولاً (الافتراضي)

    // حساب كم نتخطى (للصفحات)
    const skip = (page - 1) * limit;

    // جلب العدد الكلي والمنتجات
    const total = await Product.countDocuments(searchQuery);
    const products = await Product.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      products: products,
      total:    total,
      page:     page,
      pages:    Math.ceil(total / limit),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/products/featured - المنتجات المميزة ----
exports.getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/products/new-arrivals - المنتجات الجديدة ----
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNew: true })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- GET /api/products/:id - منتج واحد ----
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- POST /api/products - إضافة منتج جديد (أدمن فقط) ----
exports.createProduct = async (req, res) => {
  try {
    // تحويل الصور المرفوعة لمسارات
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => '/uploads/' + file.filename);
    }

    const newProduct = await Product.create({ ...req.body, images: images });
    res.status(201).json(newProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- PUT /api/products/:id - تعديل منتج (أدمن فقط) ----
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // إرجاع النسخة الجديدة بعد التعديل
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- DELETE /api/products/:id - حذف منتج (أدمن فقط) ----
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---- POST /api/products/:id/reviews - إضافة تقييم ----
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // جلب المنتج
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // التحقق أن المستخدم لم يقيّم هذا المنتج من قبل
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    // إنشاء الريفيو الجديد
    const newReview = {
      user:    req.user._id,
      name:    req.user.firstName + ' ' + req.user.lastName,
      avatar:  req.user.avatar,
      rating:  Number(rating),
      comment: comment,
    };

    // إضافة الريفيو في أول المصفوفة
    product.reviews.unshift(newReview);

    // إعادة حساب متوسط التقييم
    product.calcAvgRating();

    await product.save();
    res.status(201).json({ message: 'Review added successfully' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
