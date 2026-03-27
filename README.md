# VisioCreate — MERN Stack E-Commerce

A full-featured furniture & home decoration e-commerce app built with the MERN stack, styled to match the VisioCreate design system.

---

## 🗂 Project Structure

```
visiocreate/
├── backend/
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   └── blogController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect + adminOnly
│   │   └── upload.js          # Multer file upload
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   └── blogRoutes.js
│   ├── uploads/            # Uploaded images (auto-created)
│   ├── server.js
│   ├── seed.js             # Database seeder
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   ├── FlyoutCart.js
        │   ├── ProductCard.js
        │   ├── Newsletter.js
        │   ├── CheckoutSteps.js
        │   └── PrivateRoute.js
        ├── context/
        │   ├── AuthContext.js
        │   ├── CartContext.js
        │   └── ToastContext.js
        ├── pages/
        │   ├── HomePage.js
        │   ├── ShopPage.js
        │   ├── ProductPage.js
        │   ├── CartPage.js
        │   ├── CheckoutPage.js
        │   ├── OrderCompletePage.js
        │   ├── BlogPage.js
        │   ├── ContactPage.js
        │   ├── SignInPage.js
        │   └── MyAccountPage.js
        ├── utils/
        │   └── api.js         # Axios instance with JWT interceptor
        ├── App.js             # Router setup
        ├── index.js
        └── index.css          # Global styles (VisioCreate design system)
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
```

### 2. Seed the Database (optional but recommended)
```bash
cd backend
node seed.js
# Creates: admin@visiocreate.com / admin123
#          sofia@example.com / user123
# + 15 sample products + 6 blog posts
```

### 3. Start Backend
```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start       # runs on http://localhost:3000
```

---

## 🔑 Environment Variables (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/visiocreate
JWT_SECRET=your_super_secret_jwt_key_here_change_this
NODE_ENV=development
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | — |
| POST | /api/auth/login | Login | — |
| GET | /api/auth/me | Get current user | ✅ |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/products | Get all (with filters) | — |
| GET | /api/products/featured | Featured products | — |
| GET | /api/products/new-arrivals | New arrivals | — |
| GET | /api/products/:id | Single product | — |
| POST | /api/products | Create product | Admin |
| PUT | /api/products/:id | Update product | Admin |
| DELETE | /api/products/:id | Delete product | Admin |
| POST | /api/products/:id/reviews | Add review | ✅ |

#### Product Query Params
- `category` — Living Room, Bedroom, Kitchen, etc.
- `minPrice`, `maxPrice` — price range
- `sort` — price_asc, price_desc, rating
- `search` — text search on product name
- `page`, `limit` — pagination

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/orders | Create order | ✅ |
| GET | /api/orders/my | My orders | ✅ |
| GET | /api/orders/:id | Single order | ✅ |
| GET | /api/orders/admin | All orders | Admin |
| PUT | /api/orders/:id/status | Update status | Admin |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PUT | /api/users/profile | Update profile | ✅ |
| PUT | /api/users/change-password | Change password | ✅ |
| GET | /api/users/wishlist | Get wishlist | ✅ |
| POST | /api/users/wishlist/:productId | Toggle wishlist item | ✅ |

### Blog
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/blog | Get all posts | — |
| GET | /api/blog/:id | Single post | — |
| POST | /api/blog | Create post | Admin |
| DELETE | /api/blog/:id | Delete post | Admin |

---

## 🎨 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero slider, categories, new arrivals, promo, blog |
| Shop | `/shop` | Filter sidebar, sort, grid/list view, pagination |
| Product | `/product/:id` | Gallery, color picker, countdown, reviews |
| Cart | `/cart` | Cart table, shipping selector, coupon code |
| Checkout | `/checkout` | Contact, shipping address, payment method |
| Order Complete | `/order-complete` | Confirmation with order details |
| Blog | `/blog` | Grid with filter tabs |
| Contact | `/contact` | Form + map + about section |
| Sign In/Up | `/signin` | Split-screen auth layout |
| My Account | `/account` | Profile, password, address, orders, wishlist |

---

## 🧰 Tech Stack

### Backend
- **Express.js** — web framework
- **Mongoose** — MongoDB ODM
- **bcryptjs** — password hashing
- **jsonwebtoken** — JWT auth
- **multer** — file uploads
- **morgan** — HTTP logging
- **cors** — cross-origin headers
- **dotenv** — environment config

### Frontend
- **React 18** — UI library
- **React Router DOM v6** — client-side routing
- **Bootstrap 5** — responsive grid + utilities
- **Bootstrap Icons** — icon library
- **Axios** — HTTP client
- **Context API** — state management (Auth, Cart, Toast)
- **DM Serif Display + DM Sans** — typography

---

## 🔐 Default Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@visiocreate.com | admin123 |
| User | sofia@example.com | user123 |

---

## 📁 File Upload

Product images and avatars upload to `backend/uploads/`.
They're served statically at `http://localhost:5000/uploads/filename.jpg`.

---

## 🧩 Coupon Codes (demo)
- `SAVE25` — $25 discount on cart

---

## ✅ Features
- [x] JWT auth (register/login/protected routes)
- [x] Product filtering by category + price + search
- [x] Product color variants
- [x] Countdown timer on product page
- [x] Fly-out cart drawer
- [x] 3-step checkout flow
- [x] Coupon code system
- [x] Customer reviews with ratings
- [x] Wishlist management
- [x] Order history
- [x] Blog with pagination
- [x] Contact form with map
- [x] Newsletter signup
- [x] Toast notifications
- [x] Mobile responsive
- [x] Image upload with Multer
