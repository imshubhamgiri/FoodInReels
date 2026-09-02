import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  UtensilsCrossed, 
  CheckCircle2, 
  AlertTriangle,
  Bike
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Badge } from '../ui/Badge';

export const CartDrawer = () => {
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
    isCartOpen,
    showConflictModal,
    pendingItem,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromo,
    removePromo,
    confirmReplaceCart,
    cancelReplaceCart
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyPromo(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleCheckoutNavigation = () => {
    closeCart();
    navigate('/checkout');
  };

  const progressPercent = Math.min(100, Math.round((subtotal / deliveryThreshold) * 100));

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeCart}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
              aria-label="Close cart drawer backdrop"
            />

            {/* Slide-over Drawer Panel */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-md bg-white dark:bg-[#121217] text-slate-900 dark:text-slate-100 shadow-2xl border-l border-slate-200 dark:border-white/10 flex flex-col justify-between select-none"
              >
                {/* 1. Header */}
                <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50/70 dark:bg-[#18181F]/80 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF462D] to-[#FF6B4A] flex items-center justify-center text-white shadow-md shadow-[#FF462D]/30">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Your Cart</span>
                        {itemCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-[#FF462D]/15 text-[#FF462D]">
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </h2>
                      {activePartner && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <UtensilsCrossed className="w-3 h-3 text-[#FF462D]" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[220px]">
                            {activePartner.name}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {items.length > 0 && (
                      <button
                        onClick={clearCart}
                        title="Clear cart"
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={closeCart}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                      aria-label="Close cart drawer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 2. Free Delivery Milestone Bar (If cart has items) */}
                {items.length > 0 && (
                  <div className="px-4 py-2.5 bg-amber-500/10 dark:bg-[#FFB703]/10 border-b border-amber-500/20 dark:border-[#FFB703]/20 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-medium text-amber-800 dark:text-[#FFB703]">
                        <Bike className="w-3.5 h-3.5" />
                        {amountNeededForFreeDelivery === 0 ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Free delivery unlocked!
                          </span>
                        ) : (
                          <span>
                            Add <strong className="font-bold">₹{amountNeededForFreeDelivery}</strong> more for <strong>FREE Delivery</strong>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        ₹{subtotal} / ₹{deliveryThreshold}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
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
                )}

                {/* 3. Main Body: Empty State OR Scrollable Items */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
                  {items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-[#18181F] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                        <ShoppingBag className="w-10 h-10 stroke-1 text-[#FF462D]/70" />
                      </div>
                      <h3 className="text-lg font-bold font-heading text-slate-800 dark:text-white mb-1">
                        Your cart is empty
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                        Good food is always waiting for you. Explore our chef specials or watch reels to find your next meal!
                      </p>
                      <button
                        onClick={() => {
                          closeCart();
                          navigate('/');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF462D]/30 hover:shadow-lg hover:shadow-[#FF462D]/40 transition-all cursor-pointer"
                      >
                        Explore Trending Dishes
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#18181F] border border-slate-200/80 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15 transition-all shadow-xs"
                        >
                          {/* Dish Thumbnail */}
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-200 dark:bg-black shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-1 left-1">
                              <Badge variant={item.isVeg ? 'veg' : 'nonveg'} />
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              ₹{item.price} each
                            </p>
                            <span className="text-xs sm:text-sm font-extrabold text-[#FF462D] mt-1 inline-block">
                              ₹{Number(item.price) * Number(item.quantity)}
                            </span>
                          </div>

                          {/* Stepper & Delete */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex items-center rounded-xl bg-slate-200/70 dark:bg-black/40 border border-slate-300 dark:border-white/10 p-0.5">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#FF462D] dark:hover:bg-[#FF462D] flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="min-w-6 text-center text-xs font-bold text-slate-800 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#FF462D] dark:hover:bg-[#FF462D] flex items-center justify-center transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Promo Coupons Section */}
                      <div className="pt-3 pb-1">
                        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                          <Tag className="w-3.5 h-3.5 text-[#FF462D]" />
                          <span>Offers & Coupons</span>
                        </div>

                        {promoCode ? (
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <div>
                                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                                  {promoCode} Applied
                                </span>
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                                  You save ₹{discountAmount}!
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
                              value={couponInput}
                              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                              placeholder="Enter coupon (e.g. TASTY50)"
                              className="flex-1 bg-slate-100 dark:bg-[#18181F] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]/60 uppercase font-mono"
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-white/10 hover:bg-[#FF462D] dark:hover:bg-[#FF462D] text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Apply
                            </button>
                          </form>
                        )}

                        {/* Quick Coupon Chips */}
                        {!promoCode && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {Object.entries(availableCoupons).map(([code, coupon]) => (
                              <button
                                key={code}
                                type="button"
                                onClick={() => applyPromo(code)}
                                className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-white/5 hover:bg-[#FF462D]/10 hover:text-[#FF462D] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
                              >
                                {code} ({coupon.flatDiscount ? `₹${coupon.flatDiscount} OFF` : `${coupon.discountPercent}% OFF`})
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Footer & Bill Summary (Only if items exist) */}
                {items.length > 0 && (
                  <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#18181F]/80 backdrop-blur-md space-y-3">
                    {/* Bill Breakdown */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Item Subtotal</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">₹{subtotal}</span>
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
                          <span>Platform Fee</span>
                          <span>₹{platformFee}</span>
                        </div>
                      )}

                      {discountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                          <span>Coupon / Tier Discount</span>
                          <span>- ₹{discountAmount}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-baseline text-sm sm:text-base">
                        <span className="font-bold font-heading text-slate-900 dark:text-white">To Pay</span>
                        <span className="font-black text-slate-900 dark:text-white text-lg sm:text-xl">
                          ₹{finalTotal}
                        </span>
                      </div>
                    </div>

                    {/* Checkout CTA */}
                    <button
                      onClick={handleCheckoutNavigation}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] hover:from-[#E03E26] hover:to-[#FF462D] text-white font-bold text-sm shadow-lg shadow-[#FF462D]/30 hover:shadow-[#FF462D]/40 transition-all flex items-center justify-between cursor-pointer active:scale-98"
                    >
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-[11px] font-medium text-white/80">{itemCount} items</span>
                        <span className="font-bold">₹{finalTotal}</span>
                      </div>
                      <div className="flex items-center gap-1 font-heading text-xs sm:text-sm">
                        <span>Proceed to Checkout</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                )}
              </motion.aside>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Restaurant Conflict Confirmation Dialog */}
      <AnimatePresence>
        {showConflictModal && pendingItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelReplaceCart}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-sm rounded-2xl bg-white dark:bg-[#18181F] p-6 shadow-2xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-heading mb-2 text-slate-900 dark:text-white">
                Replace items already in cart?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
                Your cart currently contains dishes from <strong className="text-slate-900 dark:text-white">{activePartner?.name}</strong>. Adding this item from <strong className="text-[#FF462D]">{pendingItem.product?.restaurant || pendingItem.product?.restaurantName || 'another restaurant'}</strong> will clear your current cart.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={cancelReplaceCart}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-white/15 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReplaceCart}
                  className="flex-1 py-2 px-3 rounded-xl bg-[#FF462D] hover:bg-[#E03E26] text-xs font-bold text-white shadow-md transition-colors cursor-pointer"
                >
                  Discard & Add
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartDrawer;

