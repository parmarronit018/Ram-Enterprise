# Ram Enterprise — Product Overview

Ram Enterprise is a full-stack e-commerce web application for an Indian retail brand selling fashion, electronics, gaming, and home products.

## Core Features

- **Product catalog** — browsable grid with category filtering, search, and price sorting
- **Shopping cart & checkout** — cart management, address selection, and multi-payment-method checkout (UPI, Card, COD)
- **Order management** — users can view their order history; admins can view all orders and update statuses
- **Authentication** — user sign-up/login via Firebase Auth; hardcoded admin account (`admin@ramenterprise.com`)
- **Admin panel** — product CRUD and order status management, accessible only to admin users
- **Wishlist** — users can save products for later

## User Roles

| Role  | Access |
|-------|--------|
| Guest | Browse products only; redirected to login on cart/buy actions |
| User  | Full shopping experience, order history |
| Admin | All user features + Admin Panel (product/order management) |

## Data & Persistence

- **Primary store**: Firebase Firestore (products, orders, users)
- **Fallback / session data**: `localStorage` (cart, wishlist, addresses, payments, session user)
- Products fall back to a hardcoded `ALL_PRODUCTS` array in `App.jsx` if Firestore is unavailable

## Brand Identity

- Brand name: **Ram Enterprise**
- Primary brand color: deep green (`#2d6a4f`) with light green accent (`#52b788`)
- Typography: Inter (sans-serif body) + Playfair Display (serif display/headings)
- Aesthetic: warm cream backgrounds, card-based layouts, smooth animations
