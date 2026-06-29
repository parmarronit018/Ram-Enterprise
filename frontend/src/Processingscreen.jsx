import React from "react";

function ProcessingScreen() {
  return (
    <div className="bg-cream-100 min-h-screen flex flex-col items-center justify-center px-6">
      <div className="bg-white rounded-4xl shadow-card-lg p-12 max-w-sm w-full text-center">

        {/* Spinner */}
        <div className="relative mx-auto mb-8 w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-stone-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-stone-900 animate-spin"></div>
          <div className="absolute inset-3 bg-cream-200 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        <h2 className="font-serif-display font-bold text-2xl text-stone-900 italic mb-2">
          Processing Order
        </h2>
        <p className="text-stone-400 text-sm">
          Please wait while we confirm your order...
        </p>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProcessingScreen;
