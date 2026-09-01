import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Film, Utensils, User, ShoppingBag } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const BottomNav = () => {
  const { user, Cart = [] } = useAppContext() || {};
  const location = useLocation();

  const navitems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/reel', label: 'Reels', icon: Film, badge: 'Live' },
    { path: '/checkout', label: 'Cart', icon: ShoppingBag, count: Array.isArray(Cart) ? Cart.length : 0 },
    { 
      path: user?.userType === 'partner' ? '/partner/profile' : '/user/profile', 
      label: 'Account', 
      icon: User 
    },
  ];

  return (
    <nav 
      className="bottom-nav-responsive z-50 px-3 py-2 shadow-2xl shadow-black/80 backdrop-blur-2xl bg-[#18181F]/90 border border-white/10"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {navitems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-colors duration-200 cursor-pointer select-none group min-w-[64px]"
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeBottomNavPill"
                  className="absolute inset-0 bg-gradient-to-r from-[#FF462D]/20 to-[#FF6B4A]/20 border border-[#FF462D]/40 rounded-2xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-0.5">
                <div className="relative">
                  <Icon 
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#FF462D]' : 'text-slate-400 group-hover:text-slate-200'
                    }`} 
                  />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-[#FF462D] animate-ping" />
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-2 px-1 rounded-full bg-[#FF462D] text-white text-[9px] font-bold">
                      {item.count}
                    </span>
                  )}
                </div>
                <span 
                  className={`text-[11px] font-medium transition-colors ${
                    isActive ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;