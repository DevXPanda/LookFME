# LookFame - E-Commerce Platform Project Index

## 📋 Project Overview

**LookFame** is a full-stack e-commerce platform built on the Shofy template. The platform consists of a customer-facing frontend, an administrative dashboard, and a RESTful API backend. It's designed for fashion/retail e-commerce with features including product management, order processing, user authentication, and payment integration.

**Project Structure:**
- Frontend (Customer-facing Next.js application)
- Admin Panel (Administrative dashboard)
- Backend API (Node.js/Express/MongoDB)
- Documentation (HTML documentation)

---

## 🏗️ Architecture Overview

```
LookFameF/
├── shofy-front-end/        # Customer-facing e-commerce site
├── shofy-admin-panel/      # Administrative dashboard
├── shofy-backend/          # RESTful API server
├── documentation/          # Project documentation
└── test-admin-panel/       # Test/development admin panel
```

---

## 📦 Component Details

### 1. Frontend (`shofy-front-end`)

**Technology Stack:**
- Framework: Next.js 15.0.7
- UI Library: React 18
- State Management: Redux Toolkit (@reduxjs/toolkit)
- Styling: Tailwind CSS, SCSS, Bootstrap 5.3.2
- Forms: React Hook Form, Yup validation
- Payment: Stripe integration
- Other: React Slick, Swiper, React Toastify, React OAuth (Google)

**Key Features:**
- Product catalog and search
- Shopping cart and checkout
- User authentication (login/register)
- Order tracking
- Wishlist functionality
- Product reviews and ratings
- Blog system
- User profile management
- Coupon/discount codes
- Stripe payment integration

**Key Directories:**
```
src/
├── app/                    # Next.js app router pages
│   ├── shop/              # Product listing pages
│   ├── product-details/   # Individual product pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── profile/           # User profile
│   ├── order/             # Order management
│   ├── wishlist/          # Wishlist
│   ├── blog/              # Blog pages
│   └── ...
├── components/            # React components (183 files)
│   ├── products/          # Product-related components (25 files)
│   │   ├── beauty/       # Beauty product components (4 files)
│   │   ├── electronics/  # Electronics components (10 files)
│   │   ├── fashion/      # Fashion components (6 files)
│   │   └── jewelry/      # Jewelry components (5 files)
│   ├── shop/              # Shop page components (14 files)
│   │   └── shop-filter/  # Shop filtering components (7 files)
│   ├── cart-wishlist/     # Cart and wishlist (5 files)
│   ├── checkout/          # Checkout components (5 files)
│   ├── blog/              # Blog components (11 files)
│   │   ├── blog-grid/    # Blog grid layout (4 files)
│   │   ├── blog-postox/  # Blog post components (3 files)
│   │   ├── electronic/   # Electronic blog (2 files)
│   │   └── fashion/      # Fashion blog (2 files)
│   ├── blog-details/      # Blog detail pages (6 files)
│   ├── product-details/   # Product detail components (10 files)
│   ├── my-account/        # Account management (7 files)
│   ├── forms/             # Form components (7 files)
│   ├── login-register/    # Auth components (5 files)
│   ├── banner/            # Banner components (3 files)
│   ├── categories/        # Category components (6 files)
│   ├── coupon/            # Coupon components (4 files)
│   ├── loader/            # Loading components (28 files)
│   │   ├── home/         # Home loaders (7 files)
│   │   ├── home-2/       # Home variant 2 loaders (6 files)
│   │   ├── home-3/       # Home variant 3 loaders (4 files)
│   │   └── shop/         # Shop loaders (6 files)
│   ├── layout/            # Layout components
│   │   ├── headers/      # Header variants (11 files)
│   │   └── footers/      # Footer variants (2 files)
│   ├── common/            # Common/shared components (10 files)
│   ├── breadcrumb/        # Breadcrumb components (5 files)
│   ├── features/          # Feature components (4 files)
│   ├── testimonial/       # Testimonial components (2 files)
│   ├── instagram/         # Instagram feed (4 files)
│   ├── contact/           # Contact components (2 files)
│   ├── order/             # Order components (1 file)
│   ├── compare/           # Product comparison (1 file)
│   ├── search/            # Search components (1 file)
│   ├── ui/                # UI components (2 files)
│   └── ...                # Additional components
├── redux/                 # Redux store and slices
│   ├── store.js          # Redux store configuration
│   ├── api/              # API configuration
│   └── features/         # Redux slices
│       ├── auth/         # Authentication (authApi.js, authSlice.js)
│       ├── cartSlice.js  # Shopping cart state
│       ├── wishlist-slice.js  # Wishlist state
│       ├── compareSlice.js    # Product comparison state
│       ├── productModalSlice.js  # Product modal state
│       ├── shop-filter-slice.js  # Shop filtering state
│       ├── productApi.js        # Product API calls
│       ├── categoryApi.js       # Category API calls
│       ├── brandApi.js          # Brand API calls
│       ├── reviewApi.js         # Review API calls
│       ├── coupon/              # Coupon state (couponApi.js, couponSlice.js)
│       └── order/               # Order state (orderApi.js, orderSlice.js)
├── hooks/                 # Custom React hooks (5 files)
│   ├── use-auth-check.js        # Authentication check hook
│   ├── use-cart-info.js         # Cart information hook
│   ├── use-checkout-submit.js   # Checkout submission hook
│   ├── use-search-form-submit.js # Search form hook
│   └── use-sticky.js            # Sticky header hook
├── layout/                # Layout components
├── data/                  # Static data
├── utils/                 # Utility functions
└── styles/                # Global styles
```

**Main Pages (51 pages):**
- `/` - Home page
- `/home-2` - Home variant 2
- `/home-3` - Home variant 3
- `/home-4` - Home variant 4
- `/shop` - Shop page
- `/shop-category` - Shop with category filter
- `/shop-right-sidebar` - Shop with right sidebar
- `/shop-hidden-sidebar` - Shop with hidden sidebar
- `/product-details/[id]` - Product details page
- `/product-details-countdown` - Product with countdown timer
- `/product-details-swatches` - Product with color swatches
- `/product-details-video` - Product with video
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/login` - User login
- `/register` - User registration
- `/forgot` - Forgot password
- `/forget-password/[token]` - Reset password with token
- `/email-verify/[token]` - Email verification
- `/profile` - User profile
- `/order/[id]` - Order details
- `/track-orders` - Order tracking
- `/wishlist` - Wishlist page
- `/compare` - Product comparison
- `/blog` - Blog listing
- `/blog-grid` - Blog grid view
- `/blog-list` - Blog list view
- `/blog-details/[id]` - Blog details
- `/blog-details-2/[id]` - Blog details variant 2
- `/search` - Search results
- `/coupon` - Coupon page
- `/combo-details/[id]` - Combo product details
- `/about-us` - About page
- `/contact` - Contact page
- `/faqs` - FAQ page
- `/careers` - Careers page
- `/privacy-policy` - Privacy policy
- `/terms` - Terms of service
- `/return-policy` - Return policy
- `/shipping-policy` - Shipping policy
- `/cookies` - Cookie policy
- `/cosmetic` - Cosmetic page
- `/junior` - Junior products page

---

### 2. Admin Panel (`shofy-admin-panel`)

**Technology Stack:**
- Framework: Next.js 14.2.35
- Language: TypeScript
- UI Library: React 18.2.0
- State Management: Redux Toolkit
- Styling: Tailwind CSS, Material Tailwind
- Forms: React Hook Form, Yup validation
- Charts: Chart.js, React Chart.js 2
- File Upload: React Dropzone, Cloudinary
- UI Components: Heroicons, React Select, SweetAlert2

**Key Features:**
- Dashboard with analytics and charts
- Product management (add/edit/delete)
- Category management (hierarchical)
- Brand management
- Order management and tracking
- Coupon management
- Staff/Admin user management
- Review moderation
- Sales reporting

**Key Directories:**
```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Main dashboard
│   ├── add-product/       # Add new product
│   ├── edit-product/      # Edit existing product
│   ├── product-grid/      # Product grid view
│   ├── product-list/      # Product list view
│   ├── category/          # Category management
│   ├── brands/            # Brand management
│   ├── orders/            # Order management
│   ├── coupon/            # Coupon management
│   ├── reviews/           # Review moderation
│   ├── our-staff/         # Staff management
│   └── ...
├── components/            # React components (83 files)
│   ├── products/          # Product management components
│   ├── category/          # Category components
│   ├── brand/             # Brand components
│   ├── orders/            # Order components
│   ├── coupon/            # Coupon components
│   ├── dashboard/         # Dashboard components
│   └── ...
├── redux/                 # Redux store (TypeScript)
│   ├── store.ts          # Redux store configuration
│   ├── provider.tsx       # Redux provider component
│   ├── api/              # Base API slice
│   │   └── apiSlice.ts   # RTK Query base API
│   ├── auth/             # Authentication (authApi.ts, authSlice.ts)
│   ├── product/          # Product API (productApi.ts)
│   ├── category/         # Category API (categoryApi.ts)
│   ├── brand/            # Brand API (brandApi.ts)
│   ├── order/            # Order API (orderApi.ts)
│   ├── coupon/           # Coupon API (couponApi.ts)
│   ├── review/           # Review API (reviewApi.ts)
│   └── cloudinary/       # Cloudinary API (cloudinaryApi.ts, type.ts)
├── hooks/                 # Custom hooks (9 files)
│   ├── use-auth-check.ts        # Authentication check
│   ├── use-pagination.ts        # Pagination logic
│   ├── useBrandSubmit.ts        # Brand form submission
│   ├── useCategorySubmit.ts     # Category form submission
│   ├── useCouponSubmit.ts       # Coupon form submission
│   ├── useProductSubmit.ts      # Product form submission
│   ├── useStaffSubmit.ts        # Staff form submission
│   ├── useCloudinary.ts         # Cloudinary integration
│   └── useUploadImg.ts          # Image upload hook
├── types/                 # TypeScript type definitions (7 files)
│   ├── admin-type.ts      # Admin type definitions
│   ├── brand-type.ts      # Brand type definitions
│   ├── category-type.ts   # Category type definitions
│   ├── coupon.ts          # Coupon type definitions
│   ├── menu-types.ts      # Menu type definitions
│   ├── order-amount-type.ts  # Order amount types
│   └── product-type.ts    # Product type definitions
├── layout/                # Layout components
└── data/                  # Static data
```

**Main Sections:**
- Dashboard (analytics, sales reports, recent orders)
- Products (grid/list views, add/edit)
- Categories (hierarchical management)
- Brands
- Orders (list, details, status management, invoice printing)
- Coupons (create/edit/manage)
- Reviews (moderation)
- Staff Management
- Profile Settings

---

### 3. Backend API (`shofy-backend`)

**Technology Stack:**
- Runtime: Node.js (>=16)
- Framework: Express.js 4.18.2
- Database: MongoDB (Mongoose 7.0.1)
- Authentication: JWT (jsonwebtoken), bcryptjs
- File Upload: Multer, Cloudinary
- Payment: Stripe 12.4.0
- Email: Nodemailer
- Validation: Validator
- Other: Morgan (logging), CORS, dotenv

**Key Features:**
- RESTful API endpoints
- User authentication and authorization
- Product CRUD operations
- Category and Brand management
- Order processing
- Coupon system
- Review system
- Admin management
- File upload (Cloudinary integration)
- Payment processing (Stripe)
- Email notifications

**Project Structure:**
```
shofy-backend/
├── config/                 # Configuration files
│   ├── db.js              # MongoDB connection
│   ├── auth.js            # Auth configuration
│   ├── email.js           # Email configuration
│   └── secret.js          # Environment variables
├── controller/            # Route controllers (11 files)
│   ├── user.controller.js
│   ├── product.controller.js
│   ├── category.controller.js
│   ├── brand.controller.js
│   ├── order.controller.js
│   ├── coupon.controller.js
│   ├── review.controller.js
│   ├── admin.controller.js
│   └── ...
├── model/                 # Mongoose models (8 files)
│   ├── User.js
│   ├── Products.js
│   ├── Category.js
│   ├── Brand.js
│   ├── Order.js
│   ├── Coupon.js
│   ├── Review.js
│   └── Admin.js
├── routes/                # API routes (12 files)
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── category.routes.js
│   ├── brand.routes.js
│   ├── order.routes.js
│   ├── coupon.routes.js
│   ├── review.routes.js
│   ├── admin.routes.js
│   ├── user.order.routes.js
│   ├── cloudinary.routes.js
│   └── ...
├── middleware/            # Custom middleware
│   ├── verifyToken.js     # JWT verification
│   ├── authorization.js   # Role-based access
│   ├── uploder.js         # File upload handling
│   └── global-error-handler.js
├── services/              # Business logic services
│   ├── product.service.js
│   ├── category.service.js
│   ├── brand.service.js
│   └── cloudinary.service.js
├── errors/                # Error handling
├── utils/                 # Utility functions and seed data
├── index.js               # Entry point
└── seed.js                # Database seeding script
```

**API Routes:**

**User Routes (`/api/user`):**
- `POST /signup` - User registration
- `POST /login` - User login
- `PATCH /forget-password` - Request password reset
- `PATCH /confirm-forget-password` - Confirm password reset
- `PATCH /change-password` - Change user password
- `GET /confirmEmail/:token` - Email verification
- `PUT /update-user/:id` - Update user profile
- `POST /register/:token` - Google OAuth registration/login

**Product Routes (`/api/product`):**
- `POST /add` - Add single product
- `POST /add-all` - Add multiple products
- `GET /all` - Get all products
- `GET /offer` - Get offer timer products
- `GET /top-rated` - Get top rated products
- `GET /review-product` - Get products with reviews
- `GET /popular/:type` - Get popular products by type
- `GET /related-product/:id` - Get related products
- `GET /single-product/:id` - Get single product details
- `GET /stock-out` - Get out of stock products
- `PATCH /edit-product/:id` - Update product
- `GET /:type` - Get products by type
- `DELETE /:id` - Delete product

**Category Routes (`/api/category`):**
- Category CRUD operations

**Brand Routes (`/api/brand`):**
- Brand CRUD operations

**Order Routes (`/api/order`):**
- Admin order management

**User Order Routes (`/api/user-order`):**
- User-specific order operations

**Coupon Routes (`/api/coupon`):**
- Coupon CRUD operations

**Review Routes (`/api/review`):**
- Review CRUD operations

**Admin Routes (`/api/admin`):**
- Admin user management

**Cloudinary Routes (`/api/cloudinary`):**
- File upload operations

**Database Models:**
- User - Customer accounts
- Admin - Admin/staff accounts
- Products - Product catalog
- Category - Product categories (hierarchical)
- Brand - Product brands
- Order - Orders and transactions
- Coupon - Discount codes
- Review - Product reviews and ratings

---

## 🔧 Development Setup

### Prerequisites
- Node.js (>=16)
- MongoDB (local or cloud instance)
- npm or yarn

### Frontend Setup

```bash
cd shofy-front-end
npm install
npm run dev          # Development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Production server
```

### Admin Panel Setup

```bash
cd shofy-admin-panel
npm install
npm run dev          # Development server (http://localhost:3001)
npm run build        # Production build
npm run start        # Production server
```

### Backend Setup

```bash
cd shofy-backend
npm install

# Create .env file with required variables:
# - MONGO_URI (MongoDB connection string)
# - JWT_SECRET
# - PORT (default: 5000)
# - Cloudinary credentials
# - Stripe keys
# - Email service credentials

npm run dev          # Development server
npm run start-dev    # Development with nodemon
npm run data:import  # Seed database
```

**Backend Configuration:**
The backend requires environment variables in `config/secret.js`:
- MongoDB connection URI
- JWT secret key
- Port number
- Cloudinary credentials
- Stripe API keys
- Email service credentials

---

## 🔐 Security & Authentication

- **JWT-based authentication** for user sessions
- **Role-based access control** (User, Admin)
- **Password hashing** with bcryptjs
- **CORS** configured for allowed origins
- **Token verification** middleware for protected routes

---

## 📊 Key Features

### Customer Features
- Browse products with filtering and search
- Product reviews and ratings
- Shopping cart and wishlist
- Secure checkout with Stripe
- Order tracking
- User profile management
- Coupon code application
- Blog reading

### Admin Features
- Comprehensive dashboard with analytics
- Product management (CRUD operations)
- Category and Brand management
- Order management and status updates
- Coupon creation and management
- Review moderation
- Staff/Admin user management
- Sales reporting and charts
- Invoice generation and printing

---

## 🌐 Deployment

- **Frontend**: Vercel-ready (Next.js)
- **Admin Panel**: Vercel-ready (Next.js)
- **Backend**: Supports Vercel deployment (vercel.json included)
- **Database**: MongoDB (MongoDB Atlas or self-hosted)

**Production URLs:**
- Frontend: `https://look-fame-f.vercel.app`
- Production domain: `https://lookfame.in`

---

## 📁 Additional Directories

### Documentation (`documentation/`)
HTML-based documentation for the Shofy template, including:
- Setup instructions
- Feature documentation
- Customization guide

### Test Admin Panel (`test-admin-panel/`)
Duplicate of the admin panel for testing/development purposes.

---

## 🔗 Key Dependencies Summary

**Frontend:**
- Next.js, React, Redux Toolkit
- Tailwind CSS, Bootstrap, SCSS
- React Hook Form, Yup
- Stripe, React OAuth
- Various UI libraries (Slick, Swiper, etc.)

**Admin Panel:**
- Next.js, React, TypeScript
- Redux Toolkit
- Tailwind CSS, Material Tailwind
- Chart.js
- Cloudinary integration

**Backend:**
- Express.js
- Mongoose (MongoDB)
- JWT, bcryptjs
- Stripe
- Cloudinary
- Nodemailer

---

## 📝 Notes

- The backend `index.js` has commented-out code at the top (legacy code)
- Frontend uses Next.js 15, Admin Panel uses Next.js 14
- Frontend is JavaScript-based, Admin Panel is TypeScript-based
- Both frontends use Redux for state management
- Cloudinary is used for image storage and management
- Stripe is integrated for payment processing

---

## 🚀 Getting Started

1. Clone the repository
2. Set up MongoDB (local or cloud)
3. Configure environment variables for backend
4. Install dependencies for each component
5. Seed the database (optional): `cd shofy-backend && npm run data:import`
6. Start backend server
7. Start frontend and admin panel in separate terminals
8. Access:
   - Frontend: http://localhost:3000
   - Admin Panel: http://localhost:3001 (or configured port)
   - Backend API: http://localhost:5000 (or configured port)

---

---

## 📚 Detailed Component Index

### Frontend Components Breakdown

**Product Components (25 files):**
- Beauty products (4): Product cards, sliders, sections
- Electronics (10): Electronic product displays, grids, lists
- Fashion (6): Fashion product components, banners
- Jewelry (5): Jewelry-specific product displays

**Shop Components (14 files):**
- Shop area, content, filters
- Shop list items, grid views
- Top bar components (left/right)
- Filter components (7): Price, category, brand, rating filters

**Cart & Wishlist (5 files):**
- Cart area, cart items, checkout summary
- Wishlist area, wishlist items

**Checkout Components (5 files):**
- Checkout area, billing form
- Coupon application, login prompt
- Order summary

**Blog Components (17 files):**
- Blog grid layouts (4)
- Blog post components (3)
- Blog details (6)
- Category-specific blogs (4)

**Product Details (10 files):**
- Product details wrapper, content
- Image thumbnails, tabs navigation
- Quantity selector, countdown timer
- Related products, reviews

**Forms (7 files):**
- Login, register, contact forms
- Forgot password, review form
- Blog comment form, header search

**Layout Components:**
- Headers (11 variants): Different header styles
- Footers (2 variants): Footer layouts
- Breadcrumbs (5): Various breadcrumb styles

**Common Components (10 files):**
- Back to top, mobile menus
- Off-canvas, modals
- Product quick view, cart sidebar
- Error messages, timers

**Loader Components (28 files):**
- Home page loaders (7)
- Home variant 2 loaders (6)
- Home variant 3 loaders (4)
- Shop loaders (6)
- Product details, search loaders

---

## 🔄 Redux State Management

### Frontend Redux Structure

**Store Configuration:**
- `store.js` - Main Redux store setup

**API Slices:**
- `productApi.js` - Product data fetching
- `categoryApi.js` - Category data
- `brandApi.js` - Brand data
- `reviewApi.js` - Review data
- `couponApi.js` - Coupon data
- `orderApi.js` - Order data

**State Slices:**
- `authSlice.js` - Authentication state
- `cartSlice.js` - Shopping cart state
- `wishlist-slice.js` - Wishlist state
- `compareSlice.js` - Product comparison
- `productModalSlice.js` - Modal state
- `shop-filter-slice.js` - Shop filtering state
- `couponSlice.js` - Coupon state
- `orderSlice.js` - Order state

### Admin Panel Redux Structure

**Store Configuration:**
- `store.ts` - TypeScript Redux store
- `provider.tsx` - Redux provider wrapper

**API Slices (RTK Query):**
- `apiSlice.ts` - Base API slice
- `authApi.ts` - Admin authentication
- `productApi.ts` - Product management
- `categoryApi.ts` - Category management
- `brandApi.ts` - Brand management
- `orderApi.ts` - Order management
- `couponApi.ts` - Coupon management
- `reviewApi.ts` - Review management
- `cloudinaryApi.ts` - File upload

**State Slices:**
- `authSlice.ts` - Admin auth state

---

## 🗂️ File Structure Summary

### Frontend (`shofy-front-end`)
- **Total Components:** 183 JSX files
- **Pages:** 51 pages
- **Redux Slices:** 15 files
- **Hooks:** 5 custom hooks
- **SVG Icons:** 80 icon components
- **Data Files:** 5 static data files

### Admin Panel (`shofy-admin-panel`)
- **Total Components:** 83+ TSX files
- **Pages:** 20+ pages
- **Redux Slices:** 9 API slices
- **Hooks:** 9 custom hooks
- **Type Definitions:** 7 TypeScript type files
- **SVG Icons:** 33 icon components

### Backend (`shofy-backend`)
- **Controllers:** 11 controller files
- **Models:** 8 Mongoose models
- **Routes:** 11 route files
- **Middleware:** 4 middleware files
- **Services:** 4 service files
- **Utils:** 12+ utility files with seed data

---

*Last Updated: Enhanced Project Index*
*Project: LookFame E-Commerce Platform*
*Total Files Indexed: 400+ files*

