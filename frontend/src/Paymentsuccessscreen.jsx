import React from "react";

function PaymentSuccessScreen({ onGoHome }) {
  return (
    <div className="bg-cream-100 min-h-screen flex flex-col items-center justify-center px-6 animate-fadeIn">
      <div className="bg-white rounded-4xl shadow-card-lg p-12 max-w-md w-full text-center">

        {/* Success Icon */}
        <div className="relative mx-auto mb-8 w-24 h-24">
          <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30"></div>
          <div className="relative w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h1 className="font-serif-display font-bold text-3xl text-stone-900 italic mb-2">
          Order Placed!
        </h1>
        <p className="text-stone-500 text-sm mb-2">
          Thank you for shopping with Ram Enterprise.
        </p>
        <p className="text-stone-400 text-xs mb-8">
          You'll receive a confirmation shortly.
        </p>

        {/* Order info chips */}
        <div className="flex justify-center gap-3 mb-8">
          <span className="bg-green-50 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
            ✓ Confirmed
          </span>
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-2 rounded-full">
            🚚 Delivery in 3–5 days
          </span>
        </div>

        <button
          onClick={onGoHome}
          className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-semibold hover:bg-brand transition-all shadow-btn"
        >
          Continue Shopping →
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccessScreen;
