import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./Components/ProductCard";

const CATEGORIES = ["All", "Electronics", "Fashion", "Gaming", "Home"];

/* ── Typewriter hook ── */
function useTypewriter(words, speed = 100, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const word = words[idx % words.length];
    let timer;
    if (!deleting) {
      if (display.length < word.length) {
        timer = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), speed);
      } else {
        timer = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (display.length > 0) {
        timer = setTimeout(() => setDisplay(word.slice(0, display.length - 1)), speed / 2);
      } else {
        setDeleting(false);
        setIdx(i => i + 1);
      }
    }
    return () => clearTimeout(timer);
  }, [display, deleting, idx, words, speed, pause]);
  return display;
}

/* ── Counter hook ── */
function useCounter(target, duration = 1200, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function HomeScreen({
  filtered, onSelectProduct, onAddToCart, onBuyNow,
  searchTerm, setSearchTerm,
  selectedCategory, setSelectedCategory,
  sortBy, setSortBy,
}) {
  const budgetProducts = filtered.filter(p => p.price < 999);
  const featured = filtered.slice(0, 3);
  const heroWords = ["Fashion", "Electronics", "Gaming", "Lifestyle"];
  const typed = useTypewriter(heroWords, 90, 1800);

  /* stats counter */
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const c1 = useCounter(40, 1200, statsVisible);
  const c2 = useCounter(500, 1400, statsVisible);
  const c3 = useCounter(99, 1000, statsVisible);
  const c4 = useCounter(7, 800, statsVisible);

  /* scroll reveal + stats observer */
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale")
      .forEach(el => io.observe(el));

    const statsIo = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) statsIo.observe(statsRef.current);

    return () => { io.disconnect(); statsIo.disconnect(); };
  }, [filtered]);

  return (
    <div className="bg-cream-100 min-h-screen">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0f1a14] text-white min-h-[88vh] flex items-center">
        {/* animated mesh gradient bg */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-light/10 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px]" />
        </div>

        {/* subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-dark.png')" }} />

        <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-16 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Left Text ── */}
          <div>
            {/* pill label */}
            <div className="inline-flex items-center gap-2 bg-brand/20 border border-brand/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-brand-light rounded-full animate-pulse"></span>
              <span className="text-brand-light text-xs font-semibold tracking-widest uppercase">New Arrivals 2026</span>
            </div>

            <h1 className="font-serif-display font-black leading-[1.05] italic mb-6">
              <span className="block text-4xl lg:text-6xl text-white mb-2">Premium</span>
              <span className="block text-5xl lg:text-7xl hero-gradient-text min-h-[1.1em]">
                {typed}
                <span className="inline-block w-[3px] h-[0.85em] bg-brand-light ml-1 align-middle animate-pulse" />
              </span>
              <span className="block text-3xl lg:text-5xl text-stone-300 mt-2">For Everyone</span>
            </h1>

            <p className="text-stone-400 text-base lg:text-lg font-light leading-relaxed max-w-md mb-8">
              Ram Enterprise — curated fashion, electronics &amp; lifestyle. Handpicked for everyday excellence &amp; delivered to your door.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <button
                onClick={() => setSelectedCategory("All")}
                className="ripple bg-brand-light text-stone-900 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-brand hover:text-white transition-all shadow-lg shadow-brand/30 flex items-center gap-2"
              >
                <span>Shop Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedCategory("Electronics")}
                className="ripple border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 hover:border-white/40 transition-all"
              >
                Explore Electronics
              </button>
            </div>

            {/* quick stats */}
            <div ref={statsRef} className="flex gap-8">
              {[
                { val: c1, suffix: "+", label: "Products" },
                { val: c2, suffix: "+", label: "Happy Customers" },
                { val: c3, suffix: "%", label: "Genuine" },
                { val: c4, suffix: "", label: "Day Returns" },
              ].map(({ val, suffix, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white">{val}{suffix}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right Floating Cards ── */}
          <div className="hidden lg:flex justify-center items-end gap-4 pb-6 relative">
            {featured.map((p, i) => (
              <div
                key={p._id}
                onClick={() => onSelectProduct(p)}
                className={`cursor-pointer rounded-3xl overflow-hidden glow-ring ring-1 ring-white/10
                  ${i === 0 ? "w-36 h-52 hero-float" : ""}
                  ${i === 1 ? "w-44 h-64 -mb-6 hero-float-2" : ""}
                  ${i === 2 ? "w-36 h-52 hero-float-3" : ""}
                `}
                style={{ transition: "transform 0.3s ease, box-shadow 0.3s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.07)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <div>
                    <p className="text-white text-xs font-semibold line-clamp-1">{p.name}</p>
                    <p className="text-brand-light text-xs font-bold">₹{p.price}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* floating badge */}
            <div className="absolute top-8 -left-4 bg-white rounded-2xl shadow-card-lg px-4 py-2.5 flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <div>
                <p className="text-xs font-bold text-stone-800">Trending</p>
                <p className="text-[10px] text-stone-400">40+ items</p>
              </div>
            </div>

            <div className="absolute -bottom-2 right-0 bg-white rounded-2xl shadow-card-lg px-4 py-2.5 flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <div>
                <p className="text-xs font-bold text-stone-800">4.8 Rating</p>
                <p className="text-[10px] text-stone-400">500+ reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#fafaf8" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════════ */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-16 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: "🚚", title: "Free Delivery", sub: "On orders above ₹999", color: "bg-blue-50 border-blue-100", icon_bg: "bg-blue-100" },
              { emoji: "🔄", title: "Easy Returns",  sub: "7-day hassle-free",     color: "bg-amber-50 border-amber-100", icon_bg: "bg-amber-100" },
              { emoji: "🔒", title: "100% Secure",   sub: "Encrypted payments",    color: "bg-green-50 border-green-100", icon_bg: "bg-green-100" },
              { emoji: "✅", title: "Genuine Only",  sub: "Quality assured",       color: "bg-purple-50 border-purple-100", icon_bg: "bg-purple-100" },
            ].map((item, i) => (
              <div
                key={item.title}
                className={`reveal trust-card flex items-center gap-4 ${item.color} border rounded-2xl px-5 py-4 cursor-default`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-11 h-11 ${item.icon_bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                  {item.emoji}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">{item.title}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">

        {/* ══════════════════════════════════════════════
            BUDGET PICKS
        ══════════════════════════════════════════════ */}
        {budgetProducts.length > 0 && (
          <section className="mb-20">
            <div className="reveal flex items-end justify-between mb-8">
              <div>
                <p className="text-brand-light text-xs font-bold tracking-widest uppercase mb-1">🏷️ Deals &amp; Offers</p>
                <h2 className="font-serif-display font-bold text-3xl text-stone-900 italic section-heading underlined">
                  Budget Picks
                </h2>
                <p className="text-stone-400 text-sm mt-1.5">Handpicked under ₹999 — Best value</p>
              </div>
              <button
                onClick={() => { setSelectedCategory("All"); setSortBy("lowToHigh"); }}
                className="ripple text-sm font-semibold text-brand border border-brand/20 px-4 py-2 rounded-full hover:bg-brand hover:text-white transition-all hidden sm:flex items-center gap-1"
              >
                View all <span className="text-base">→</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {budgetProducts.slice(0, 4).map((p, i) => {
                const disc = p.originalPrice
                  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  : 0;
                return (
                  <div
                    key={p._id}
                    onClick={() => onSelectProduct(p)}
                    className="reveal reveal-scale tilt-card bg-white rounded-3xl overflow-hidden shadow-card cursor-pointer"
                    style={{ transitionDelay: `${i * 80}ms` }}
                    onMouseMove={e => {
                      const r = e.currentTarget.getBoundingClientRect();
                      const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
                      const ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
                      e.currentTarget.style.setProperty('--rx', `${rx}deg`);
                      e.currentTarget.style.setProperty('--ry', `${ry}deg`);
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.setProperty('--rx', '0deg');
                      e.currentTarget.style.setProperty('--ry', '0deg');
                    }}
                  >
                    <div className="relative h-40 zoom-wrap bg-cream-200">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      {disc > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow">
                          -{disc}% OFF
                        </span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs font-semibold text-stone-800 leading-snug line-clamp-2 mb-2">{p.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">₹{p.price}</span>
                        <span className="text-[10px] text-stone-400 line-through">₹{p.originalPrice}</span>
                        {disc > 0 && <span className="text-[9px] text-green-600 font-bold">SAVE ₹{p.originalPrice - p.price}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            SEARCH + FILTER
        ══════════════════════════════════════════════ */}
        <section className="mb-10 reveal">
          <div className="bg-white rounded-3xl shadow-card p-4 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2.5 bg-cream-200 rounded-2xl px-4 py-2.5 flex-grow min-w-[200px] transition-all focus-within:ring-2 focus-within:ring-brand/20">
              <svg className="w-4 h-4 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm text-stone-800 placeholder:text-stone-400 outline-none w-full"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="text-stone-400 hover:text-stone-700 transition-colors text-lg leading-none">×</button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-cream-200 text-stone-700 text-sm font-medium px-4 py-2.5 rounded-2xl outline-none cursor-pointer hover:bg-cream-300 transition-colors"
            >
              <option value="default">Sort: Featured</option>
              <option value="lowToHigh">Price: Low → High</option>
              <option value="highToLow">Price: High → Low</option>
            </select>

            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`ripple text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-stone-900 text-white shadow-sm"
                      : "bg-cream-200 text-stone-500 hover:bg-cream-300 hover:text-stone-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PRODUCTS GRID
        ══════════════════════════════════════════════ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif-display font-bold text-xl text-stone-800 italic">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h3>
              <p className="text-stone-400 text-sm mt-0.5">
                {filtered.length} {filtered.length === 1 ? "item" : "items"} found
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-28 bg-white rounded-4xl shadow-card">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-serif-display text-xl italic text-stone-700 mb-2">No products found</h3>
              <p className="text-stone-400 text-sm mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                className="ripple bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-brand transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-5">
              {filtered.map((p, i) => (
                <div
                  key={p._id}
                  className="reveal-scale"
                  style={{ transitionDelay: `${(i % 12) * 35}ms` }}
                >
                  <ProductCard
                    product={p}
                    onClick={() => onSelectProduct(p)}
                    onAddToCart={onAddToCart}
                    onBuyNow={() => onBuyNow(p)}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════
            BANNER CTA
        ══════════════════════════════════════════════ */}
        <section className="reveal mt-20">
          <div className="relative overflow-hidden bg-stone-900 rounded-4xl px-8 py-12 text-white text-center">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand/30 rounded-full blur-[80px]" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-light/20 rounded-full blur-[80px]" />
            </div>
            <div className="relative">
              <p className="text-brand-light text-xs font-bold tracking-widest uppercase mb-3">Limited Time Offer</p>
              <h2 className="font-serif-display font-bold text-3xl lg:text-4xl italic mb-3">
                Free Delivery on Orders Above ₹999
              </h2>
              <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
                Shop from 40+ premium products. Fashion, electronics, gaming &amp; more — all at unbeatable prices.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className="ripple bg-brand-light text-stone-900 px-8 py-3.5 rounded-full text-sm font-bold hover:bg-white transition-all shadow-lg shadow-brand/30 inline-flex items-center gap-2"
              >
                Explore All Products
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default HomeScreen;
