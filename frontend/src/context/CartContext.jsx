import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

const CART_STORAGE_KEY = 'foodinreels_cart_v1';
const PROMO_STORAGE_KEY = 'foodinreels_promo_v1';

// Supported promo coupons
const AVAILABLE_COUPONS = {
  'TASTY50': { discountPercent: 0, flatDiscount: 50, minOrder: 199, description: '₹50 flat off on orders above ₹199' },
  'WELCOME': { discountPercent: 20, flatDiscount: 0, maxDiscount: 100, minOrder: 149, description: '20% off up to ₹100 for newcomers' },
  'FEAST100': { discountPercent: 0, flatDiscount: 100, minOrder: 499, description: '₹100 flat off on orders above ₹499' }
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Load initial cart items from localStorage
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load cart from storage:', e);
      return [];
    }
  });

  // Load promo code from localStorage
  const [promoCode, setPromoCode] = useState(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  // Slide-over drawer visibility
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Restaurant conflict dialog state
  const [pendingItem, setPendingItem] = useState(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to storage:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (promoCode) {
        localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch {}
  }, [promoCode]);

  // Derived active restaurant info
  const activePartner = useMemo(() => {
    if (items.length === 0) return null;
    const firstWithPartner = items.find(i => i.foodPartner?.restaurantName || i.restaurant);
    if (!firstWithPartner) return null;
    return {
      _id: firstWithPartner.foodPartner?._id || firstWithPartner.partnerId || 'default-partner',
      name: firstWithPartner.foodPartner?.restaurantName || firstWithPartner.restaurant || firstWithPartner.partnerName || 'Artisan Kitchen'
    };
  }, [items]);

  // Calculations
  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + (price * qty);
    }, 0);
  }, [items]);

  // Delivery fee rules: Free over ₹399, otherwise ₹35
  const deliveryThreshold = 399;
  const deliveryFee = subtotal === 0 || subtotal >= deliveryThreshold ? 0 : 35;
  const amountNeededForFreeDelivery = Math.max(0, deliveryThreshold - subtotal);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!promoCode || !AVAILABLE_COUPONS[promoCode.toUpperCase()]) {
      // Default tier discount if order is large
      if (subtotal >= 499) return 40;
      return 0;
    }

    const coupon = AVAILABLE_COUPONS[promoCode.toUpperCase()];
    if (subtotal < coupon.minOrder) {
      return 0;
    }

    if (coupon.flatDiscount) {
      return Math.min(subtotal, coupon.flatDiscount);
    }

    if (coupon.discountPercent) {
      const calculated = (subtotal * coupon.discountPercent) / 100;
      return coupon.maxDiscount ? Math.min(calculated, coupon.maxDiscount) : calculated;
    }

    return 0;
  }, [subtotal, promoCode]);

  // Taxes & packing fee (modest platform fee)
  const platformFee = items.length > 0 ? 5 : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee + platformFee - discountAmount);

  // Helper to normalize item object
  const normalizeItem = (product, quantity = 1) => {
    const rawId = product._id || product.id;
    const partnerId = product.foodPartner?._id || product.partnerId;
    const partnerName = product.restaurant || product.restaurantName || product.foodPartner?.restaurantName || product.foodPartner?.name || 'Restaurant';

    return {
      _id: String(rawId),
      id: String(rawId),
      name: product.name || 'Gourmet Dish',
      price: Number(product.price) || 0,
      image: product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      description: product.description || '',
      isVeg: Boolean(product.isVeg),
      quantity: Math.max(1, quantity),
      foodPartner: {
        _id: partnerId ? String(partnerId) : undefined,
        restaurantName: partnerName
      },
      partnerId: partnerId ? String(partnerId) : undefined,
      partnerName: partnerName
    };
  };

  // Add to cart with restaurant conflict handling
  const addToCart = (product, quantity = 1, forceReplace = false) => {
    const normalized = normalizeItem(product, quantity);

    // Check restaurant compatibility if cart already has items
    if (items.length > 0 && !forceReplace) {
      const currentPartnerName = activePartner?.name;
      const newPartnerName = normalized.partnerName;

      // If restaurant names or partner IDs differ significantly
      if (currentPartnerName && newPartnerName && currentPartnerName !== newPartnerName && currentPartnerName !== 'Restaurant' && newPartnerName !== 'Restaurant') {
        setPendingItem({ product, quantity });
        setShowConflictModal(true);
        return;
      }
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => String(item._id) === String(normalized._id));

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + normalized.quantity
        };
        toast.info(`Updated quantity for "${normalized.name}" (${updated[existingIndex].quantity})`);
        return updated;
      } else {
        toast.success(`Added "${normalized.name}" to cart!`);
        return [...prevItems, normalized];
      }
    });
  };

  // Confirm replacing cart with new restaurant's item
  const confirmReplaceCart = () => {
    if (pendingItem) {
      const normalized = normalizeItem(pendingItem.product, pendingItem.quantity);
      setItems([normalized]);
      setPendingItem(null);
      setShowConflictModal(false);
      toast.success(`Cart updated with item from ${normalized.partnerName}!`);
    }
  };

  const cancelReplaceCart = () => {
    setPendingItem(null);
    setShowConflictModal(false);
  };

  // Remove item from cart
  const removeFromCart = (foodId) => {
    setItems((prev) => {
      const target = prev.find(i => String(i._id) === String(foodId));
      if (target) {
        toast.info(`Removed "${target.name}" from cart.`);
      }
      return prev.filter((i) => String(i._id) !== String(foodId));
    });
  };

  // Update quantity directly
  const updateQuantity = (foodId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(foodId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        String(item._id) === String(foodId)
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  // Clear all items
  const clearCart = () => {
    setItems([]);
    setPromoCode('');
  };

  // Query item quantity
  const getItemQuantity = (foodId) => {
    const item = items.find((i) => String(i._id) === String(foodId));
    return item ? item.quantity : 0;
  };

  // Promo code operations
  const applyPromo = (code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      toast.error('Please enter a coupon code.');
      return false;
    }

    const coupon = AVAILABLE_COUPONS[cleanCode];
    if (!coupon) {
      toast.error('Invalid coupon code. Try TASTY50, WELCOME, or FEAST100.');
      return false;
    }

    if (subtotal < coupon.minOrder) {
      toast.warning(`Minimum order amount of ₹${coupon.minOrder} required for ${cleanCode}.`);
      return false;
    }

    setPromoCode(cleanCode);
    toast.success(`Coupon ${cleanCode} applied successfully!`);
    return true;
  };

  const removePromo = () => {
    setPromoCode('');
    toast.info('Coupon removed.');
  };

  // Drawer handlers
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const value = {
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
    availableCoupons: AVAILABLE_COUPONS,
    isCartOpen,
    showConflictModal,
    pendingItem,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    applyPromo,
    removePromo,
    openCart,
    closeCart,
    toggleCart,
    setIsCartOpen,
    confirmReplaceCart,
    cancelReplaceCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

