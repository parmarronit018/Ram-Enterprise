# Tech Stack & Build System

## Architecture

Monorepo with two independent apps:
- `backend/` — Node.js REST API
- `frontend/` — React SPA

---

## Backend

| Concern | Choice |
|---------|--------|
| Runtime | Node.js (CommonJS — `require`/`module.exports`) |
| Framework | Express 4 |
| Database | MongoDB via Mongoose 8 |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` for password hashing |
| Config | `dotenv` (`.env` file at `backend/.env`) |
| Dev server | `nodemon` |

### Required Environment Variables (`backend/.env`)
```
MONGO_URI=
JWT_SECRET=
PORT=5000
```

### Backend Commands
```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

---

## Frontend

| Concern | Choice |
|---------|--------|
| Framework | React 18 (JSX, functional components + hooks) |
| Module system | ES Modules (`import`/`export`) |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 (with custom theme) |
| HTTP client | Axios |
| Backend-as-a-Service | Firebase 12 (Auth + Firestore) |

### Required Environment Variables (`frontend/.env`)
Firebase config keys — see `frontend/.env.example` for the full list.

### Frontend Commands
```bash
# Development server
npm run dev

# Production build (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## Key Libraries & Patterns

- **State management**: React `useState` / `useEffect` only — no Redux or external state library
- **Routing**: No router library; navigation is handled via an `activeView` string state in `App.jsx`
- **Firebase SDK**: Firestore for data persistence; Firebase Auth for user accounts
- **Tailwind custom theme**: Extended colors (`cream`, `brand`), shadows (`card`, `card-lg`, `btn`, `glow`), animations (`fadeUp`, `fadeIn`, `slideInRight`) — always use these tokens instead of arbitrary values
- **No test framework** is currently configured

---

## API Base URL

Backend runs on `http://localhost:5000` by default. Frontend should point `VITE_API_URL` (or equivalent) to this during development.
