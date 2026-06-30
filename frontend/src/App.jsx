import React, { useState, useEffect } from "react";
import ProductCard from "./Components/ProductCard";
import Footer from "./Components/Footer";
import Cart from "./Components/Cart";
import ProductDetail from "./Components/ProductDetail";
import Checkout from "./Components/Checkout";
import SideBar from "./Components/SideBar";
import HomeScreen from "./Homescreen";
import LoginScreen from "./LoginScree";
import PaymentSuccessScreen from "./Paymentsuccessscreen";
import ProcessingScreen from "./Processingscreen";
import AdminPanel from "./Components/AdminPanel";
import UserOrders from "./Components/UserOrders";
import UserWishlist from "./Components/UserWishlist";
import { fetchProducts, createOrder, decreaseProductQuantity, onAuthStateChange, logoutUser } from "./firebaseUtils";

const ALL_PRODUCTS = [
  { _id: "1",  name: "Formal White Shirt (Slim)",    price: 499,  originalPrice: 999,   category: "Fashion",     rating: 3.2, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80", brand: "Ram Enterprise", description: "Premium slim fit formal white shirt perfect for office wear." },
  { _id: "2",  name: "Formal White Shirt (Cotton)",  price: 899,  originalPrice: 1500,  category: "Fashion",     rating: 4.1, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80", brand: "Ram Enterprise", description: "100% cotton formal shirt, breathable and comfortable." },
  { _id: "3",  name: "Formal White Shirt (Premium)", price: 1599, originalPrice: 2500,  category: "Fashion",     rating: 4.8, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80", brand: "Ram Enterprise", description: "Premium quality formal shirt with superior stitching." },
  { _id: "4",  name: "Formal White Shirt (Luxury)",  price: 3500, originalPrice: 5000,  category: "Fashion",     rating: 4.9, image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80", brand: "Ram Enterprise", description: "Luxury edition formal shirt with gold buttons." },
  { _id: "5",  name: "Blue Jeans (Regular)",          price: 799,  originalPrice: 1500,  category: "Fashion",     rating: 3.4, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", brand: "Ram Enterprise", description: "Classic regular fit blue jeans for everyday wear." },
  { _id: "6",  name: "Blue Jeans (Slim Fit)",         price: 1299, originalPrice: 2000,  category: "Fashion",     rating: 4.2, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", brand: "Ram Enterprise", description: "Slim fit jeans with stretchable fabric for comfort." },
  { _id: "7",  name: "Black Cotton T-Shirt",          price: 349,  originalPrice: 799,   category: "Fashion",     rating: 4.7, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", brand: "Ram Enterprise", description: "Soft 100% cotton black t-shirt for casual wear." },
  { _id: "8",  name: "White Polo T-Shirt",            price: 599,  originalPrice: 1200,  category: "Fashion",     rating: 4.3, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80", brand: "Ram Enterprise", description: "Classic white polo t-shirt with collar." },
  { _id: "9",  name: "Grey Hoodie",                   price: 899,  originalPrice: 1800,  category: "Fashion",     rating: 4.5, image: "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400&q=80", brand: "Ram Enterprise", description: "Warm and cozy grey hoodie for winters." },
  { _id: "10", name: "Black Hoodie (Premium)",        price: 1499, originalPrice: 2500,  category: "Fashion",     rating: 4.6, image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400&q=80", brand: "Ram Enterprise", description: "Premium black hoodie with fleece lining." },
  { _id: "11", name: "Chino Pants (Beige)",           price: 999,  originalPrice: 1800,  category: "Fashion",     rating: 4.0, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80", brand: "Ram Enterprise", description: "Stylish beige chino pants for casual outings." },
  { _id: "12", name: "Track Pants",                   price: 599,  originalPrice: 999,   category: "Fashion",     rating: 3.8, image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80", brand: "Ram Enterprise", description: "Comfortable track pants for gym and sports." },
  { _id: "13", name: "Sports Shoes (White)",          price: 1999, originalPrice: 3500,  category: "Fashion",     rating: 4.4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", brand: "Ram Enterprise", description: "Lightweight white sports shoes with cushioned sole." },
  { _id: "14", name: "Leather Wallet",                price: 799,  originalPrice: 1500,  category: "Fashion",     rating: 4.2, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", brand: "Ram Enterprise", description: "Genuine leather bifold wallet with multiple card slots." },
  { _id: "15", name: "Sunglasses (UV400)",            price: 499,  originalPrice: 1200,  category: "Fashion",     rating: 3.9, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", brand: "Ram Enterprise", description: "Stylish UV400 sunglasses for outdoor use." },
  { _id: "16", name: "Canvas Backpack",               price: 1299, originalPrice: 2200,  category: "Fashion",     rating: 4.5, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", brand: "Ram Enterprise", description: "Durable canvas backpack with multiple compartments." },
  { _id: "17", name: "Smart Watch (Lite)",            price: 899,  originalPrice: 2000,  category: "Electronics", rating: 3.8, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", brand: "Ram Enterprise", description: "Feature-packed smartwatch with heart rate monitor." },
  { _id: "18", name: "Smart Watch (Pro)",             price: 2499, originalPrice: 5000,  category: "Electronics", rating: 4.5, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", brand: "Ram Enterprise", description: "Pro smartwatch with GPS, SpO2, and AMOLED display." },
  { _id: "19", name: "Wireless Earbuds",              price: 999,  originalPrice: 2500,  category: "Electronics", rating: 4.3, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80", brand: "Ram Enterprise", description: "True wireless earbuds with 24hr battery life." },
  { _id: "20", name: "Bluetooth Headphones",         price: 1999, originalPrice: 4000,  category: "Electronics", rating: 4.6, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", brand: "Ram Enterprise", description: "Over-ear bluetooth headphones with noise cancellation." },
  { _id: "21", name: "Portable Speaker",             price: 1499, originalPrice: 2800,  category: "Electronics", rating: 4.2, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80", brand: "Ram Enterprise", description: "Waterproof portable speaker with 360° sound." },
  { _id: "22", name: "Power Bank 10000mAh",          price: 799,  originalPrice: 1500,  category: "Electronics", rating: 4.4, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80", brand: "Ram Enterprise", description: "Slim 10000mAh power bank with fast charging." },
  { _id: "23", name: "Power Bank 20000mAh",          price: 1299, originalPrice: 2500,  category: "Electronics", rating: 4.5, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80", brand: "Ram Enterprise", description: "High capacity 20000mAh power bank with dual USB." },
  { _id: "24", name: "USB-C Hub (7-in-1)",           price: 1799, originalPrice: 3000,  category: "Electronics", rating: 4.3, image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=400&q=80", brand: "Ram Enterprise", description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card." },
  { _id: "25", name: "Mechanical Keyboard",          price: 2999, originalPrice: 5000,  category: "Electronics", rating: 4.7, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", brand: "Ram Enterprise", description: "RGB mechanical keyboard with blue switches." },
  { _id: "26", name: "Wireless Mouse",               price: 799,  originalPrice: 1500,  category: "Electronics", rating: 4.1, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80", brand: "Ram Enterprise", description: "Ergonomic wireless mouse with silent clicks." },
  { _id: "27", name: "LED Desk Lamp",                price: 599,  originalPrice: 1200,  category: "Electronics", rating: 3.9, image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=400&q=80", brand: "Ram Enterprise", description: "USB powered LED desk lamp with adjustable brightness." },
  { _id: "28", name: "Webcam (1080p)",               price: 1999, originalPrice: 3500,  category: "Electronics", rating: 4.2, image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80", brand: "Ram Enterprise", description: "Full HD 1080p webcam for video calls and streaming." },
  { _id: "29", name: "Gaming Mouse (RGB)",           price: 1499, originalPrice: 2800,  category: "Gaming",      rating: 4.6, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80", brand: "Ram Enterprise", description: "High DPI gaming mouse with customizable RGB lighting." },
  { _id: "30", name: "Gaming Headset",               price: 1999, originalPrice: 3500,  category: "Gaming",      rating: 4.4, image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80", brand: "Ram Enterprise", description: "7.1 surround sound gaming headset with mic." },
  { _id: "31", name: "Gaming Chair",                 price: 8999, originalPrice: 15000, category: "Gaming",      rating: 4.5, image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&q=80", brand: "Ram Enterprise", description: "Ergonomic gaming chair with lumbar support." },
  { _id: "32", name: "Gaming Mousepad (XL)",         price: 699,  originalPrice: 1200,  category: "Gaming",      rating: 4.3, image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=400&q=80", brand: "Ram Enterprise", description: "Extra large mousepad with smooth surface for gaming." },
  { _id: "33", name: "Controller Stand",             price: 499,  originalPrice: 999,   category: "Gaming",      rating: 3.8, image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80", brand: "Ram Enterprise", description: "Dual controller stand with charging port." },
  { _id: "34", name: "Gaming Glasses (Anti-Blue)",   price: 799,  originalPrice: 1500,  category: "Gaming",      rating: 4.1, image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80", brand: "Ram Enterprise", description: "Anti-blue light glasses to reduce eye strain." },
  { _id: "35", name: "Scented Candle Set",           price: 599,  originalPrice: 1200,  category: "Home",        rating: 4.5, image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=400&q=80", brand: "Ram Enterprise", description: "Set of 3 premium scented candles for home decor." },
  { _id: "36", name: "Ceramic Mug Set",              price: 799,  originalPrice: 1500,  category: "Home",        rating: 4.2, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80", brand: "Ram Enterprise", description: "Set of 2 premium ceramic mugs, microwave safe." },
  { _id: "37", name: "Wall Clock (Wooden)",          price: 1299, originalPrice: 2500,  category: "Home",        rating: 4.4, image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80", brand: "Ram Enterprise", description: "Handcrafted wooden wall clock for home decor." },
  { _id: "38", name: "Throw Pillow Set",             price: 899,  originalPrice: 1800,  category: "Home",        rating: 4.0, image: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?w=400&q=80", brand: "Ram Enterprise", description: "Set of 2 decorative throw pillows for sofa/bed." },
  { _id: "39", name: "Indoor Plant Pot",             price: 499,  originalPrice: 999,   category: "Home",        rating: 3.9, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80", brand: "Ram Enterprise", description: "Minimalist ceramic plant pot for indoor plants." },
  { _id: "40", name: "Photo Frame Set (3pc)",        price: 699,  originalPrice: 1400,  category: "Home",        rating: 4.3, image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&q=80", brand: "Ram Enterprise", description: "Set of 3 matching photo frames in different sizes." },
];

function App() {
  const [user, setUser] = useState(null);
  const [userUid, setUserUid] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  // ── Persistent Firebase Auth Listener ──
  useEffect(() => {
    const unsubscribe = onAuthStateChange((userData) => {
      // If admin is already set via localStorage (hardcoded admin), don't override
      const storedAdmin = localStorage.getItem("ram_is_admin") === "true";
      const storedUser  = localStorage.getItem("ram_user");

      if (userData) {
        setUser(userData.name);
        setUserUid(userData.uid);
        setIsAdmin(userData.isAdmin || false);
        if (userData.isAdmin) localStorage.setItem("ram_is_admin", "true");
        else localStorage.removeItem("ram_is_admin");
        if (userData.name) localStorage.setItem("ram_user", userData.name);
      } else if (storedAdmin && storedUser) {
        // Hardcoded admin — keep session
        setUser(storedUser);
        setIsAdmin(true);
      } else {
        setUser(null);
        setUserUid(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load products from Firebase on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const firebaseProducts = await fetchProducts();
        // Only use Firebase products if they have proper data (name + price + image)
        const validFirebaseProducts = (firebaseProducts || []).filter(
          p => p.name && p.price && p.image && p.image.startsWith("http")
        );
        if (validFirebaseProducts.length > 0) {
          // Merge: valid Firebase products + hardcoded products not already in Firebase
          const fbNames = new Set(validFirebaseProducts.map(p => p.name?.toLowerCase().trim()));
          const hardcodedExtras = ALL_PRODUCTS.filter(
            p => !fbNames.has(p.name?.toLowerCase().trim())
          );
          setProducts([...validFirebaseProducts, ...hardcodedExtras]);
        } else {
          // No valid Firebase products → show all 40 hardcoded
          setProducts(ALL_PRODUCTS);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts(ALL_PRODUCTS);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // Cursor glow effect tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
      setNavbarScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pehli render pe old localStorage data clean karo
  useEffect(() => {
    const keysToCheck = ["ram_cart", "ram_orders", "ram_wishlist", "ram_addresses", "ram_payments"];
    keysToCheck.forEach(key => {
      try {
        const val = localStorage.getItem(key);
        if (val) JSON.parse(val); // agar parse fail ho toh catch mein clean karo
      } catch {
        localStorage.removeItem(key);
      }
    });
  }, []);
  const [activeView, setActiveView] = useState(() => {
    const storedUser  = localStorage.getItem("ram_user");
    const storedAdmin = localStorage.getItem("ram_is_admin") === "true";
    if (storedAdmin && storedUser) return "admin";
    if (storedUser)                return "home";
    return "home"; // ✅ Guest users directly see products, no forced login
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification]   = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isProcessing, setIsProcessing]   = useState(false);
  const [sortBy, setSortBy]               = useState("default");

  const getInitialData = (key) => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : []; }
    catch (e) { return []; }
  };

  const [addresses, setAddresses]         = useState(() => getInitialData("ram_addresses"));
  const [payments, setPayments]           = useState(() => getInitialData("ram_payments"));
  const [wishlist, setWishlist]           = useState(() => getInitialData("ram_wishlist"));
  const [cartItems, setCartItems]         = useState(() => getInitialData("ram_cart"));
  const [orderHistory, setOrderHistory]   = useState(() => getInitialData("ram_orders"));
  const [loginData, setLoginData]         = useState({ name: "", email: "", password: "", mobile: "" });

  useEffect(() => {
    localStorage.setItem("ram_cart",      JSON.stringify(cartItems));
    localStorage.setItem("ram_orders",    JSON.stringify(orderHistory));
    localStorage.setItem("ram_wishlist",  JSON.stringify(wishlist));
    localStorage.setItem("ram_addresses", JSON.stringify(addresses));
    localStorage.setItem("ram_payments",  JSON.stringify(payments));
    if (user) localStorage.setItem("ram_user", user);
    else localStorage.removeItem("ram_user");
  }, [user, cartItems, orderHistory, wishlist, addresses, payments]);

  const filtered = products
    .filter(p =>
      (selectedCategory === "All" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "lowToHigh") return a.price - b.price;
      if (sortBy === "highToLow") return b.price - a.price;
      return 0;
    });

  const handleNavigate = (view) => {
    // If admin tries to go to "home", send to admin panel instead
    if (isAdmin && view === "home") {
      setActiveView("admin");
      setSelectedProduct(null);
      setIsSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setActiveView(view);
    setSelectedProduct(null);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      showNotification("Please login to add items to cart");
      setTimeout(() => handleNavigate("login"), 1500);
      return;
    }
    // If item already in cart, increase quantity instead of duplicating
    const existing = cartItems.find(i => (i._id || i.id) === (product._id || product.id));
    if (existing) {
      setCartItems(prev => prev.map(i =>
        (i._id || i.id) === (product._id || product.id)
          ? { ...i, qty: (i.qty || 1) + 1 }
          : i
      ));
    } else {
      setCartItems(prev => [...prev, { ...product, qty: 1 }]);
    }
    showNotification(`${product.name} added to bag`);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.classList.remove('badge-bounce');
      setTimeout(() => badge.classList.add('badge-bounce'), 10);
    }
  };

  const handleBuyNow = (product) => {
    if (!user) {
      showNotification("Please login to buy products");
      setTimeout(() => handleNavigate("login"), 1500);
      return;
    }
    setCartItems([product]);
    handleNavigate("checkout");
  };

  const handlePlaceOrder = async (paymentType, deliveryInfo = {}) => {
    setIsProcessing(true);

    const newOrder = {
      userId:        userUid || user,   // use UID if available for proper Firestore lookup
      userName:      user,
      userEmail:     deliveryInfo.email || "",
      phone:         deliveryInfo.phone || "",
      address:       deliveryInfo.address || "",
      recipientName: deliveryInfo.name || user,
      items:         [...cartItems],
      total:         cartItems.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0),
      paymentMethod: paymentType === "Online" ? "Paid via UPI" : paymentType === "Card" ? "Paid via Card" : "Cash on Delivery",
      status:        "Confirmed",
      date:          new Date().toLocaleDateString("en-IN"),
    };

    try {
      await createOrder(newOrder);

      // Decrease stock for Firestore products
      for (const item of cartItems) {
        const pid = item.id || item._id;
        if (pid && !/^\d+$/.test(pid)) {
          await decreaseProductQuantity(pid, item.qty || 1);
        }
      }

      const orderWithId = { ...newOrder, id: Math.floor(100000 + Math.random() * 900000) };
      setOrderHistory([orderWithId, ...orderHistory]);
      setCartItems([]);

      setTimeout(() => { setIsProcessing(false); handleNavigate("payment-success"); }, 2500);
    } catch (error) {
      console.error("Error placing order:", error);
      const orderWithId = { ...newOrder, id: Math.floor(100000 + Math.random() * 900000) };
      setOrderHistory([orderWithId, ...orderHistory]);
      setCartItems([]);
      setTimeout(() => { setIsProcessing(false); handleNavigate("payment-success"); }, 2500);
    }
  };

  const handleLogout = async () => {
    try { await logoutUser(); } catch {}
    setUser(null);
    setUserUid(null);
    setIsAdmin(false);
    localStorage.removeItem("ram_user");
    localStorage.removeItem("ram_is_admin");
    setActiveView("login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = (name) => {
    setUser(name);
    setIsAdmin(true);
    setAuthLoading(false); // ensure loading spinner stops
    localStorage.setItem("ram_user", name);
    localStorage.setItem("ram_is_admin", "true");
    setActiveView("admin");
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find(i => i._id === product._id);
    if (exists) setWishlist(wishlist.filter(i => i._id !== product._id));
    else        setWishlist([...wishlist, product]);
  };

  /* ── render ── */
  // Show loading spinner while Firebase Auth is resolving
  if (authLoading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  let mainContent;
  if (isProcessing) {
    mainContent = <ProcessingScreen />;
  } else if (activeView === "login") {
    mainContent = (
      <LoginScreen
        onLogin={(name) => {
          setUser(name);
          setIsAdmin(false);
          localStorage.setItem("ram_user", name);
          localStorage.removeItem("ram_is_admin");
          setActiveView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onAdminLogin={handleAdminLogin}
      />
    );
  } else if (activeView === "admin") {
    if (!isAdmin) {
      // Non-admin trying to access admin → kick to login
      setTimeout(() => setActiveView("login"), 0);
      return null;
    }
    mainContent = (
      <AdminPanel
        orders={orderHistory}
        products={products}
        setProducts={setProducts}
        adminName={user}
        onLogout={handleLogout}
        onBack={() => handleNavigate("home")}
      />
    );
  } else if (activeView === "orders") {
    mainContent = (
      <UserOrders
        orders={orderHistory}
        user={user}
        onBack={() => handleNavigate("home")}
        onShop={() => handleNavigate("home")}
      />
    );
  } else if (activeView === "wishlist") {
    mainContent = (
      <UserWishlist
        wishlist={wishlist}
        onBack={() => handleNavigate("home")}
        onAddToCart={handleAddToCart}
        onRemoveWishlist={(product) => {
          setWishlist(prev => prev.filter(i => i._id !== product._id));
          showNotification(`${product.name} removed from wishlist`);
        }}
      />
    );
  } else if (selectedProduct) {
    mainContent = (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onWishlist={toggleWishlist}
        isWishlisted={!!wishlist.find(x => x._id === selectedProduct._id)}
      />
    );
  } else if (activeView === "home") {
    if (loadingProducts) {
      mainContent = (
        <div className="min-h-screen bg-cream-100 pt-12 pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="mb-8 animate-pulse">
              <div className="h-8 w-48 bg-cream-300 rounded-2xl mb-2"></div>
              <div className="h-4 w-64 bg-cream-200 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-card">
                  <div className="h-48 shimmer"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 shimmer rounded-xl"></div>
                    <div className="h-3 w-2/3 shimmer rounded-xl"></div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-3 w-16 shimmer rounded-full"></div>
                      <div className="h-3 w-12 shimmer rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-8 shimmer rounded-xl"></div>
                      <div className="h-8 shimmer rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      mainContent = (
        <HomeScreen
          filtered={filtered}
          onSelectProduct={setSelectedProduct}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      );
    }
  } else if (activeView === "cart") {
    mainContent = (
      <Cart
        cartItems={cartItems}
        onBack={() => handleNavigate("home")}
        onRemove={(id) => setCartItems(cartItems.filter(i => i._id !== id))}
        onCheckout={() => handleNavigate("checkout")}
      />
    );
  } else if (activeView === "checkout") {
    mainContent = (
      <Checkout
        cartItems={cartItems}
        onBack={() => handleNavigate("cart")}
        onPlaceOrder={handlePlaceOrder}
        addresses={addresses}
      />
    );
  } else if (activeView === "payment-success") {
    mainContent = <PaymentSuccessScreen onGoHome={() => handleNavigate("home")} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 relative">

      {/* 🌟 Cursor Glow Layer */}
      <div className="cursor-glow-layer" />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-[200] toast">
          <div className="bg-stone-900 text-white px-6 py-3.5 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-brand-light rounded-full inline-block animate-pulse"></span>
            {notification}
          </div>
        </div>
      )}

      {/* 🔼 Scroll to Top Button */}
      {showScrollTop && activeView !== "admin" && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="scroll-top-btn fixed bottom-8 right-8 z-[100] w-12 h-12 bg-stone-900 text-white rounded-full shadow-card-lg flex items-center justify-center group transition-all duration-300 hover:bg-brand hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={handleNavigate}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* Navbar — hide on admin panel */}
      {activeView !== "admin" && (
      <header className={`px-6 lg:px-12 py-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-500 ${
        navbarScrolled ? 'navbar-glass' : 'navbar-default'
      }`}>
        {/* Left */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-xl hover:bg-cream-200 transition-colors"
            aria-label="Open menu"
          >
            <span className="w-5 h-0.5 bg-stone-700 rounded"></span>
            <span className="w-5 h-0.5 bg-stone-700 rounded"></span>
            <span className="w-3 h-0.5 bg-stone-700 rounded"></span>
          </button>
          <button onClick={() => handleNavigate("home")} className="flex items-center gap-2">
            <span className="font-serif-display font-bold text-xl text-stone-900 italic">Ram Enterprise</span>
          </button>
        </div>

        {/* Center nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => handleNavigate("home")} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">Home</button>
          <button onClick={() => handleNavigate("cart")} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">My Bag</button>
          {user && !isAdmin && (
            <button onClick={() => handleNavigate("orders")} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">My Orders</button>
          )}
          {isAdmin && (
              <button onClick={() => setActiveView("admin")} className="text-sm font-medium text-brand hover:text-stone-900 transition-colors font-semibold">Admin Panel</button>
            )}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => handleNavigate("home")}
              className="flex items-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900"
            >
              <span className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center text-sm font-bold">
                {user[0].toUpperCase()}
              </span>
              <span className="hidden lg:inline">{user}</span>
            </button>
          ) : (
            <button
              onClick={() => handleNavigate("login")}
              className="text-sm font-medium text-stone-600 border border-stone-200 px-4 py-2 rounded-xl hover:bg-stone-50 hover:border-stone-300 transition-all"
            >
              Sign In
            </button>
          )}
          <button
            onClick={() => handleNavigate("cart")}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream-200 transition-colors"
            aria-label="Cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center cart-badge">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>
      )}

      {/* Main */}
      <main className="flex-grow">{mainContent}</main>

      {activeView !== "admin" && <Footer onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
