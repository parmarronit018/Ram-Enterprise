import React from "react";

const ProductDetail = ({ product, onBack, onAddToCart, onBuyNow, onWishlist, isWishlisted }) => {
  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-cream-100 min-h-screen py-10 px-6 lg:px-12 animate-fadeIn">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to shop
        </button>

        <div className="bg-white rounded-4xl shadow-card-lg overflow-hidden grid grid-cols-1 lg:grid-cols-2">

          {/* Image */}
          <div className="relative bg-cream-200 flex items-center justify-center p-10 min-h-[380px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[450px] object-contain rounded-3xl hover:scale-105 transition-transform duration-500"
            />
            {discount > 0 && (
              <span className="absolute top-6 left-6 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-10 lg:p-14 flex flex-col justify-center">
            <span className="text-brand text-xs font-semibold tracking-widest uppercase mb-3">
              {product.category}
            </span>

            <h1 className="font-serif-display font-bold text-3xl lg:text-4xl text-stone-900 italic leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-stone-500 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-4 h-4 ${i <= Math.round(product.rating) ? "text-amber-400" : "text-stone-200"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.372 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.644 9.384c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-stone-500 font-medium">{product.rating} / 5</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <span className="text-sm font-semibold text-brand">Save ₹{(product.originalPrice - product.price).toLocaleString()}</span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 border-2 border-stone-900 text-stone-900 py-4 rounded-2xl text-sm font-semibold hover:bg-stone-900 hover:text-white transition-all"
              >
                Add to Bag
              </button>
              <button
                onClick={() => onBuyNow(product)}
                className="flex-1 bg-stone-900 text-white py-4 rounded-2xl text-sm font-semibold hover:bg-brand transition-all shadow-btn"
              >
                Buy Now
              </button>
              <button
                onClick={() => onWishlist && onWishlist(product)}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${isWishlisted ? "bg-red-50 border-red-300 text-red-500" : "border-stone-200 text-stone-400 hover:border-red-300 hover:text-red-400"}`}
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="border-t border-stone-100 pt-6 grid grid-cols-3 gap-4">
              {[
                { icon: "🚚", label: "Free Delivery" },
                { icon: "🔒", label: "Secure Payment" },
                { icon: "✅", label: "Quality Assured" },
              ].map(b => (
                <div key={b.label} className="text-center">
                  <span className="text-xl">{b.icon}</span>
                  <p className="text-[10px] font-medium text-stone-400 mt-1 uppercase tracking-wide">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
