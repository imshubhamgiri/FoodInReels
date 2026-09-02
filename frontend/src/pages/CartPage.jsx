import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  UtensilsCrossed, 
  ShieldCheck, 
  Bike,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Badge } from '../components/ui/Badge';
import Navbar from '../components/landing/Navbar';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    deliveryThreshold,
    amountNeededForFreeDelivery,
    discountAmount,
    platformFee,
    finalTotal,
    activePartner,
    promoCode,
    availableCoupons,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromo,
    removePromo
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyPromo(couponCode.trim());
      setCouponCode('');
    }
  };

  const progressPercent = Math.min(100, Math.round((subtotal / deliveryThreshold) * 100));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0D0D11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Navigation Breadcrumb / Top Row */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#FF462D] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
            Shopping Cart
          </h1>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:underline font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#18181F] rounded-3xl border border-slate-200 dark:border-white/10 p-8 sm:p-14 text-center max-w-lg mx-auto shadow-sm dark:shadow-2xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 text-[#FF462D] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
              Explore mouthwatering dishes from top-tier kitchens, watch reels, and fill up your cart with fresh flavors!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF462D]/30 hover:shadow-lg hover:shadow-[#FF462D]/40 transition-all text-center cursor-pointer"
              >
                Browse Trending Dishes
              </Link>
              <Link
                to="/reel"
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors text-center cursor-pointer"
              >
                Watch Food Reels
              </Link>
            </div>
          </motion.div>
        ) : (
          /* 2-Column Responsive Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Restaurant banner & Cart Items (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Active Restaurant Banner */}
              {activePartner && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#18181F] border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF462D]/20 to-[#FFB703]/20 border border-[#FF462D]/30 flex items-center justify-center text-[#FF462D]">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {activePartner.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your order
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/"
                    className="text-xs font-bold text-[#FF462D] hover:underline"
                  >
                    + Add More
                  </Link>
                </div>
              )}

              {/* Items Card List */}
              <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-white/10 font-heading font-bold text-sm text-slate-800 dark:text-slate-200">
                  Order Items
                </div>
                <div className="divide-y divide-slate-100 dark:divide-white/5">
                  {items.map((item) => (
                    <div key={item._id} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                      {/* Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 dark:bg-black shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-1 left-1">
                          <Badge variant={item.isVeg ? 'veg' : 'nonveg'} />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          ₹{item.price} each
                        </p>
                        <p className="text-sm font-extrabold text-[#FF462D] mt-1.5">
                          ₹{Number(item.price) * Number(item.quantity)}
                        </p>
                      </div>

                      {/* Stepper & Trash */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-0.5">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#FF462D] dark:hover:bg-[#FF462D] flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="min-w-7 text-center text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#FF462D] dark:hover:bg-[#FF462D] flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking / Delivery Instructions Note */}
              <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-xs">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                  <FileText className="w-3.5 h-3.5 text-[#FF462D]" />
                  <span>Special Cooking or Delivery Instructions</span>
                </label>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder="e.g. Less spicy, extra sauce, call upon arrival..."
                  rows={2}
                  className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]/60 resize-none transition-colors"
                />
              </div>

            </div>

            {/* Right Column: Free Delivery milestone, Coupons, Bill summary (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              
              {/* Free Delivery Tracker Card */}
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-[#FFB703]/10 border border-amber-500/20 dark:border-[#FFB703]/20">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-[#FFB703]">
                    <Bike className="w-4 h-4" />
                    {amountNeededForFreeDelivery === 0 ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> FREE Delivery Unlocked!
                      </span>
                    ) : (
                      <span>
                        Add <strong>₹{amountNeededForFreeDelivery}</strong> more for <strong>FREE Delivery</strong>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    ₹{subtotal} / ₹{deliveryThreshold}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      amountNeededForFreeDelivery === 0 
                        ? 'bg-emerald-500' 
                        : 'bg-gradient-to-r from-[#FF462D] to-[#FFB703]'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Coupons & Offers */}
              <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 p-4 sm:p-5 shadow-xs">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5 mb-3">
                  <Tag className="w-4 h-4 text-[#FF462D]" />
                  <span>Coupons & Savings</span>
                </h3>

                {promoCode ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                          {promoCode} Applied!
                        </span>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          You save ₹{discountAmount} on this order.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code (e.g. TASTY50)"
                      className="flex-1 bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-mono uppercase text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]/60"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-[#FF462D] dark:hover:bg-[#FF462D] text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Available Coupon Chips */}
                {!promoCode && (
                  <div className="mt-3 space-y-1.5">
                    {Object.entries(availableCoupons).map(([code, coupon]) => (
                      <div
                        key={code}
                        onClick={() => applyPromo(code)}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-[#FF462D]/40 flex items-center justify-between cursor-pointer transition-all group"
                      >
                        <div>
                          <span className="text-xs font-extrabold text-[#FF462D] font-mono">{code}</span>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{coupon.description}</p>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:text-[#FF462D]">
                          Apply
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bill Summary */}
              <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white mb-2">
                  Bill Summary
                </h3>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Item Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-200">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">FREE</span>
                      ) : (
                        `₹${deliveryFee}`
                      )}
                    </span>
                  </div>

                  {platformFee > 0 && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Platform & Tech Fee</span>
                      <span>₹{platformFee}</span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount Savings</span>
                      <span>- ₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex justify-between items-baseline">
                    <span className="font-bold font-heading text-slate-900 dark:text-white text-sm sm:text-base">
                      Total Payable
                    </span>
                    <span className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white">
                      ₹{finalTotal}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] hover:from-[#E03E26] hover:to-[#FF462D] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#FF462D]/30 hover:shadow-[#FF462D]/40 transition-all flex items-center justify-between cursor-pointer active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Safety / Hygiene Badge */}
                <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Safe & Contactless Delivery guaranteed</span>
                </div>
              </div>

            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;

