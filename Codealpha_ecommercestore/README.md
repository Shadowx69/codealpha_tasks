# WonderLand ToyStore 🧸

A full-stack e-commerce web application for a toy store. Built with React and Node.js/Express backed by a MySQL database. Features product browsing, a shopping cart, order purchasing, an admin panel, a user profile with address management, and an interactive 3D model viewer.

---

## Features

- 🔐 **Authentication** — Register & login with JWT (1-hour token, stored as HTTP-only cookie). Supports both regular users and admins from separate DB tables
- 🛍️ **Product Browsing** — Browse all products with category filtering and keyword search
- 🛒 **Shopping Cart** — Add products to cart with size & quantity, view and clear cart (per user)
- 💳 **Buy Now** — Purchase products with stock validation and automatic stock deduction via MySQL transactions
- 🧑‍💼 **Admin Panel** — Protected dashboard to add, update, and delete products and categories
- 👤 **User Profile** — Update display name and shipping address (Street, City, State, Zip, Country)
- 🧊 **3D Model Viewer** — Interactive WebGL toy model with orbit controls, auto-rotate, and performance monitoring
- 🎞️ **Animated Hero** — GSAP page transition overlay and rotating hero text carousel
- 📱 **Responsive UI** — Fully responsive layout with a navbar, footer, and animated moving strip

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| React Router v7 | Client-side routing |
| Axios | HTTP requests to the API |
| GSAP | Page load animation overlay |
| React Three Fiber + Drei | 3D WebGL model viewer |
| Three.js | 3D rendering engine |
| React Slick | Product carousel/slider |
| jwt-decode | Decode JWT on the client |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | HTTP server & REST API |
| MySQL2 | Relational database driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

---

## Project Structure

```
Codealpha_ecommercestore/
└── ecommerce/
    ├── MySQL DB Schema.txt       # Full MySQL schema (run this first)
    ├── api/                      # Node.js/Express backend
    │   ├── index.js              # Entry point, route registration
    │   ├── db.js                 # MySQL connection
    │   ├── controllers/
    │   │   ├── auth.js           # Register, login, logout
    │   │   ├── admin.js          # CRUD for products & categories
    │   │   ├── product.js        # Get all products
    │   │   ├── ProductsS.js      # Product search
    │   │   ├── cartController.js # Add, get, clear cart
    │   │   ├── order.js          # Buy product (stock & address validation)
    │   │   ├── category.js       # Get categories
    │   │   ├── user.js           # Get user, update address/name
    │   │   ├── orderdetail.js    # Order details
    │   │   └── payment.js        # Payment records
    │   └── routes/               # Express routers (one per controller)
    └── client/                   # React frontend (Vite)
        └── src/
            ├── App.jsx           # Root component, routes, GSAP overlay
            ├── components/
            │   ├── Navbar.jsx        # Top navigation bar
            │   ├── Footer.jsx        # Site footer
            │   ├── CartContext.jsx   # Global cart state (React Context)
            │   ├── Product.jsx       # Product card component
            │   ├── Model3D.jsx       # Loads & renders .glb 3D model
            │   ├── DotGrid.jsx       # Interactive dot grid background
            │   ├── MovingS.jsx       # Animated horizontal scrolling strip
            │   └── AuthCallback.jsx  # OAuth callback handler
            ├── pages/
            │   ├── Home.jsx          # Hero, featured products, sections
            │   ├── Products.jsx      # Full product listing with search
            │   ├── ProductP.jsx      # Single product detail & buy/cart
            │   ├── Login.jsx         # Login form
            │   ├── Register.jsx      # Registration form
            │   ├── Profile.jsx       # Edit name & shipping address
            │   ├── Admin.jsx         # Admin dashboard (tabbed CRUD)
            │   ├── ModelPage.jsx     # Interactive 3D viewer page
            │   ├── About.jsx         # About page
            │   └── Contact.jsx       # Contact page
            └── utils/
                └── axios.js          # Axios instance with base URL
```

---

## Database Schema

The database is **MySQL**. Run the `MySQL DB Schema.txt` file to create the schema.

| Table | Description |
|---|---|
| `Users` | Registered users (UserName, Email, PasswordHash, Address) |
| `Admin` | Admin accounts (plain-text password, separate from users) |
| `Categories` | Product categories (CategoryName, Description) |
| `Products` | Products (Name, Description, Price, Stock, CategoryID, Cover URL) |
| `Cart` | Cart items per user (ProductName, Price, Size, Quantity, Cover) |
| `Payments` | Payment records (Method, Status, PaidAmount) |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL server running locally

### 1. Clone the repository
```bash
git clone <repo-url>
cd Codealpha_ecommercestore/ecommerce
```

### 2. Setup the Database
Open MySQL and run the full contents of `MySQL DB Schema.txt` to create the `ecommerce` database and all tables.

### 3. Setup the API
```bash
cd api
npm install
```

Create a `.env` file inside `api/`:
```env
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

Update `db.js` with your MySQL credentials if different from the defaults:
```js
host: "localhost",
user: "root",
password: "your_mysql_password",
database: "ecommerce"
```

Start the API server:
```bash
npm run dev     # development (nodemon)
```

The API will run on `http://localhost:8800`.

### 4. Setup the Client
```bash
cd ../client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login (user or admin), returns JWT cookie |
| `POST` | `/api/auth/logout` | Clear auth cookie |

### Products
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/productsS` | Search products by keyword |

### Categories
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/categories` | Get all categories |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/cart/add` | Add item to cart |
| `GET` | `/api/cart/:userId` | Get cart items for a user |
| `DELETE` | `/api/cart/clearCart` | Clear all cart items |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders` | Buy a product (validates address & stock) |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/:id` | Get user profile |
| `PUT` | `/api/users/:id/address` | Update name and shipping address |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/adminR/add-category` | Add a new category |
| `POST` | `/api/adminR/update-category` | Update a category |
| `POST` | `/api/adminR/delete-category` | Delete a category |
| `POST` | `/api/adminR/add-product` | Add a new product |
| `POST` | `/api/adminR/update-product` | Update a product |
| `POST` | `/api/adminR/delete-product` | Delete a product |
