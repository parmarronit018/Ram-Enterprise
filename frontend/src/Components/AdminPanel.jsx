import React, { useState, useEffect, useRef } from "react";
import AdminSidebar from "./AdminSidebar";
import {
  fetchAllOrders, updateOrderStatus,
  addProduct, updateProduct, deleteProduct,
  uploadProductImage, deleteProductImage,
  fetchStoreSettings, saveStoreSettings,
} from "../firebaseUtils";

/* ── constants ── */
const ORDER_STATUSES = ["Confirmed","Processing","Shipped","Delivered","Cancelled"];
const STATUS_STYLE = {
  Confirmed:  { bg:"bg-blue-500/15",   text:"text-blue-400",   dot:"bg-blue-400"   },
  Processing: { bg:"bg-amber-500/15",  text:"text-amber-400",  dot:"bg-amber-400"  },
  Shipped:    { bg:"bg-purple-500/15", text:"text-purple-400", dot:"bg-purple-400" },
  Delivered:  { bg:"bg-green-500/15",  text:"text-green-400",  dot:"bg-green-400"  },
  Cancelled:  { bg:"bg-red-500/15",    text:"text-red-400",    dot:"bg-red-400"    },
};
const CATEGORY_COLOR = {
  Fashion:"bg-amber-500", Electronics:"bg-blue-500", Gaming:"bg-purple-500", Home:"bg-green-500",
};

/* ── Stat Card ── */
const StatCard = ({ label, value, sub, icon, gradient, change }) => (
  <div className="bg-[#161d18] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center text-lg shadow-lg`}>{icon}</div>
      {change && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${change > 0 ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
          {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
    <p className="text-xs font-semibold text-stone-400">{label}</p>
    {sub && <p className="text-[10px] text-stone-600 mt-0.5">{sub}</p>}
  </div>
);

/* ── Status Badge ── */
const StatusBadge = ({ status }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Confirmed;
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.bg} ${s.text} text-[10px] font-bold px-2.5 py-1 rounded-full`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

/* ── CSV Export Helper ── */
const exportCSV = (orders) => {
  const header = ["OrderID","Customer","Email","Phone","Amount","Payment","Status","Date"];
  const rows = orders.map(o => [
    o.id, o.customerName || o.userId, o.customerEmail || "",
    o.customerPhone || o.phone || "", o.total, o.paymentMethod, o.status || "Confirmed", o.date || ""
  ]);
  const csv = [header, ...rows].map(r => r.map(v => `"${String(v||"").replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Report_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

/* ── Main Component ── */
function AdminPanel({ orders: initialOrders = [], products: initialProducts = [], setProducts: setGlobalProducts, onBack, adminName, onLogout }) {
  const [tab, setTab]           = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders]     = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchOrder, setSearchOrder]     = useState("");
  const [filterStatus, setFilterStatus]   = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProduct, setEditProduct]     = useState(null);
  const [productSearch, setProductSearch] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [imageFile, setImageFile]         = useState(null);
  const [imagePreview, setImagePreview]   = useState("");
  const imageInputRef = useRef(null);

  const [productForm, setProductForm] = useState({
    name:"", price:"", originalPrice:"", category:"Fashion",
    brand:"Ram Enterprise", description:"", image:"", rating:"4.0", quantity:"10",
  });

  /* Settings state */
  const [settings, setSettings] = useState({
    storeName:"Ram Enterprise", storeEmail:"support@ramenterprise.com",
    phone:"+91 9313999596", address:"Surat, Gujarat, India",
    taxRate:"0", shippingCharge:"0", logo:"",
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [logoFile, setLogoFile]   = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const logoInputRef = useRef(null);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Load orders from Firebase */
  useEffect(() => {
    const load = async () => {
      try {
        const fb = await fetchAllOrders();
        const merged = [...fb, ...initialOrders].reduce((acc, o) => {
          if (!acc.find(x => x.id === o.id)) acc.push(o);
          return acc;
        }, []);
        setOrders(merged);
      } catch { setOrders(initialOrders); }
      finally { setLoadingOrders(false); }
    };
    load();
  }, []);

  /* Load settings from Firebase */
  useEffect(() => {
    const loadSettings = async () => {
      const saved = await fetchStoreSettings();
      if (saved) setSettings(s => ({ ...s, ...saved }));
    };
    loadSettings();
  }, []);

  /* derived stats */
  const totalRevenue   = orders.reduce((s, o) => s + (o.total || 0), 0);
  const pendingOrders  = orders.filter(o => !["Delivered","Cancelled"].includes(o.status));
  const deliveredCount = orders.filter(o => o.status === "Delivered").length;
  const avgOrder       = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  const filteredOrders = orders.filter(o => {
    const q = searchOrder.toLowerCase();
    const match = String(o.id).includes(q) || (o.items||[]).some(i => i.name?.toLowerCase().includes(q))
      || (o.customerName||"").toLowerCase().includes(q);
    const statusOk = filterStatus === "All" || o.status === filterStatus;
    return match && statusOk;
  });
  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const updateStatus = async (id, status) => {
    try { await updateOrderStatus(id, status); } catch {}
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Order #${id} → ${status}`);
  };

  /* ── Product Form helpers ── */
  const openAdd = () => {
    setEditProduct(null);
    setProductForm({ name:"",price:"",originalPrice:"",category:"Fashion",brand:"Ram Enterprise",description:"",image:"",rating:"4.0",quantity:"10" });
    setImageFile(null); setImagePreview("");
    setShowProductForm(true);
  };
  const openEdit = (p) => {
    setEditProduct(p);
    setProductForm({
      name:p.name, price:String(p.price), originalPrice:String(p.originalPrice||""),
      category:p.category, brand:p.brand||"Ram Enterprise", description:p.description||"",
      image:p.image||"", rating:String(p.rating||"4.0"), quantity:String(p.quantity??10),
    });
    setImageFile(null); setImagePreview(p.image||"");
    setShowProductForm(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price) { showToast("Name & price required","error"); return; }
    setSavingProduct(true);
    try {
      let imageUrl = productForm.image;

      // Upload new image if file selected
      if (imageFile) {
        const tempId = editProduct?._id || editProduct?.id || `temp_${Date.now()}`;
        if (editProduct && productForm.image?.includes('firebasestorage')) {
          await deleteProductImage(productForm.image);
        }
        imageUrl = await uploadProductImage(imageFile, tempId);
      }

      const np = {
        name: productForm.name,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) || Number(productForm.price),
        category: productForm.category,
        brand: productForm.brand,
        description: productForm.description,
        image: imageUrl,
        rating: Number(productForm.rating),
        quantity: Number(productForm.quantity) || 0,
      };

      if (editProduct) {
        const pid = editProduct._id || editProduct.id;
        await updateProduct(pid, np);
        setProducts(prev => prev.map(p => (p._id||p.id) === pid ? { ...p, ...np, _id: pid, id: pid } : p));
        setGlobalProducts?.(prev => prev.map(p => (p._id||p.id) === pid ? { ...p, ...np, _id: pid, id: pid } : p));
        showToast("Product updated!");
      } else {
        const created = await addProduct(np);
        setProducts(prev => [created, ...prev]);
        setGlobalProducts?.(prev => [created, ...prev]);
        showToast("Product added!");
      }
      setShowProductForm(false);
    } catch (err) {
      showToast("Save failed: " + err.message, "error");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    try {
      const pid = p._id || p.id;
      if (pid && !pid.startsWith("temp_") && !/^\d+$/.test(pid)) {
        await deleteProduct(pid);
      }
      if (p.image?.includes('firebasestorage')) await deleteProductImage(p.image);
      setProducts(prev => prev.filter(x => (x._id||x.id) !== pid));
      setGlobalProducts?.(prev => prev.filter(x => (x._id||x.id) !== pid));
      showToast("Product deleted", "error");
    } catch (err) {
      showToast("Delete failed: " + err.message, "error");
    }
  };

  /* ── Settings save ── */
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      let logoUrl = settings.logo;
      if (logoFile) {
        logoUrl = await uploadProductImage(logoFile, `logo_${Date.now()}`);
      }
      const updated = { ...settings, logo: logoUrl };
      await saveStoreSettings(updated);
      setSettings(updated);
      setLogoFile(null);
      showToast("Settings saved!");
    } catch (err) {
      showToast("Save failed: " + err.message, "error");
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0c1210]">
      <AdminSidebar activeTab={tab} onTabChange={setTab} adminName={adminName}
        onLogout={onLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
        onViewStore={onBack} />

      <div className="lg:ml-60 flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#0c1210]/90 backdrop-blur-xl border-b border-white/8 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/6 hover:bg-white/10 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest">Admin Panel</p>
              <h1 className="font-serif-display font-bold text-lg italic text-white capitalize">{tab}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-400 font-semibold">Live</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {adminName?.[0]?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Toast */}
        {toast && (
          <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-xl flex items-center gap-2 toast
            ${toast.type === "error" ? "bg-red-500 text-white" : "bg-brand-light text-stone-900"}`}>
            <span>{toast.type === "error" ? "✕" : "✓"}</span>
            {toast.msg}
          </div>
        )}

        <div className="flex-1 p-6 space-y-6 overflow-auto">

          {/* ════ DASHBOARD ════ */}
          {tab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue"  value={`₹${totalRevenue.toLocaleString()}`} sub="All time" icon="💰" gradient="bg-gradient-to-br from-green-500/20 to-green-600/10" change={12} />
                <StatCard label="Total Orders"   value={orders.length}   sub="Lifetime"       icon="📦" gradient="bg-gradient-to-br from-blue-500/20 to-blue-600/10"  change={8}  />
                <StatCard label="Pending Orders" value={pendingOrders.length} sub="Need attention" icon="⏳" gradient="bg-gradient-to-br from-amber-500/20 to-amber-600/10" change={-3} />
                <StatCard label="Products"       value={products.length} sub="In catalogue"   icon="🛍️" gradient="bg-gradient-to-br from-purple-500/20 to-purple-600/10" change={5}  />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#161d18] border border-white/8 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
                    <h2 className="font-semibold text-white text-sm">Recent Orders</h2>
                    <button onClick={() => setTab("orders")} className="text-[11px] text-brand-light font-semibold hover:underline">View all →</button>
                  </div>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-stone-500"><p className="text-3xl mb-2">📭</p><p className="text-sm">No orders yet</p></div>
                  ) : orders.slice(0, 6).map(o => (
                    <div key={o.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 hover:bg-white/3 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center text-xs font-bold text-stone-300">{String(o.id).slice(-2)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">#{o.id}</p>
                        <p className="text-[10px] text-stone-500">{o.customerName || o.userId} · {o.items?.length || 0} item(s)</p>
                      </div>
                      <p className="text-sm font-bold text-white hidden sm:block">₹{o.total?.toLocaleString()}</p>
                      <StatusBadge status={o.status || "Confirmed"} />
                    </div>
                  ))}
                </div>

                <div className="bg-[#161d18] border border-white/8 rounded-2xl p-5">
                  <h3 className="font-semibold text-white text-sm mb-4">Category Split</h3>
                  <div className="space-y-3">
                    {["Fashion","Electronics","Gaming","Home"].map(cat => {
                      const cnt = products.filter(p => p.category === cat).length;
                      const pct = products.length > 0 ? Math.round((cnt / products.length) * 100) : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-stone-400 font-medium">{cat}</span>
                            <span className="text-xs text-stone-500">{cnt} · {pct}%</span>
                          </div>
                          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div className={`h-full ${CATEGORY_COLOR[cat]} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-white/8">
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-lg font-bold text-white">₹{avgOrder.toLocaleString()}</p>
                      <p className="text-[10px] text-stone-500">Avg. Order</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-lg font-bold text-green-400">{deliveredCount}</p>
                      <p className="text-[10px] text-stone-500">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ORDER_STATUSES.map(s => {
                  const cnt = orders.filter(o => o.status === s).length;
                  const st = STATUS_STYLE[s];
                  return (
                    <button key={s} onClick={() => { setTab("orders"); setFilterStatus(s); }}
                      className={`${st.bg} border border-white/8 rounded-2xl p-4 text-left hover:border-white/20 transition-all`}>
                      <p className={`text-xl font-bold ${st.text}`}>{cnt}</p>
                      <p className="text-[10px] text-stone-400 font-medium mt-0.5">{s}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ ORDERS ════ */}
          {tab === "orders" && (
            <div className="space-y-4">
              <div className="bg-[#161d18] border border-white/8 rounded-2xl p-4 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/6 rounded-xl px-4 py-2.5 flex-grow min-w-[200px] border border-white/8 focus-within:border-brand/50 transition-colors">
                  <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                  <input value={searchOrder} onChange={e => setSearchOrder(e.target.value)} placeholder="Search order, product or customer..."
                    className="bg-transparent text-sm text-white placeholder:text-stone-600 outline-none w-full" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {["All", ...ORDER_STATUSES].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all ${filterStatus === s ? "bg-brand text-white" : "bg-white/6 text-stone-400 hover:bg-white/10 hover:text-white border border-white/8"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-stone-500">{filteredOrders.length} orders found</p>
                <button onClick={() => exportCSV(filteredOrders)}
                  className="flex items-center gap-2 bg-brand/20 border border-brand/30 text-brand-light text-xs font-bold px-4 py-2 rounded-xl hover:bg-brand/30 transition-all">
                  ⬇ Export CSV
                </button>
              </div>

              <div className="bg-[#161d18] border border-white/8 rounded-2xl overflow-hidden">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-16 text-stone-500"><p className="text-3xl mb-2">📭</p><p className="text-sm">No orders match</p></div>
                ) : filteredOrders.map(order => (
                  <div key={order.id} className="border-b border-white/5 last:border-0">
                    <div className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center text-xs font-bold text-stone-300 flex-shrink-0">
                        #{String(order.id).slice(-2)}
                      </div>
                      <div className="flex-1 min-w-[120px]">
                        <p className="text-sm font-bold text-white">Order #{order.id}</p>
                        <p className="text-[10px] text-stone-500">{order.customerName || order.userId} · {order.items?.length || 0} item(s) · {order.paymentMethod}</p>
                      </div>
                      <p className="text-sm font-bold text-white">₹{order.total?.toLocaleString()}</p>
                      <select value={order.status || "Confirmed"} onChange={e => updateStatus(order.id, e.target.value)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer border border-white/10 bg-transparent ${STATUS_STYLE[order.status]?.text || "text-blue-400"}`}>
                        {ORDER_STATUSES.map(s => <option key={s} className="bg-stone-900 text-white">{s}</option>)}
                      </select>
                      <button onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="text-[11px] text-brand-light font-semibold hover:underline flex items-center gap-1">
                        {expandedOrder === order.id ? "▲ Hide" : "▼ Details"}
                      </button>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="px-5 pb-4 bg-white/2 space-y-3">
                        {/* Customer details */}
                        <div className="bg-white/5 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                          <div>
                            <p className="text-[9px] text-stone-500 uppercase tracking-wider">Customer</p>
                            <p className="text-xs font-semibold text-white">{order.customerName || order.userId || "Guest"}</p>
                          </div>
                          {order.customerEmail && (
                            <div>
                              <p className="text-[9px] text-stone-500 uppercase tracking-wider">Email</p>
                              <p className="text-xs text-stone-300">{order.customerEmail}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-[9px] text-stone-500 uppercase tracking-wider">Phone</p>
                            <p className="text-xs text-stone-300">{order.customerPhone || order.phone || "—"}</p>
                          </div>
                          {order.address && (
                            <div className="sm:col-span-3">
                              <p className="text-[9px] text-stone-500 uppercase tracking-wider">Delivery Address</p>
                              <p className="text-xs text-stone-300">{order.address}</p>
                            </div>
                          )}
                        </div>

                        {/* Items */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                                <p className="text-[10px] text-stone-500">{item.category}</p>
                              </div>
                              <p className="text-sm font-bold text-brand-light">₹{item.price?.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>

                        {/* Progress */}
                        <div className="mt-2 flex items-center gap-0">
                          {ORDER_STATUSES.slice(0,4).map((s, i) => {
                            const idx = ORDER_STATUSES.indexOf(order.status || "Confirmed");
                            const done = i <= idx;
                            return (
                              <React.Fragment key={s}>
                                <div className="flex flex-col items-center">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${done ? "bg-brand text-white" : "bg-white/10 text-stone-600"}`}>{i+1}</div>
                                  <p className={`text-[8px] mt-1 font-medium ${done ? "text-brand-light" : "text-stone-600"}`}>{s}</p>
                                </div>
                                {i < 3 && <div className={`flex-1 h-0.5 -mt-5 transition-all ${done && i < idx ? "bg-brand" : "bg-white/10"}`} />}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ════ PRODUCTS ════ */}
          {tab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white/6 rounded-xl px-4 py-2.5 flex-grow max-w-sm border border-white/8 focus-within:border-brand/50">
                  <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" /></svg>
                  <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..."
                    className="bg-transparent text-sm text-white placeholder:text-stone-600 outline-none w-full" />
                </div>
                <button onClick={openAdd}
                  className="ml-auto bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-light hover:text-stone-900 transition-all shadow-lg shadow-brand/30 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                  Add Product
                </button>
              </div>

              <div className="bg-[#161d18] border border-white/8 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-white/8">
                  <p className="text-xs text-stone-500 font-medium">{filteredProducts.length} products</p>
                </div>
                {filteredProducts.map(p => {
                  const disc = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                  const isLowStock = (p.quantity ?? 0) < 5;
                  return (
                    <div key={p._id||p.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/8 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-stone-400">{p.category}</span>
                          <span className="text-[10px] text-stone-500">⭐ {p.rating}</span>
                          {isLowStock
                            ? <span className="text-[9px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">⚠ Low Stock: {p.quantity??0}</span>
                            : <span className="text-[9px] font-bold bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">Stock: {p.quantity??0}</span>
                          }
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-white">₹{p.price?.toLocaleString()}</p>
                        {disc > 0 && <p className="text-[10px] text-green-400 font-semibold">-{disc}% off</p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center hover:bg-blue-500/25 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => handleDeleteProduct(p)}
                          className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center hover:bg-red-500/25 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Product Form Modal */}
          {showProductForm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowProductForm(false)}>
              <div className="bg-[#161d18] border border-white/15 rounded-3xl p-7 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif-display font-bold text-xl italic text-white">{editProduct ? "Edit" : "Add"} Product</h3>
                  <button onClick={() => setShowProductForm(false)} className="w-8 h-8 rounded-xl bg-white/8 text-stone-400 hover:bg-white/15 flex items-center justify-center">✕</button>
                </div>
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Product Image</label>
                    <div className="flex gap-3 items-start">
                      {imagePreview && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/8 flex-shrink-0">
                          <img src={imagePreview} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <button type="button" onClick={() => imageInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-white/20 hover:border-brand/50 rounded-xl px-3 py-2.5 text-xs text-stone-400 hover:text-brand-light transition-all">
                          📷 {imageFile ? imageFile.name : "Click to upload image"}
                        </button>
                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        <input type="text" placeholder="Or paste image URL..." value={productForm.image}
                          onChange={e => { setProductForm(p => ({...p, image:e.target.value})); if(!imageFile) setImagePreview(e.target.value); }}
                          className="w-full bg-white/6 border border-white/10 focus:border-brand/60 rounded-xl px-3 py-2 text-xs text-white placeholder:text-stone-600 outline-none" />
                      </div>
                    </div>
                  </div>

                  {[
                    { l:"Product Name", k:"name", t:"text", p:"e.g. Blue Slim Jeans" },
                    { l:"Selling Price (₹)", k:"price", t:"number", p:"999" },
                    { l:"MRP / Original Price (₹)", k:"originalPrice", t:"number", p:"1999" },
                    { l:"Stock Quantity", k:"quantity", t:"number", p:"10" },
                    { l:"Rating (0-5)", k:"rating", t:"number", p:"4.5" },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">{f.l}</label>
                      <input type={f.t} placeholder={f.p} value={productForm[f.k]}
                        onChange={e => setProductForm(p => ({...p, [f.k]: e.target.value}))}
                        className="w-full bg-white/6 border border-white/10 focus:border-brand/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-stone-600 outline-none transition-all" />
                    </div>
                  ))}

                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Category</label>
                    <select value={productForm.category} onChange={e => setProductForm(p => ({...p, category:e.target.value}))}
                      className="w-full bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer">
                      {["Fashion","Electronics","Gaming","Home"].map(c => <option key={c} className="bg-stone-900">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Description</label>
                    <textarea value={productForm.description} onChange={e => setProductForm(p => ({...p, description:e.target.value}))}
                      placeholder="Short product description..."
                      className="w-full bg-white/6 border border-white/10 focus:border-brand/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-stone-600 outline-none h-20 resize-none transition-all" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowProductForm(false)}
                    className="flex-1 border border-white/15 py-2.5 rounded-xl text-sm font-semibold text-stone-400 hover:bg-white/6 transition-all">Cancel</button>
                  <button onClick={saveProduct} disabled={savingProduct}
                    className="flex-1 bg-brand text-white py-2.5 rounded-xl text-sm font-bold hover:bg-brand-light hover:text-stone-900 transition-all shadow-lg shadow-brand/30 disabled:opacity-60 flex items-center justify-center gap-2">
                    {savingProduct && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {editProduct ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════ CUSTOMERS ════ */}
          {tab === "customers" && (() => {
            const uniqueCustomers = [...new Map(
              orders.map(o => [o.userId, {
                name: o.customerName || o.userId || "Guest",
                email: o.customerEmail || "",
                phone: o.customerPhone || o.phone || "",
                orders: orders.filter(x => x.userId === o.userId).length,
                spent: orders.filter(x => x.userId === o.userId).reduce((s, x) => s + (x.total||0), 0),
                lastOrder: o.date,
              }])
            ).values()];
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Total Customers" value={uniqueCustomers.length} icon="👥" gradient="bg-gradient-to-br from-blue-500/20 to-blue-600/10" />
                  <StatCard label="Repeat Buyers" value={uniqueCustomers.filter(c => c.orders > 1).length} icon="🔄" gradient="bg-gradient-to-br from-green-500/20 to-green-600/10" />
                  <StatCard label="Avg. Spend" value={`₹${uniqueCustomers.length ? Math.round(uniqueCustomers.reduce((s,c) => s+c.spent,0)/uniqueCustomers.length).toLocaleString() : 0}`} icon="💳" gradient="bg-gradient-to-br from-amber-500/20 to-amber-600/10" />
                </div>
                <div className="bg-[#161d18] border border-white/8 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-white/8">
                    <p className="text-sm font-semibold text-white">{uniqueCustomers.length} Customers</p>
                  </div>
                  {uniqueCustomers.length === 0 ? (
                    <div className="text-center py-16 text-stone-500"><p className="text-3xl mb-2">👥</p><p className="text-sm">No customers yet</p></div>
                  ) : uniqueCustomers.map((c, i) => (
                    <div key={c.name+i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand/30 to-brand-light/20 flex items-center justify-center font-bold text-brand-light text-sm">
                        {c.name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{c.name}</p>
                        <p className="text-[10px] text-stone-500">
                          {c.email && <span>{c.email} · </span>}
                          {c.phone && <span>{c.phone} · </span>}
                          {c.orders} order(s) · Last: {c.lastOrder}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">₹{c.spent.toLocaleString()}</p>
                        <p className="text-[10px] text-stone-500">Total spent</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${c.orders > 1 ? "bg-green-500/15 text-green-400" : "bg-white/8 text-stone-400"}`}>
                        {c.orders > 1 ? "Repeat" : "New"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ════ ANALYTICS ════ */}
          {tab === "analytics" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button onClick={() => exportCSV(orders)}
                  className="flex items-center gap-2 bg-brand/20 border border-brand/30 text-brand-light text-xs font-bold px-4 py-2 rounded-xl hover:bg-brand/30 transition-all">
                  ⬇ Export Full Report CSV
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon="💰" gradient="bg-gradient-to-br from-green-500/20 to-green-600/10" change={12} />
                <StatCard label="Total Orders"  value={orders.length}   icon="📦" gradient="bg-gradient-to-br from-blue-500/20 to-blue-600/10" change={8} />
                <StatCard label="Avg. Order"    value={`₹${avgOrder.toLocaleString()}`} icon="📊" gradient="bg-gradient-to-br from-purple-500/20 to-purple-600/10" change={3} />
                <StatCard label="Delivered"     value={`${orders.length ? Math.round((deliveredCount/orders.length)*100) : 0}%`} icon="✅" gradient="bg-gradient-to-br from-amber-500/20 to-amber-600/10" change={5} />
              </div>

              <div className="bg-[#161d18] border border-white/8 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-5">Revenue by Category</h3>
                <div className="space-y-4">
                  {["Fashion","Electronics","Gaming","Home"].map(cat => {
                    const revenue = orders.reduce((s, o) => s + (o.items||[]).filter(i => i.category===cat).reduce((ss, i) => ss+(i.price||0), 0), 0);
                    const pct = totalRevenue > 0 ? Math.round((revenue/totalRevenue)*100) : 0;
                    return (
                      <div key={cat} className="flex items-center gap-4">
                        <span className="text-xs text-stone-400 w-24 font-medium">{cat}</span>
                        <div className="flex-1 h-2.5 bg-white/8 rounded-full overflow-hidden">
                          <div className={`h-full ${CATEGORY_COLOR[cat]} rounded-full transition-all duration-700`} style={{ width:`${pct}%` }} />
                        </div>
                        <span className="text-xs text-stone-400 w-28 text-right">₹{revenue.toLocaleString()} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#161d18] border border-white/8 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-5">Order Status Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {ORDER_STATUSES.map(s => {
                    const cnt = orders.filter(o => o.status===s).length;
                    const pct = orders.length ? Math.round((cnt/orders.length)*100) : 0;
                    const st = STATUS_STYLE[s];
                    return (
                      <div key={s} className={`${st.bg} rounded-2xl p-4`}>
                        <p className={`text-2xl font-bold ${st.text}`}>{cnt}</p>
                        <p className="text-[10px] text-stone-400 mt-1">{s}</p>
                        <p className={`text-xs font-bold ${st.text} mt-1`}>{pct}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#161d18] border border-white/8 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Top Products by Price</h3>
                <div className="space-y-3">
                  {[...products].sort((a,b)=>b.price-a.price).slice(0,5).map((p,i) => (
                    <div key={p._id||p.id} className="flex items-center gap-4">
                      <span className="text-stone-600 text-xs font-bold w-5">#{i+1}</span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/8 flex-shrink-0">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                        <p className="text-[10px] text-stone-500">{p.category}</p>
                      </div>
                      <p className="text-sm font-bold text-brand-light">₹{p.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ INVENTORY ════ */}
          {tab === "inventory" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {["Fashion","Electronics","Gaming","Home"].map(cat => {
                  const catProds = products.filter(p => p.category===cat);
                  const lowStock = catProds.filter(p => (p.quantity??0) < 5).length;
                  return (
                    <div key={cat} className="bg-[#161d18] border border-white/8 rounded-2xl p-4 hover:border-white/15 transition-all">
                      <div className={`w-8 h-8 rounded-lg ${CATEGORY_COLOR[cat]}/20 flex items-center justify-center mb-3`}>
                        <span className={`w-2 h-2 rounded-full ${CATEGORY_COLOR[cat]}`} />
                      </div>
                      <p className="text-xl font-bold text-white">{catProds.length}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{cat}</p>
                      {lowStock > 0 && <p className="text-[9px] text-red-400 font-bold mt-1">⚠ {lowStock} low stock</p>}
                    </div>
                  );
                })}
              </div>

              {["Fashion","Electronics","Gaming","Home"].map(cat => {
                const catProds = products.filter(p => p.category===cat);
                if (!catProds.length) return null;
                return (
                  <div key={cat} className="bg-[#161d18] border border-white/8 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/8 flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${CATEGORY_COLOR[cat]}`} />
                      <p className="text-sm font-bold text-white">{cat}</p>
                      <span className="text-[10px] text-stone-500 bg-white/6 px-2 py-0.5 rounded-full">{catProds.length} items</span>
                    </div>
                    {catProds.map(p => {
                      const qty = p.quantity ?? 0;
                      const isLow = qty < 5;
                      return (
                        <div key={p._id||p.id} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-white/8 flex-shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{p.name}</p>
                            <p className="text-[10px] text-stone-500">⭐ {p.rating}</p>
                          </div>
                          <p className="text-sm font-bold text-white">₹{p.price?.toLocaleString()}</p>
                          <div className="text-right">
                            <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${isLow ? "bg-red-500/20 text-red-400" : "bg-green-500/15 text-green-400"}`}>
                              {isLow ? `⚠ Low: ${qty}` : `Stock: ${qty}`}
                            </span>
                          </div>
                          <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center hover:bg-blue-500/25 transition-colors">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ SETTINGS ════ */}
          {tab === "settings" && (
            <div className="max-w-2xl space-y-6">

              {/* ── Store Info Card ── */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#161d18", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <h2 className="font-bold text-white text-base">🏪 Store Information</h2>
                  <p className="text-xs text-stone-500 mt-0.5">Basic details about your store</p>
                </div>

                <div className="p-6 space-y-5">

                  {/* Logo Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-2">Store Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
                        {(logoPreview || settings.logo) ? (
                          <img src={logoPreview || settings.logo} alt="logo" className="w-full h-full object-cover rounded-xl" onError={e => e.target.style.display="none"} />
                        ) : (
                          <span className="text-2xl">🏪</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <button type="button" onClick={() => logoInputRef.current?.click()}
                          className="w-full text-left px-4 py-3 rounded-xl text-sm text-stone-400 hover:text-brand-light transition-all"
                          style={{ background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.15)" }}>
                          📷 {logoFile ? logoFile.name : "Click to upload logo image"}
                        </button>
                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files[0]; if(f){ setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }}} />
                      </div>
                    </div>
                  </div>

                  {/* Store Name + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { l: "Store Name",  k: "storeName",   p: "e.g. Ram Enterprise"            },
                      { l: "Store Email", k: "storeEmail",  p: "support@store.com"               },
                    ].map(f => (
                      <div key={f.k}>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1.5">{f.l}</label>
                        <input
                          value={settings[f.k] || ""}
                          onChange={e => setSettings(s => ({ ...s, [f.k]: e.target.value }))}
                          placeholder={f.p}
                          className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                          onFocus={e => e.target.style.borderColor = "rgba(82,183,136,0.6)"}
                          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Phone + Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { l: "Phone",   k: "phone",   p: "+91 XXXXXXXXXX"       },
                      { l: "Address", k: "address", p: "City, State, Country" },
                    ].map(f => (
                      <div key={f.k}>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1.5">{f.l}</label>
                        <input
                          value={settings[f.k] || ""}
                          onChange={e => setSettings(s => ({ ...s, [f.k]: e.target.value }))}
                          placeholder={f.p}
                          className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                          onFocus={e => e.target.style.borderColor = "rgba(82,183,136,0.6)"}
                          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Pricing Card ── */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#161d18", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <h2 className="font-bold text-white text-base">💰 Pricing & Charges</h2>
                  <p className="text-xs text-stone-500 mt-0.5">Tax and shipping configuration</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { l: "Tax Rate (%)",        k: "taxRate",        p: "0",  t: "number" },
                      { l: "Shipping Charge (₹)", k: "shippingCharge", p: "50", t: "number" },
                    ].map(f => (
                      <div key={f.k}>
                        <label className="block text-xs font-semibold text-stone-400 uppercase tracking-widest mb-1.5">{f.l}</label>
                        <input
                          type={f.t}
                          value={settings[f.k] || ""}
                          onChange={e => setSettings(s => ({ ...s, [f.k]: e.target.value }))}
                          placeholder={f.p}
                          min="0"
                          className="w-full rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                          onFocus={e => e.target.style.borderColor = "rgba(82,183,136,0.6)"}
                          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.10)"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Save Button ── */}
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #2d6a4f, #52b788)", boxShadow: "0 4px 20px rgba(45,106,79,0.35)" }}
              >
                {savingSettings
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  : "💾 Save Settings"
                }
              </button>

              {/* ── Danger Zone ── */}
              <div className="rounded-2xl p-6" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <h3 className="font-bold text-red-400 text-sm mb-1">⚠ Danger Zone</h3>
                <p className="text-xs text-stone-500 mb-4">These actions cannot be undone. Be careful.</p>
                <button
                  onClick={() => { if (window.confirm("Clear all orders? This cannot be undone.")) { setOrders([]); showToast("All orders cleared", "error"); }}}
                  className="text-xs font-bold text-red-400 px-4 py-2 rounded-xl transition-all hover:text-red-300"
                  style={{ border: "1px solid rgba(239,68,68,0.3)", background: "transparent" }}
                  onMouseEnter={e => e.target.style.background = "rgba(239,68,68,0.08)"}
                  onMouseLeave={e => e.target.style.background = "transparent"}
                >
                  🗑 Clear All Orders
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
