import React, { useState, useEffect } from "react";
// Components Imports - Folder ke andar wali files
import ProductCard from "./Components/productCard";
import Footer from "./Components/footer";
import Cart from "./Components/cart";
import ProductDetail from "./Components/productDetail";
import Checkout from "./Components/checkout";
import OrderConfirmation from "./Components/orderConfirmation";
import MyOrders from "./Components/myOrders";
import Sidebar from "./Components/sideBar"; 
import Payment from "./Components/payment";
import About from "./Components/about";

// Login aur Firebase teri 'src' mein bahar hain, isliye path ye rahega
import Login from "./login"; 

function App() {
  const [user, setUser] = useState(() => localStorage.getItem("ram_user"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ram_cart")) || []; } catch { return []; }
  });
  const [allOrders, setAllOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ram_orders")) || []; } catch { return []; }
  });

  const [showCartPage, setShowCartPage] = useState(false);
  const [showMyOrdersPage, setShowMyOrdersPage] = useState(false);
  const [showAboutPage, setShowAboutPage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentOrderItems, setCurrentOrderItems] = useState([]);
  const [orderConfirmedData, setOrderConfirmedData] = useState(null);
  const [tempOrderDetails, setTempOrderDetails] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem("ram_user", user);
    else localStorage.removeItem("ram_user");
  }, [user]);

  useEffect(() => { localStorage.setItem("ram_cart", JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem("ram_orders", JSON.stringify(allOrders)); }, [allOrders]);

  useEffect(() => {
    const timer = setTimeout(() => { if (!user) setShowPopup(true); }, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  const resetAllViews = () => {
    setShowCartPage(false); setShowMyOrdersPage(false); setShowAboutPage(false);
    setSelectedProduct(null); setShowCheckout(false); setShowPayment(false);
    setOrderConfirmedData(null); setIsSidebarOpen(false);
  };

  const handleSidebarNavigation = (path) => {
    resetAllViews();
    if (path === "cart") setShowCartPage(true);
    if (path === "orders") setShowMyOrdersPage(true);
    if (path === "about") setShowAboutPage(true);
  };

  const finalizeOrder = (details) => {
    const total = currentOrderItems.reduce((sum, item) => {
      const price = parseInt(String(item.price).replace(/,/g, ""));
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    const newOrder = {
      id: Date.now(),
      customerName: details.fullName,
      date: new Date().toLocaleDateString(),
      items: currentOrderItems,
      total: total.toLocaleString(),
      status: "Processing",
    };
    setAllOrders((prev) => [newOrder, ...prev]);
    setOrderConfirmedData(details);
    setCartItems([]);
    setShowPayment(false);
  };

  const products = [
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: "2,499", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500" },
    { id: 2, name: "Smart Watch Gen 8", category: "Electronics", price: "4,999", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500" },
    { id: 3, name: "Running Sneakers", category: "Fashion", price: "1,299", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { id: 4, name: "Steel Bottle", category: "Home", price: "750", image: "https://images.unsplash.com/photo-1610824352934-c10d87b700cc?w=500" },
  ];

  const filteredProducts = products.filter(p => 
    (selectedCategory === "All" || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let content = null;
  if (orderConfirmedData) content = <OrderConfirmation orderDetails={orderConfirmedData} items={currentOrderItems} onContinueShopping={resetAllViews} />;
  else if (showPayment) content = <Payment onPaymentSuccess={() => finalizeOrder(tempOrderDetails)} />;
  else if (showCheckout) content = <Checkout onPlaceOrder={(d) => d.paymentMethod === "UPI" ? (setTempOrderDetails(d), setShowCheckout(false), setShowPayment(true)) : finalizeOrder(d)} onBack={resetAllViews} />;
  else if (showMyOrdersPage) content = <MyOrders orders={allOrders} onBack={resetAllViews} />;
  else if (showAboutPage) content = <About onBack={resetAllViews} />;
  else if (showCartPage) content = <Cart cartItems={cartItems} onBack={resetAllViews} onRemove={(id) => setCartItems(prev => prev.filter(i => i.id !== id))} onCheckout={() => { if(cartItems.length > 0) { setCurrentOrderItems(cartItems); setShowCartPage(false); setShowCheckout(true); } else alert("Empty Cart"); }} />;
  else if (selectedProduct) content = <ProductDetail product={selectedProduct} onBack={resetAllViews} onAddToCart={(p) => {setCartItems(prev => [...prev, p]); alert("Added!");}} onBuyNow={() => { setCurrentOrderItems([selectedProduct]); setShowCheckout(true); setSelectedProduct(null); }} />;
  else content = (
      <>
        <div className="bg-emerald-900 text-white py-16 text-center text-4xl font-bold">Ram Enterprise Store</div>
        <div className="p-6 text-center">
          <input placeholder="Search products" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border px-4 py-2 rounded w-full max-w-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
          {filteredProducts.map((item) => (
            <div key={item.id} onClick={() => setSelectedProduct(item)} className="cursor-pointer">
              <ProductCard title={item.name} price={item.price} image={item.image} onAddToCart={(e) => { e.stopPropagation(); setCartItems(prev => [...prev, item]); alert("Added!"); }} />
            </div>
          ))}
        </div>
      </>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} onLogout={() => setUser(null)} onNavigate={handleSidebarNavigation} />
      {showPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]">
          <div className="bg-white p-4 rounded-lg relative">
            <button className="absolute top-2 right-2" onClick={() => setShowPopup(false)}>✕</button>
            <Login onLogin={(u) => { setUser(u?.phoneNumber || "User"); setShowPopup(false); }} />
          </div>
        </div>
      )}
      <nav className="bg-emerald-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <button onClick={() => setIsSidebarOpen(true)} className="text-2xl">☰</button>
        <span className="font-bold text-xl cursor-pointer" onClick={resetAllViews}>Ram Enterprise</span>
        <button className="bg-white text-emerald-800 px-4 py-2 rounded-lg font-bold" onClick={() => handleSidebarNavigation("cart")}>
          🛒 Cart ({cartItems.length})
        </button>
      </nav>
      <div className="flex-grow">{content}</div>
      <Footer onNavigate={handleSidebarNavigation} />
    </div>
  );
}

export default App;