# GoCart Backend API

Node.js/Express backend for GoCart e-commerce application with MongoDB.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed locally or use MongoDB Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/gocart
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# Windows
mongod

# Or using MongoDB service
net start MongoDB
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `PATCH /api/products/:id/stock` - Toggle stock (Admin)
- `POST /api/products/:id/images` - Upload image (Admin)
- `DELETE /api/products/:id/images/:imageId` - Delete image (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/coupon` - Apply coupon
- `DELETE /api/cart/coupon` - Remove coupon

### Addresses
- `GET /api/addresses` - Get all addresses
- `GET /api/addresses/:id` - Get single address
- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PATCH /api/addresses/:id/default` - Set as default

### Ratings
- `GET /api/ratings/product/:productId` - Get product ratings
- `GET /api/ratings/user/:productId` - Get user's rating
- `GET /api/ratings/average/:productId` - Get average rating
- `POST /api/ratings` - Submit rating
- `PUT /api/ratings/:ratingId` - Update rating
- `DELETE /api/ratings/:ratingId` - Delete rating

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/user` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update status (Admin)
- `PATCH /api/orders/:id/cancel` - Cancel order

## Database Models

### User
- name, email, password, role (user/admin), phone, avatar, isActive

### Product
- name, description, price, mrp, category, images, inStock, stockQuantity, brand, tags, specifications, averageRating, numReviews

### Cart
- user, items (product, quantity, price), coupon (code, discount)

### Address
- user, fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault, addressType

### Rating
- user, product, rating (1-5), review

### Order
- user, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice, status (pending/processing/shipped/delivered/cancelled)

## Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

Admin routes require user role to be 'admin'.

## Project Structure

```
gocart-backend/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── addressController.js
│   ├── ratingController.js
│   └── orderController.js
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   ├── Address.js
│   ├── Rating.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── addresses.js
│   ├── ratings.js
│   └── orders.js
├── server.js              # Entry point
├── package.json
└── .env.example
```

## Testing

You can test the API using:
- Postman
- Thunder Client (VS Code extension)
- cURL

Example request:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"123456"}'
```
