import React from "react";

const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-white mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pt-16 pb-10 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10">

        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-serif-display font-bold text-2xl italic text-white">
            Ram Enterprise
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
            A leading startup from Surat, Gujarat. We deliver curated fashion, electronics &amp; lifestyle products with quality you can trust.
          </p>
          <div className="flex gap-3 pt-2">
            {["Facebook", "Instagram", "Twitter"].map(s => (
              <span
                key={s}
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xs text-stone-400 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
              >
                {s[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Quick Links
          </h3>
          <ul className="space-y-2.5">
            {[
              { label: "Home",        view: "home"   },
              { label: "Our Story",   view: "about"  },
              { label: "My Orders",   view: "orders" },
              { label: "My Bag",      view: "cart"   },
            ].map(l => (
              <li key={l.view}>
                <button
                  onClick={() => onNavigate(l.view)}
                  className="text-sm text-stone-400 hover:text-white transition-colors"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Contact Us
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-stone-400">
              <span className="mt-0.5">📍</span>
              <span>Surat, Gujarat, India</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-stone-400">
              <span className="mt-0.5">📞</span>
              <span>+91 9313999596</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-stone-400">
              <span className="mt-0.5">✉️</span>
              <span>support@ramenterprise.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-stone-500">
          © 2024–2026 Ram Enterprise. All rights reserved.
        </p>
        <div className="flex gap-6">
          <button className="text-xs text-stone-500 hover:text-white transition-colors">Privacy Policy</button>
          <button className="text-xs text-stone-500 hover:text-white transition-colors">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
