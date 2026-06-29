import React, { useRef } from "react";

const CATEGORY_STYLES = {
  Fashion:     { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200", dot: "bg-amber-400"   },
  Electronics: { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",  dot: "bg-blue-400"    },
  Gaming:      { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200",dot: "bg-purple-400"  },
  Home:        { bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200", dot: "bg-green-400"   },
};

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-3 h-3 ${i <= full ? "text-amber-400" : "text-stone-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.372 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118L10 14.347l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.644 9.384c-.784-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
        </svg>
      ))}
      <span className="text-[10px] text-stone-400 ml-1 font-medium">{rating}</span>
    </span>
  );
};

const ProductCard = ({ product, onClick, onAddToCart, onBuyNow }) => {
  const cardRef = useRef(null);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const catStyle = CATEGORY_STYLES[product.category] || {
    bg: "bg-stone-100", text: "text-stone-600", border: "border-stone-200", dot: "bg-stone-400",
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
  };
  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  };

  return (
    <div
      ref={cardRef}
      className="tilt-card bg-white rounded-3xl overflow-hidden shadow-card flex flex-col h-full group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Image ── */}
      <div
        className="relative h-48 zoom-wrap bg-cream-200 cursor-pointer flex-shrink-0"
        onClick={() => onClick(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-full shadow-md">
            -{discount}%
          </span>
        )}

        {/* category badge */}
        <span className={`absolute top-3 right-3 ${catStyle.bg} ${catStyle.text} border ${catStyle.border} text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
          {product.category}
        </span>

        {/* quick view on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            Quick View
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-4 flex flex-col flex-grow">
        <button onClick={() => onClick(product)} className="text-left">
          <h3 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2 hover:text-brand transition-colors duration-200">
            {product.name}
          </h3>
        </button>

        <p className="text-[10px] text-stone-400 font-medium mt-1 mb-2 uppercase tracking-wide">{product.brand}</p>

        {product.rating && <StarRating rating={product.rating} />}

        <div className="mt-auto pt-3 border-t border-stone-50">
          {/* price */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-extrabold text-stone-900">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* savings */}
          {discount > 0 && (
            <p className="text-[10px] font-bold text-green-600 mb-3 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              You save ₹{(product.originalPrice - product.price).toLocaleString()}
            </p>
          )}

          {/* buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="ripple bg-cream-200 text-stone-700 py-2.5 rounded-xl text-[10px] font-bold hover:bg-stone-900 hover:text-white transition-all duration-200 border border-stone-100"
            >
              Add to Bag
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
              className="ripple bg-stone-900 text-white py-2.5 rounded-xl text-[10px] font-bold hover:bg-brand transition-all duration-200 shadow-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
