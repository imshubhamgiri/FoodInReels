import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  UtensilsCrossed, 
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Home,
  Briefcase,
  Navigation,
  Loader2
} from 'lucide-react';
import { orderAPI, profileAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useAppContext } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { Badge } from '../components/ui/Badge';
import Navbar from '../components/landing/Navbar';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR'
];

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppContext();
  const { 
    items: cartItems, 
    subtotal: cartSubtotal, 
    discountAmount: cartDiscount, 
    clearCart 
  } = useCart();

  // Direct single food order from Reel or Dish Card (via location.state?.food)
  const directFood = location.state?.food;
  const [directQuantity, setDirectQuantity] = useState(1);

  // Address states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'
  const [upiId, setUpiId] = useState('');

  // Order execution states
  const [placeOrderLoading, setPlaceOrderLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Inline address form state
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    postalCode: '',
    locality: '',
    address: '',
    city: '',
    state: 'Delhi NCR',
    landmark: '',
    label: 'Home',
  });

  // Determine items being ordered
  const checkoutItems = useMemo(() => {
    if (directFood) {
      const partnerId = directFood.partnerId || directFood.foodPartner?._id || '65f000000000000000000001';
      const partnerName = directFood.partnerName || directFood.foodPartner?.restaurantName || 'Artisan Kitchen';
      return [{
        _id: String(directFood._id || '65f000000000000000000002'),
        name: directFood.name || 'Gourmet Dish',
        price: Number(directFood.price) || 199,
        quantity: directQuantity,
        image: directFood.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        description: directFood.description || '',
        isVeg: Boolean(directFood.isVeg),
        partnerId: String(partnerId),
        partnerName: partnerName
      }];
    }
    return cartItems;
  }, [directFood, directQuantity, cartItems]);

  // Fetch addresses on mount
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await profileAPI.getAddress();
      const list = response.data || [];
      setAddresses(list);

      if (list.length > 0) {
        // Auto-select default or first address
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr._id);
        setShowAddressForm(false);
      } else {
        // Prompt address creation immediately if none exist
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error('Failed to load user addresses:', error);
      setShowAddressForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Compute pricing
  const itemTotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  }, [checkoutItems]);

  const deliveryFee = itemTotal === 0 || itemTotal > 399 ? 0 : 35;
  const discount = directFood ? (itemTotal > 499 ? 40 : 0) : cartDiscount;
  const platformFee = checkoutItems.length > 0 ? 5 : 0;
  const finalTotal = Math.max(0, itemTotal + deliveryFee + platformFee - discount);

  const selectedAddress = useMemo(() => {
    return addresses.find((addr) => addr._id === selectedAddressId);
  }, [addresses, selectedAddressId]);

  // Handle saving new address inline
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    // Client-side validations matching backend schema
    const payload = {
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      postalCode: addressForm.postalCode.trim(),
      locality: addressForm.locality.trim(),
      address: addressForm.address.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      country: 'India',
      landmark: addressForm.landmark.trim() || undefined,
      label: addressForm.label || 'Home',
    };

    if (!payload.fullName || payload.fullName.length < 2) {
      toast.error('Please enter a valid full name (at least 2 letters).');
      return;
    }
    if (!/^[0-9]{10}$/.test(payload.phone)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[0-9]{6}$/.test(payload.postalCode)) {
      toast.error('Please enter a valid 6-digit postal pincode.');
      return;
    }
    if (!payload.locality || payload.locality.length < 2) {
      toast.error('Please specify your locality or area.');
      return;
    }
    if (!payload.address || payload.address.length < 3) {
      toast.error('Please provide a complete street/house address.');
      return;
    }
    if (!payload.city || payload.city.length < 2) {
      toast.error('Please enter your city.');
      return;
    }
    if (!payload.state) {
      toast.error('Please select your state.');
      return;
    }

    setSavingAddress(true);
    try {
      const response = await profileAPI.addAddress(payload);
      const newAddr = response.data;
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr._id);
      setShowAddressForm(false);
      toast.success('Delivery address saved successfully!');
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address. Please check all fields.');
    } finally {
      setSavingAddress(false);
    }
  };

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    if (checkoutItems.length === 0) {
      toast.error('Your order has no items.');
      return;
    }

    if (!selectedAddress) {
      toast.warning('Please select or add a delivery address before placing your order.');
      setShowAddressForm(true);
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    // Determine partner ID (needs to be valid 24-hex ObjectId)
    const rawPartnerId = checkoutItems[0]?.partnerId || checkoutItems[0]?.foodPartner?._id || '65f000000000000000000001';
    // Ensure 24-hex string
    const partnerId = /^[0-9a-fA-F]{24}$/.test(String(rawPartnerId)) 
      ? String(rawPartnerId) 
      : '65f000000000000000000001';

    // Format items array matching createOrderSchema
    const orderItems = checkoutItems.map((item) => {
      const rawFoodId = item._id || item.id || '65f000000000000000000002';
      const foodId = /^[0-9a-fA-F]{24}$/.test(String(rawFoodId))
        ? String(rawFoodId)
        : '65f000000000000000000002';

      return {
        food: foodId,
        nameSnapshot: item.name,
        quantity: Number(item.quantity) || 1,
        priceSnapshot: Number(item.price) || 0,
      };
    });

    const orderData = {
      foodPartner: partnerId,
      userAddressId: /^[0-9a-fA-F]{24}$/.test(String(selectedAddress._id)) ? String(selectedAddress._id) : undefined,
      deliveryAddressSnapshot: {
        label: selectedAddress.label || 'Home',
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        locality: selectedAddress.locality || undefined,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        postalCode: String(selectedAddress.postalCode),
        country: selectedAddress.country || 'India',
        landmark: selectedAddress.landmark || undefined,
        alternatePhone: selectedAddress.alternatePhone || undefined,
      },
      items: orderItems,
    };

    setPlaceOrderLoading(true);
    try {
      const response = await orderAPI.placeOrder(orderData);
      console.log('Order placed successfully:', response);
      
      // Clear global cart if checked out from cart
      if (!directFood) {
        clearCart();
      }

      setCreatedOrder({
        id: response.data?.id || 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        total: finalTotal,
        paymentMethod: paymentMethod.toUpperCase(),
        address: selectedAddress,
        itemsCount: checkoutItems.length
      });

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      const msg = error.response?.data?.message || 'Error placing order. Please try again.';
      toast.error(msg);
    } finally {
      setPlaceOrderLoading(false);
    }
  };

  // Render Order Placed Celebration View
  if (createdOrder) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0D0D11] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center my-auto">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-[#18181F] rounded-3xl border border-slate-200 dark:border-white/10 p-8 sm:p-12 shadow-2xl space-y-6"
          >
            {/* Animated Celebration Icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Order Confirmed
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 dark:text-white">
                Delicious food is on the way!
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Order ID: <strong className="text-slate-800 dark:text-slate-200 font-mono">{createdOrder.id}</strong>
              </p>
            </div>

            {/* Delivery Estimate Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/5 flex items-center justify-around gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FF462D]/10 text-[#FF462D]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                    Estimated Delivery
                  </span>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white">
                    25 - 35 Minutes
                  </p>
                </div>
              </div>

              <div className="border-l border-slate-200 dark:border-white/10 pl-4">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                  Payment
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ₹{createdOrder.total} ({createdOrder.paymentMethod})
                </p>
              </div>
            </div>

            {/* Delivery Address Summary */}
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 text-left text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FF462D]" />
                Delivering to: {createdOrder.address.label} ({createdOrder.address.fullName})
              </span>
              <p className="text-slate-600 dark:text-slate-400 pl-5">
                {createdOrder.address.address}, {createdOrder.address.locality}, {createdOrder.address.city}, {createdOrder.address.state} - {createdOrder.address.postalCode}
              </p>
              <p className="text-slate-500 dark:text-slate-400 pl-5">Phone: {createdOrder.address.phone}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/user/profile"
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-[#FF462D] dark:hover:bg-[#FF462D] text-white font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                View Order History
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-white/15 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition-colors text-center cursor-pointer"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If no items in checkout
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0D0D11] text-slate-900 dark:text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center my-auto">
          <div className="bg-white dark:bg-[#18181F] rounded-3xl border border-slate-200 dark:border-white/10 p-8 shadow-xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 text-[#FF462D] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
              No items selected for checkout
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Add mouthwatering dishes to your cart or order directly from Reels to complete checkout.
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                to="/reel"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Explore Food Reels
              </Link>
              <Link
                to="/"
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0D0D11] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-[#FF462D] dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900 dark:text-white">
            Secure Checkout
          </h1>

          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Secure</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column (7 cols): Address Selector + Payment Methods */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. DELIVERY ADDRESS SECTION */}
            <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF462D]/10 text-[#FF462D] flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white">
                      Delivery Address
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                {addresses.length > 0 && !showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF462D] hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-5">
                {loadingAddresses ? (
                  <div className="py-8 flex items-center justify-center gap-2 text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading your saved addresses...</span>
                  </div>
                ) : addresses.length === 0 && !showAddressForm ? (
                  /* Zero addresses state warning */
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold">No Delivery Address Found</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          Please add an address first to place your food order.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="px-4 py-2 rounded-xl bg-[#FF462D] text-white text-xs font-bold shadow-md cursor-pointer shrink-0"
                    >
                      + Add Address Now
                    </button>
                  </div>
                ) : showAddressForm ? (
                  /* Inline Address Creation Form */
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSaveAddress}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FF462D]" />
                        <span>Add New Delivery Address</span>
                      </h3>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* Address Type Buttons */}
                    <div className="flex items-center gap-2">
                      {['Home', 'Work', 'Other'].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setAddressForm((prev) => ({ ...prev, label }))}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            addressForm.label === label
                              ? 'border-[#FF462D] bg-[#FF462D]/10 text-[#FF462D]'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          {label === 'Home' && <Home className="w-3.5 h-3.5" />}
                          {label === 'Work' && <Briefcase className="w-3.5 h-3.5" />}
                          {label === 'Other' && <Navigation className="w-3.5 h-3.5" />}
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, fullName: e.target.value }))}
                          placeholder="e.g. John Doe"
                          className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Phone Number (10 digits) *
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                          placeholder="9876543210"
                          className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Pincode (6 digits) *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={addressForm.postalCode}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, postalCode: e.target.value.replace(/\D/g, '') }))}
                          placeholder="110001"
                          className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          Locality / Sector / Area *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.locality}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, locality: e.target.value }))}
                          placeholder="e.g. Indiranagar 100ft Road"
                          className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Flat / House No. / Building / Street *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={addressForm.address}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Flat 402, Sunshine Heights, 4th Cross"
                        className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          City / District *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                          placeholder="e.g. Bangalore"
                          className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                          State *
                        </label>
                        <select
                          required
                          value={addressForm.state}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-[#FF462D]"
                        >
                          {INDIAN_STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.landmark}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, landmark: e.target.value }))}
                        placeholder="e.g. Opposite Metro Station, Near Cafe"
                        className="w-full bg-slate-50 dark:bg-[#121217] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-[#FF462D]"
                      />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                      <button
                        type="submit"
                        disabled={savingAddress}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {savingAddress && <Loader2 className="w-4 h-4 animate-spin" />}
                        <span>Save & Deliver Here</span>
                      </button>
                      {addresses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </motion.form>
                ) : (
                  /* Saved Addresses List */
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddressId === addr._id;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'border-[#FF462D] bg-[#FF462D]/5 dark:bg-[#FF462D]/10 ring-1 ring-[#FF462D]'
                              : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/[0.02]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryAddress"
                            checked={isSelected}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="mt-1 h-4 w-4 accent-[#FF462D] cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                                {addr.fullName}
                              </span>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                {addr.label || 'Home'}
                              </span>
                              {addr.isDefault && (
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                              {addr.address}, {addr.locality}, {addr.city}, {addr.state} - {addr.postalCode}
                            </p>
                            {addr.landmark && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Landmark: {addr.landmark}
                              </p>
                            )}
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                              Phone: {addr.phone}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 2. PAYMENT METHODS SECTION */}
            <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF462D]/10 text-[#FF462D] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white">
                    Payment Method
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose how you would like to pay
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-[#FF462D] bg-[#FF462D]/5 dark:bg-[#FF462D]/10 ring-1 ring-[#FF462D]'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 accent-[#FF462D] cursor-pointer"
                    />
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Pay with cash or UPI to rider upon arrival
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Popular
                  </span>
                </label>

                {/* UPI / QR Code */}
                <label
                  onClick={() => setPaymentMethod('upi')}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#FF462D] bg-[#FF462D]/5 dark:bg-[#FF462D]/10 ring-1 ring-[#FF462D]'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="h-4 w-4 accent-[#FF462D] cursor-pointer"
                    />
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        UPI Instant (GPay / PhonePe / Paytm)
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Pay instantly via any UPI App
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">
                    Fastest
                  </span>
                </label>

                {/* Credit / Debit Card */}
                <label
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#FF462D] bg-[#FF462D]/5 dark:bg-[#FF462D]/10 ring-1 ring-[#FF462D]'
                      : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/50 dark:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="h-4 w-4 accent-[#FF462D] cursor-pointer"
                    />
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Credit / Debit Card
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Visa, Mastercard, RuPay & Amex accepted
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): Order Items Review & Bill Summary */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Order Items Review */}
            <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#FF462D]" />
                  <span>Order Items ({checkoutItems.length})</span>
                </h3>
                {directFood ? (
                  <span className="text-[11px] font-bold text-[#FF462D] bg-[#FF462D]/10 px-2 py-0.5 rounded-full">
                    Direct Order
                  </span>
                ) : (
                  <Link to="/cart" className="text-xs font-bold text-[#FF462D] hover:underline">
                    Edit Cart
                  </Link>
                )}
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto no-scrollbar pr-1">
                {checkoutItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-black shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white shrink-0">
                      ₹{Number(item.price) * Number(item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Direct Order Quantity Stepper (if from Reel / Single Item) */}
              {directFood && (
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Quantity</span>
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-0.5">
                    <button
                      onClick={() => setDirectQuantity((q) => Math.max(1, q - 1))}
                      className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#FF462D] flex items-center justify-center font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="min-w-6 text-center text-xs font-bold text-slate-900 dark:text-white">
                      {directQuantity}
                    </span>
                    <button
                      onClick={() => setDirectQuantity((q) => q + 1)}
                      className="w-6 h-6 rounded-lg bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 hover:text-white hover:bg-[#FF462D] flex items-center justify-center font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bill Details */}
            <div className="bg-white dark:bg-[#18181F] rounded-2xl border border-slate-200 dark:border-white/10 p-4 sm:p-5 shadow-xs space-y-3">
              <h3 className="text-sm font-bold font-heading text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-white/10">
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">₹{itemTotal}</span>
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

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>- ₹{discount}</span>
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

              {/* Delivery Address Reminder */}
              {!selectedAddress && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Please select or create an address above before placing your order.</span>
                </div>
              )}

              {/* Primary Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={placeOrderLoading || !selectedAddress}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] hover:from-[#E03E26] hover:to-[#FF462D] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#FF462D]/30 hover:shadow-[#FF462D]/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {placeOrderLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <span>Place Order (₹{finalTotal})</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
                By placing this order, you agree to our Terms of Service & Cancellation Policy.
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
