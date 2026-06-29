import React, { useState, useEffect } from "react";
import { fetchUserOrders } from "../firebaseUtils";

function UserOrders({ orders = [], onBack, onShop, user }) {
  const [firebaseOrders, setFirebaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        try {
          const fbOrders = await fetchUserOrders(user);
          setFirebaseOrders(fbOrders);
        } catch (error) {
          console.error("Error loading orders:", error);
        }
      }
      setLoading(false);
    };
    loadOrders();
  }, [user]);

  // Combine Firebase + localStorage orders
  const allOrders = [...firebaseOrders, ...orders];

  if (loading) {
    return (
      <div className="bg-cream-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="font-serif-display font-bold text-3xl text-stone-900 italic">My Orders</h1>
          <span className="text-sm text-stone-400">({allOrders.length} orders)</span>
        </div>

        {allOrders.length === 0 ? (
          <div className="bg-white rounded-4xl shadow-card p-16 text-center">
            <div className="w-20 h-20 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-9 h-9 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-stone-500 font-medium mb-6">No orders yet</p>
            <button
              onClick={onShop}
              className="bg-stone-900 text-white px-8 py-3 rounded-2xl text-sm font-semibold hover:bg-brand transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {allOrders.map((order, i) => (
              <div key={order.id || i} className="bg-white rounded-3xl shadow-card p-6">
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100">
                  <div>
                    <p className="text-xs text-stone-400 font-medium">Order ID</p>
                    <p className="text-sm font-bold text-stone-900">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium">Date</p>
                    <p className="text-sm font-semibold text-stone-700">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-medium">Payment</p>
                    <p className="text-sm font-semibold text-stone-700">{order.paymentMethod}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    ✓ {order.status || "Confirmed"}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {order.items?.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{item.name}</p>
                        <p className="text-xs text-stone-400">{item.category}</p>
                      </div>
                      <p className="text-sm font-bold text-stone-900">₹{item.price?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                  <span className="text-sm text-stone-500 font-medium">Order Total</span>
                  <span className="text-base font-bold text-stone-900">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrders;
