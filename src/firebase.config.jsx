// src/firebase.config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyCMtJGIqDTMddPefkVEQM_ILz6qtuxFF88",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "ram-enterprise-1c261.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "ram-enterprise-1c261",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "ram-enterprise-1c261.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID|| "433135380302",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:433135380302:web:20fce7507471fd0055201f",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || "G-3TWSWTP75N",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Check if user is admin based on email domain
export const checkIsAdmin = (email) => {
  // Admin emails list (can be stored in Firestore for better security)
  const ADMIN_EMAILS = [
    'admin@ramenterprise.com',
    // Add more admin emails here
  ];
  return ADMIN_EMAILS.includes(email?.toLowerCase());
};