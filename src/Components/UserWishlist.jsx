import React from "react";

function UserWishlist({ wishlist = [], onBack, onAddToCart, onRemoveWishlist }) {
  return (
    <div className="bg-cream-100 min-h-screen py-10 px-6 lg:px-12 animate-fadeIn">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="flex items-baseline gap-3 mb-8">
          <h1 className="font-serif-display font-bold text-3xl text-stone-900 italic">My Wishlist</h1>
          <span className="text-sm text-stone-400">({wishlist.length} items)</span>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-4xl shadow-card p-16 text-center">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-9 h-9 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
              </svg>
            </div>
            <p className="text-stone-500 font-medium mb-6">Your wishlist is empty</p>
            <button
              onClick={onBack}
              className="bg-stone-900 text-white px-8 py-3 rounded-2xl text-sm font-semibold hover:bg-brand transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-4xl shadow-card overflow-hidden divide-y divide-stone-50">
            {wishlist.map((item, i) => (
              <div key={item._id || item.id || i} className="flex items-center gap-5 p-5 hover:bg-cream-100 transition-colors">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-200 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-stone-800 truncate">{item.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5">{item.category}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <p className="text-sm font-bold text-stone-900">₹{item.price?.toLocaleString()}</p>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <p className="text-xs text-stone-400 line-through">₹{item.originalPrice?.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => onAddToCart(item)}
                    className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-brand transition-colors whitespace-nowrap"
                  >
                    Add to Bag
                  </button>
                  <button
                    onClick={() => onRemoveWishlist(item)}
                    className="border border-red-200 text-red-400 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors whitespace-nowrap"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserWishlist;
