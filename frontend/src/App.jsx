import React, { Suspense, lazy } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy-loaded route components for optimal initial bundle size
const Reel = lazy(() => import('./pages/Reel'));
const UserLogin = lazy(() => import('./pages/UserLogin'));
const UserRegister = lazy(() => import('./pages/UserRegister'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const PartnerLogin = lazy(() => import('./pages/PartnerLogin'));
const PartnerRegister = lazy(() => import('./pages/PartnerRegister'));
const PartnerProfile = lazy(() => import('./pages/PartnerProfile'));
const PartnerProfileUser = lazy(() => import('./pages/PartnerProfileUser'));
const Addfood = lazy(() => import('./pages/Addfood'));
const LandingPage = lazy(() => import('./pages/LandingPgae'));
const NotFound = lazy(() => import('./pages/NotFound'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

// Core shared components
import CartDrawer from './components/cart/CartDrawer';
import BottomNav from './components/BottomNav';
import { CartProvider } from './context/CartContext';

// Minimal smooth fallback spinner for route transitions
const RouteLoader = () => (
  <div className="min-h-screen bg-[#0D0D11] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#FF462D] border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const location = useLocation();
  const hideBottomNavPaths = ['/user/login', '/user/register', '/partner/login', '/partner/register', '/checkout', '/cart'];
  const showNav = !hideBottomNavPaths.includes(location.pathname);

  return (
    <CartProvider>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
      />
      <CartDrawer />
      <Suspense fallback={<RouteLoader />}>
        <Routes>
          <Route path="/reel" element={<Reel />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/partner/register" element={<PartnerRegister />} />
          <Route path="/partner/login" element={<PartnerLogin />} />
          <Route path="/partner/profile" element={<PartnerProfile />} />
          <Route path="/profile/foodpartner/:id" element={<PartnerProfileUser />} />
          <Route path='/partner/addfood' element={<Addfood />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {showNav && <BottomNav />}
    </CartProvider>
  );
}

export default App;
