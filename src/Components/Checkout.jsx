import React, { useState } from "react";

const Checkout = ({ cartItems, onPlaceOrder, onBack, addresses }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  return (
    <div className="bg-cream-100 min-h-screen py-10 px-6 lg:px-12 animate-fadeIn">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={step === 1 ? onBack : () => setStep(1)}
          className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {step === 1 ? "Back to Cart" : "Change Address"}
        </button>

        {/* Steps indicator */}
        <div className="flex items-center gap-3 mb-10">
          {["Shipping Info", "Payment"].map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i ? "bg-brand text-white" : step === i + 1 ? "bg-stone-900 text-white" : "bg-stone-200 text-stone-400"
                }`}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span className={`text-sm font-medium ${step === i + 1 ? "text-stone-900" : "text-stone-400"}`}>{s}</span>
              </div>
              {i < 1 && <div className={`flex-1 h-px max-w-16 ${step > 1 ? "bg-brand" : "bg-stone-200"}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — Main Form */}
          <div className="lg:col-span-2">

            {step === 1 ? (
              <div className="bg-white rounded-4xl shadow-card p-8 animate-fadeIn">
                <h2 className="font-serif-display font-bold text-2xl text-stone-900 italic mb-6">Delivery Address</h2>

                {/* Saved addresses */}
                {addresses && addresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {addresses.map((addr, i) => (
                      <div
                        key={i}
                        onClick={() => setFormData({ name: addr.name, address: `${addr.area}, ${addr.city} - ${addr.pincode}`, phone: formData.phone })}
                        className="border-2 border-stone-100 hover:border-brand rounded-2xl p-4 cursor-pointer transition-all"
                      >
                        <p className="text-xs font-semibold text-brand mb-1">Saved Address</p>
                        <p className="text-sm font-medium text-stone-700">{addr.name}</p>
                        <p className="text-xs text-stone-400">{addr.city}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleNext} className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 block">Full Name</label>
                    <input
                      required
                      placeholder="e.g. Rohit Parmar"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-cream-100 border-2 border-transparent focus:border-brand rounded-2xl px-5 py-3.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 block">Full Address</label>
                    <textarea
                      required
                      placeholder="House no, Street, Landmark, City..."
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-cream-100 border-2 border-transparent focus:border-brand rounded-2xl px-5 py-3.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all h-28 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 block">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-cream-100 border-2 border-transparent focus:border-brand rounded-2xl px-5 py-3.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-semibold hover:bg-brand transition-all shadow-btn mt-2"
                  >
                    Continue to Payment →
                  </button>
                </form>
              </div>

            ) : (
              <div className="bg-white rounded-4xl shadow-card p-8 animate-fadeIn">
                <h2 className="font-serif-display font-bold text-2xl text-stone-900 italic mb-6">Payment Method</h2>

                {/* Payment options */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: "COD",    icon: "🚚", label: "Cash on Delivery" },
                    { id: "Online", icon: "📱", label: "UPI / QR"          },
                    { id: "Card",   icon: "💳", label: "Card"              },
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPaymentMethod(p.id)}
                      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                        paymentMethod === p.id
                          ? "border-stone-900 bg-stone-50"
                          : "border-stone-100 hover:border-stone-300"
                      }`}
                    >
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-xs font-semibold text-stone-700 text-center leading-tight">{p.label}</span>
                    </button>
                  ))}
                </div>

                {/* UPI QR */}
                {paymentMethod === "Online" && (
                  <div className="bg-cream-100 rounded-3xl p-6 text-center border border-stone-200 mb-6 animate-fadeIn">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-4">Scan to Pay</p>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=ramenterprise@bank&am=${total}&tn=RAM_SHOP`}
                      alt="UPI QR"
                      className="mx-auto w-44 h-44 rounded-2xl shadow-card border-4 border-white"
                    />
                    <p className="text-xs text-stone-400 mt-4">Works with PhonePe, GPay, Paytm &amp; all UPI apps</p>
                  </div>
                )}

                {/* Card form */}
                {paymentMethod === "Card" && (
                  <div className="bg-cream-100 rounded-3xl p-6 border border-stone-200 mb-6 space-y-4 animate-fadeIn">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-2">Card Details</p>
                    <input type="text" placeholder="Card Number (XXXX XXXX XXXX XXXX)" className="w-full bg-white border-2 border-stone-200 focus:border-brand rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM / YY" className="bg-white border-2 border-stone-200 focus:border-brand rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                      <input type="password" placeholder="CVV" className="bg-white border-2 border-stone-200 focus:border-brand rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                    </div>
                    <input type="text" placeholder="Cardholder Name" className="w-full bg-white border-2 border-stone-200 focus:border-brand rounded-xl px-4 py-3 text-sm outline-none transition-all" />
                  </div>
                )}

                {/* Delivery summary */}
                <div className="bg-cream-100 rounded-2xl px-5 py-4 border border-stone-200 mb-6">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Delivering to</p>
                  <p className="text-sm font-semibold text-stone-800">{formData.name} · {formData.phone}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{formData.address}</p>
                </div>

                <button
                  onClick={() => onPlaceOrder(paymentMethod)}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl text-sm font-semibold hover:bg-brand transition-all shadow-btn"
                >
                  Confirm Order · ₹{total.toLocaleString()}
                </button>
              </div>
            )}
          </div>

          {/* Right — Order Summary */}
          <div>
            <div className="bg-white rounded-4xl shadow-card p-6 sticky top-28">
              <h3 className="font-semibold text-stone-900 text-sm mb-5">Order Summary</h3>
              <div className="space-y-4 mb-5 max-h-64 overflow-y-auto pr-1">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-cream-200 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-800 truncate">{item.name}</p>
                      <p className="text-xs text-stone-400">{item.category}</p>
                    </div>
                    <p className="text-sm font-bold text-stone-900 flex-shrink-0">₹{item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-700">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Delivery</span>
                  <span className="font-semibold text-brand">Free</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
