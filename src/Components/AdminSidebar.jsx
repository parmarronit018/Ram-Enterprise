import React from "react";

const NAV = [
  {
    id: "dashboard", label: "Dashboard",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-4a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />,
  },
  {
    id: "orders", label: "Orders",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />,
  },
  {
    id: "products", label: "Products",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  },
  {
    id: "customers", label: "Customers",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
  },
  {
    id: "analytics", label: "Analytics",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  },
  {
    id: "inventory", label: "Inventory",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 8h14M5 8a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v0a2 2 0 01-2 2M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />,
  },
  {
    id: "settings", label: "Settings",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
  },
];

function AdminSidebar({ activeTab, onTabChange, adminName, onLogout, isOpen, onClose, onViewStore }) {
  const content = (
    <div className="flex flex-col h-full">

      {/* ── Brand ── */}
      <div className="px-6 pt-7 pb-5 border-b border-white/8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
          </div>
          <div>
            <p className="font-serif-display font-bold text-base italic text-white leading-tight">Ram Enterprise</p>
            <p className="text-[10px] text-stone-500 font-medium tracking-widest uppercase">Admin Console</p>
          </div>
        </div>
      </div>

      {/* ── Admin Profile ── */}
      <div className="px-5 py-4 mx-3 mt-4 mb-2 rounded-2xl bg-white/5 border border-white/8">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center font-bold text-white text-sm shadow-lg">
              {adminName?.[0]?.toUpperCase() || "A"}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-stone-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{adminName || "Admin"}</p>
            <p className="text-[10px] text-stone-400">Super Admin · Online</p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest px-3 py-2">Main Menu</p>
        {NAV.slice(0, 4).map(item => (
          <button
            key={item.id}
            onClick={() => { onTabChange(item.id); onClose?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group
              ${activeTab === item.id
                ? 'bg-brand text-white shadow-lg shadow-brand/30'
                : 'text-stone-400 hover:bg-white/6 hover:text-white'
              }`}
          >
            <svg className={`w-4.5 h-4.5 flex-shrink-0 transition-transform duration-200 ${activeTab === item.id ? '' : 'group-hover:scale-110'}`}
              style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            <span>{item.label}</span>
            {item.id === "orders" && (
              <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
            )}
          </button>
        ))}

        <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest px-3 py-2 mt-3">Store</p>
        {NAV.slice(4).map(item => (
          <button
            key={item.id}
            onClick={() => { onTabChange(item.id); onClose?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left group
              ${activeTab === item.id
                ? 'bg-brand text-white shadow-lg shadow-brand/30'
                : 'text-stone-400 hover:bg-white/6 hover:text-white'
              }`}
          >
            <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </button>
        ))}

        {/* View Store Button */}
        <div className="pt-3 mt-3 border-t border-white/8">
          <button
            onClick={() => { onClose?.(); onViewStore?.(); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-light hover:bg-brand/10 hover:text-white transition-all border border-brand/20 hover:border-brand/40"
          >
            <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>👁 View Store</span>
          </button>
        </div>
      </nav>

      {/* ── Logout ── */}
      <div className="p-4 border-t border-white/8">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-white/6 hover:bg-red-500/20 hover:text-red-400 text-stone-400 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-white/8 hover:border-red-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex lg:flex-col w-60 bg-[#0f1410] h-screen fixed left-0 top-0 z-50 border-r border-white/8">
        {content}
      </div>

      {/* Mobile overlay */}
      {isOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={onClose} />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-60 bg-[#0f1410] z-50 flex flex-col border-r border-white/8 animate-slideInRight">
            {content}
          </div>
        </>
      )}
    </>
  );
}

export default AdminSidebar;
