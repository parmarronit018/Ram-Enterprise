import React from "react";

const NAV_ITEMS = [
  { label: "Home",        icon: "home",   view: "home"                    },
  { label: "My Bag",      icon: "bag",    view: "cart"                    },
  { label: "My Orders",   icon: "orders", view: "orders",  userOnly: true },
  { label: "Wishlist",    icon: "heart",  view: "wishlist", userOnly: true},
  { label: "Admin Panel", icon: "shield", view: "admin",   adminOnly: true},
  { label: "About Us",    icon: "info",   view: "help"                    },
];

const ICONS = {
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
    </svg>
  ),
  bag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  orders: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  heart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    </svg>
  ),
};

function SideBar({ isOpen, onClose, onNavigate, user, isAdmin, onLogout }) {

  const visibleItems = NAV_ITEMS.filter(item => {
    if (item.adminOnly) return isAdmin;
    if (item.userOnly)  return user && !isAdmin;
    return true;
  });

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[70] shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div>
            <p className="font-serif-display font-bold text-lg text-stone-900 italic">Ram Enterprise</p>
            <p className="text-xs mt-0.5">
              {user
                ? <span className="text-stone-400">Welcome, <span className="font-medium text-stone-600">{user}</span>{isAdmin && <span className="ml-1 text-brand font-semibold">(Admin)</span>}</span>
                : <span className="text-stone-400">Hello, Guest</span>
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-cream-200 flex items-center justify-center text-stone-500 hover:bg-cream-300 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group text-left
                ${item.adminOnly
                  ? "text-brand hover:bg-brand/10"
                  : "text-stone-600 hover:bg-cream-200 hover:text-stone-900"
                }`}
            >
              <span className={`transition-colors ${item.adminOnly ? "text-brand" : "text-stone-400 group-hover:text-brand"}`}>
                {ICONS[item.icon]}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 pb-6 space-y-2 border-t border-stone-100 pt-4">
          {user ? (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              Logout
            </button>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-stone-900 text-white hover:bg-brand transition-colors text-sm font-semibold"
            >
              Sign In
            </button>
          )}
          <p className="text-center text-[10px] text-stone-300 font-medium uppercase tracking-widest pt-1">
            © 2026 Ram Enterprise
          </p>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
