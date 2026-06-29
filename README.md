# Ram Enterprise - E-Commerce Platform

Modern premium e-commerce platform built with React.js and Firebase.

## 🚀 Features

- ✅ Modern premium light/cream theme design
- ✅ Complete e-commerce flow (browse → cart → checkout → orders)
- ✅ Firebase Authentication with email/password
- ✅ Strong password validation (min 8 chars, uppercase, lowercase, number)
- ✅ Duplicate email prevention
- ✅ Firebase Firestore for data storage
- ✅ Admin Panel with dashboard, orders, products management
- ✅ Real-time order status updates
- ✅ Responsive design (mobile + desktop)
- ✅ Professional UI/UX with animations

## 🛠️ Tech Stack

- **Frontend:** React.js 18, Vite
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Authentication + Firestore)
- **State Management:** React Hooks + LocalStorage

## 📦 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Ram-Enterprise-Project/frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Edit `.env` file with your Firebase credentials:**

```env
# Get these from Firebase Console → Project Settings
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Set your admin credentials
VITE_ADMIN_EMAIL=admin@ramenterprise.com
VITE_ADMIN_PASSWORD=Admin@123
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔐 Security Features

### Password Requirements:
- ✓ Minimum 8 characters
- ✓ At least 1 uppercase letter (A-Z)
- ✓ At least 1 lowercase letter (a-z)
- ✓ At least 1 number (0-9)

### Email Validation:
- ✓ Valid email format check
- ✓ Duplicate email prevention via Firebase Auth
- ✓ Only registered users can sign in

### Admin Credentials:
- ✓ Stored in `.env` file (NOT in code)
- ✓ `.env` file excluded from Git (.gitignore)
- ✓ Secure admin panel access

## 👥 User Roles

### Customer:
- Browse products
- Add to cart
- Checkout and place orders
- View order history
- Track order status

### Admin:
- Email: (from `.env` file)
- Password: (from `.env` file)
- Access admin panel
- Manage orders (view, update status)
- Manage products (add, edit, delete)
- View dashboard with stats
- View customer list

## 📂 Project Structure

```
frontend/
├── src/
│   ├── Components/
│   │   ├── AdminPanel.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── SideBar.jsx
│   │   └── UserOrders.jsx
│   ├── App.jsx
│   ├── firebase.config.jsx
│   ├── firebaseUtils.js
│   ├── Homescreen.jsx
│   ├── LoginScree.jsx
│   └── main.jsx
├── .env (NOT in Git)
├── .env.example
├── .gitignore
└── package.json
```

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database**
5. Create collections: `products`, `orders`, `users`
6. Copy config to `.env` file

## 📝 License

© 2026 Ram Enterprise. All rights reserved.

---

**Built with ❤️ using React.js + Firebase + Tailwind CSS**
