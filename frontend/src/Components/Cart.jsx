import React from "react";

const Cart = ({ cartItems, onBack, onRemove, onCheckout }) => {
  const total = cartItems.reduce((acc, item) => {
    const price = typeof item.price === "string"
      ? parseFloat(item.price.replace(/,/g, ""))
      : item.price;
    return acc + price;
  }, 0);

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
          Continue Shopping
        </button>

        <div className="flex items-baseline gap-3 mb-8">
          <h1 className="font-serif-display font-bold text-3xl text-stone-900 italic">Your Bag</h1>
          <span className="text-sm text-stone-400 font-medium">({cartItems.length} items)</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-4xl p-16 text-center shadow-card">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-stone-500 font-medium mb-6">Your bag is empty</p>
            <button
              onClick={onBack}
              className="bg-stone-900 text-white px-8 py-3 rounded-2xl text-sm font-semibold hover:bg-brand transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Items */}
            <div className="bg-white rounded-4xl shadow-card overflow-hidden divide-y divide-stone-50">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 hover:bg-cream-100 transition-colors">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-stone-800 leading-snug truncate">{item.name}</h3>
                    <p className="text-xs text-stone-400 mt-0.5">{item.category}</p>
                    <p className="text-sm font-bold text-stone-900 mt-1.5">₹{item.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item._id)}
                    className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors flex-shrink-0"
                    aria-label="Remove"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-4xl shadow-card p-6">
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium text-stone-800">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Delivery</span>
                  <span className="text-brand font-semibold">Free</span>
                </div>
                <div className="border-t border-stone-100 pt-3 flex justify-between">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="font-bold text-xl text-stone-900">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-semibold hover:bg-brand transition-all shadow-btn"
              >
                Proceed to Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
