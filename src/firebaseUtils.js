// Firebase Utility Functions
import { db, auth, storage } from './firebase.config';
import {
  collection, addDoc, getDocs, query, where, orderBy,
  updateDoc, deleteDoc, doc, setDoc, getDoc
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ============ PRODUCTS ============
export const fetchProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      quantity: productData.quantity ?? 10,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, _id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString(),
    });
    return { id: productId, _id: productId, ...productData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'products', productId));
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const decreaseProductQuantity = async (productId, qty = 1) => {
  try {
    const productRef = doc(db, 'products', productId);
    const snap = await getDoc(productRef);
    if (snap.exists()) {
      const current = snap.data().quantity ?? 0;
      const newQty = Math.max(0, current - qty);
      await updateDoc(productRef, { quantity: newQty });
    }
  } catch (error) {
    console.error('Error decreasing quantity:', error);
  }
};

// ============ IMAGE UPLOAD ============
export const uploadProductImage = async (file, productId) => {
  try {
    const storageRef = ref(storage, `products/${productId}_${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteProductImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('firebasestorage')) return;
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn('Could not delete old image:', error.message);
  }
};

// ============ ORDERS ============
export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
    });
    return { id: docRef.id, ...orderData };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const fetchAllOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    // Fetch user profiles to enrich orders with customer details
    const usersSnap = await getDocs(collection(db, 'users'));
    const usersMap = {};
    usersSnap.docs.forEach(d => {
      const u = d.data();
      usersMap[u.uid] = u;
      usersMap[u.name] = u; // fallback by name
    });

    return querySnapshot.docs.map(d => {
      const order = { id: d.id, ...d.data() };
      // Try to enrich with customer info
      const customer = usersMap[order.userId] || usersMap[order.userName] || null;
      if (customer) {
        order.customerName = customer.name || order.userId;
        order.customerEmail = customer.email || '';
        order.customerPhone = customer.phone || order.phone || '';
      } else {
        order.customerName = order.userId || 'Guest';
        order.customerEmail = '';
        order.customerPhone = order.phone || '';
      }
      return order;
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ============ STORE SETTINGS ============
export const fetchStoreSettings = async () => {
  try {
    const snap = await getDoc(doc(db, 'settings', 'storeConfig'));
    if (snap.exists()) return snap.data();
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

export const saveStoreSettings = async (settingsData) => {
  try {
    await setDoc(doc(db, 'settings', 'storeConfig'), {
      ...settingsData,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

// ============ AUTHENTICATION ============
export const signupUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email: email,
      name: name,
      isAdmin: email === 'admin@ramenterprise.com',
      createdAt: new Date().toISOString(),
    });
    return { uid: user.uid, email, name, isAdmin: email === 'admin@ramenterprise.com' };
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const q = query(collection(db, 'users'), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return { uid: user.uid, email: userData.email, name: userData.name, isAdmin: userData.isAdmin };
    }
    return { uid: user.uid, email: user.email, name: email.split('@')[0], isAdmin: false };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};
