# Project Structure

```
Ram-Enterprise-Project/
├── backend/                        # Node.js/Express REST API
│   ├── index.js                    # Entry point — Express app, DB connection, route mounting
│   ├── .env                        # Environment variables (MONGO_URI, JWT_SECRET, PORT)
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT protect() + adminOnly() middleware
│   ├── models/
│   │   ├── User.js                 # Mongoose schema — name, email, password (hashed), phone, isAdmin
│   │   ├── Product.js              # Mongoose schema — name, description, price, image, category, stock
│   │   └── Order.js                # Mongoose schema — userId, items[], total, address, phone, paymentMethod, status
│   └── routes/
│       ├── authRoutes.js           # POST /api/auth/register, POST /api/auth/login
│       ├── productRoutes.js        # GET /api/products, POST/PUT/DELETE (admin only)
│       └── orderRoutes.js          # POST /api/orders/create, GET my-orders/:userId, GET /all (admin), PUT update-status
│
└── frontend/                       # React SPA (Vite)
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js          # Custom theme tokens (cream, brand colors, shadows, animations)
    ├── postcss.config.js
    ├── .env                        # Firebase config keys
    ├── .env.example                # Template for required env vars
    └── src/
        ├── main.jsx                # React DOM entry point
        ├── App.jsx                 # Root component — global state, navigation logic, ALL_PRODUCTS fallback
        ├── index.css               # Global styles, custom CSS classes, Tailwind directives
        ├── firebase.config.jsx     # Firebase app initialisation (db, auth exports)
        ├── firebaseUtils.js        # All Firestore/Auth operations (fetchProducts, createOrder, loginUser, etc.)
        ├── Homescreen.jsx          # Product grid view
        ├── LoginScree.jsx          # Login / Sign-up screen (note: intentional typo in filename)
        ├── Paymentsuccessscreen.jsx
        ├── Processingscreen.jsx
        └── Components/
            ├── AdminPanel.jsx      # Admin dashboard — product CRUD, order management
            ├── AdminSidebar.jsx    # Sidebar navigation for admin panel
            ├── Cart.jsx            # Cart view
            ├── Checkout.jsx        # Address selection + payment method
            ├── Footer.jsx
            ├── ProductCard.jsx     # Individual product tile
            ├── ProductDetail.jsx   # Full product detail view
            ├── SideBar.jsx         # User-facing slide-out navigation
            └── UserOrders.jsx      # User order history view
```

---

## Key Conventions

### Navigation
There is no router. All view switching happens via `activeView` state in `App.jsx` using `handleNavigate(view)`. Valid view names: `"login"`, `"home"`, `"cart"`, `"checkout"`, `"orders"`, `"admin"`, `"payment-success"`.

### Backend API Routes
All routes are prefixed: `/api/auth`, `/api/products`, `/api/orders`. Protected routes require `Authorization: Bearer <token>` header.

### Admin Access
- Backend: `adminOnly` middleware checks `req.user.isAdmin` from JWT payload
- Frontend: `isAdmin` state flag gates the Admin Panel view; hardcoded admin email is `admin@ramenterprise.com`

### Data Flow
1. Firebase Firestore is the primary data store for products, orders, and users
2. `firebaseUtils.js` is the single module for all Firebase read/write operations — add new Firestore logic here, not inline in components
3. `localStorage` keys: `ram_user`, `ram_is_admin`, `ram_cart`, `ram_orders`, `ram_wishlist`, `ram_addresses`, `ram_payments`

### Component Placement
- Screen-level views (full page) go in `src/` root
- Reusable UI components go in `src/Components/`
- Global state and shared handlers live in `App.jsx` and are passed down as props

### Styling
- Use Tailwind utility classes exclusively; avoid inline styles
- Use custom theme tokens (`brand`, `cream`, `card`, `card-lg`, `btn`, `glow`) — do not use arbitrary Tailwind values for colors or shadows that have theme equivalents
- Custom non-Tailwind classes (`.shimmer`, `.navbar-glass`, `.toast`, `.cursor-glow-layer`, etc.) are defined in `index.css`
