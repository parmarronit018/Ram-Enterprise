// Firebase Utility Functions — Complete Fixed Version
import { db, auth, storage } from './firebase.config';
import {
  collection, addDoc, getDocs, query, where, orderBy,
  updateDoc, deleteDoc, doc, setDoc, getDoc
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ============ AUTH STATE LISTENER ============
// Call this once in App.jsx to persist login across refresh
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      // Fetch full user profile from Firestore
      try {
        const q = query(collection(db, 'users'), where('uid', '==', firebaseUser.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const userData = snap.docs[0].data();
          callback({
            uid: firebaseUser.uid,
            email: userData.email,
            name: userData.name,
            isAdmin: userData.isAdmin || false,
          });
        } else {
          // User in Firebase Auth but not Firestore — use Auth profile
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            isAdmin: firebaseUser.email === 'admin@ramenterprise.com',
          });
        }
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// ============ AUTHENTICATION ============
export const signupUser = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Set display name in Firebase Auth
  await updateProfile(user, { displayName: name });

  const isAdmin = email.toLowerCase() === 'admin@ramenterprise.com';

  // Save to Firestore users collection
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email: email,
    name: name,
    isAdmin: isAdmin,
    createdAt: new Date().toISOString(),
  });

  return { uid: user.uid, email, name, isAdmin };
};

export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Fetch profile from Firestore
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return { uid: user.uid, email: data.email, name: data.name, isAdmin: data.isAdmin || false };
  }

  // Fallback — also try by uid field (old format)
  const q = query(collection(db, 'users'), where('uid', '==', user.uid));
  const snap = await getDocs(q);
  if (!snap.empty) {
    const data = snap.docs[0].data();
    return { uid: user.uid, email: data.email, name: data.name, isAdmin: data.isAdmin || false };
  }

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName || email.split('@')[0],
    isAdmin: email.toLowerCase() === 'admin@ramenterprise.com',
  };
};

export const logoutUser = async () => {
  await signOut(auth);
  return true;
};

// ============ PRODUCTS ============
export const fetchProducts = async () => {
  try {
    const snap = await getDocs(collection(db, 'products'));
    return snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (productData) => {
  const docRef = await addDoc(collection(db, 'products'), {
    ...productData,
    quantity: productData.quantity ?? 10,
    createdAt: new Date().toISOString(),
  });
  return { id: docRef.id, _id: docRef.id, ...productData };
};

export const updateProduct = async (productId, productData) => {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, { ...productData, updatedAt: new Date().toISOString() });
  return { id: productId, _id: productId, ...productData };
};

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, 'products', productId));
  return true;
};

export const decreaseProductQuantity = async (productId, qty = 1) => {
  try {
    const productRef = doc(db, 'products', productId);
    const snap = await getDoc(productRef);
    if (snap.exists()) {
      const current = snap.data().quantity ?? 0;
      await updateDoc(productRef, { quantity: Math.max(0, current - qty) });
    }
  } catch (error) {
    console.error('Error decreasing quantity:', error);
  }
};

// ============ IMAGE UPLOAD ============
export const uploadProductImage = async (file, productId) => {
  const storageRef = ref(storage, `products/${productId}_${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

export const deleteProductImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('firebasestorage')) return;
    await deleteObject(ref(storage, imageUrl));
  } catch (e) {
    console.warn('Could not delete old image:', e.message);
  }
};

// ============ ORDERS ============
export const createOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: new Date().toISOString(),
    status: 'Confirmed',
  });
  return { id: docRef.id, ...orderData };
};

export const fetchUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const fetchAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);

    // Fetch all users for enrichment
    const usersSnap = await getDocs(collection(db, 'users'));
    const usersMap = {};
    usersSnap.docs.forEach(d => {
      const u = d.data();
      if (u.uid) usersMap[u.uid] = u;
    });

    return snap.docs.map(d => {
      const order = { id: d.id, ...d.data() };
      const customer = usersMap[order.userId] || null;
      order.customerName  = customer?.name  || order.userName || order.userId || 'Guest';
      order.customerEmail = customer?.email || order.userEmail || '';
      order.customerPhone = customer?.phone || order.phone || '';
      return order;
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
  return true;
};

// ============ STORE SETTINGS ============
export const fetchStoreSettings = async () => {
  try {
    const snap = await getDoc(doc(db, 'settings', 'storeConfig'));
    return snap.exists() ? snap.data() : null;
  } catch {
    return null;
  }
};

export const saveStoreSettings = async (settingsData) => {
  await setDoc(doc(db, 'settings', 'storeConfig'), {
    ...settingsData,
    updatedAt: new Date().toISOString(),
  });
  return true;
};
