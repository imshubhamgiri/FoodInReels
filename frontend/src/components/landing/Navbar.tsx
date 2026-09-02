import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  Sun, 
  Moon, 
  ChevronDown, 
  Sparkles, 
  Film, 
  User, 
  LogIn,
  X,
  Compass,
  UtensilsCrossed
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';
import { useAppContext } from '../../context/AppContext';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/utils';

interface NavbarProps {
  onSearch?: (query: string) => void;
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

const POPULAR_CITIES = [
  'Bangalore', 'Mumbai', 'Delhi NCR', 'Hyderabad', 
  'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 
  'Jaipur', 'Chandigarh', 'Goa', 'Lucknow'
];

const QUICK_SEARCH_TAGS = [
  '🔥 Dum Biryani', '🍕 Woodfired Pizza', '🍔 Smash Burgers', 
  '🍜 Ramen & Dimsum', '🥗 Fresh Bowls', '🍰 Belgian Waffles'
];

export const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  selectedCity = 'Bangalore',
  onCityChange
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAppContext();
  const { itemCount: cartItemCount, openCart } = useCart();
  const navigate = useNavigate();

  const [currentCity, setCurrentCity] = useState(selectedCity);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll listener for enhanced shadow & blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close city dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city: string) => {
    setCurrentCity(city);
    onCityChange?.(city);
    setIsCityOpen(false);
    setCitySearchQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
    }
  };

  const filteredCities = POPULAR_CITIES.filter(c => 
    c.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <header 
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled 
          ? 'bg-[#0D0D11]/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/60 py-2.5' 
          : 'bg-[#0D0D11]/80 backdrop-blur-md border-b border-white/[0.05] py-2.5 sm:py-3.5'
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Row: Logo, Desktop Location & Search, Action Buttons */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">
          
          {/* Left: Brand Logo & Desktop Location */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 min-w-0">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-1.5 sm:gap-2 group shrink-0 transition-transform active:scale-95"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-[#FF462D] to-[#FF6B4A] flex items-center justify-center shadow-md shadow-[#FF462D]/30 border border-[#FF6B4A]/50 group-hover:shadow-[#FF462D]/50 transition-all duration-300 shrink-0">
                <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-base sm:text-lg md:text-xl tracking-tight text-white flex items-center leading-tight">
                  Food<span className="text-[#FF462D]">In</span>Reels
                </span>
                <span className="text-[9px] tracking-widest text-[#FFB703] font-semibold uppercase hidden md:block">
                  Taste The Sizzle
                </span>
              </div>
            </Link>

            {/* Desktop-only Location Selector (shown on md+) */}
            <div className="relative hidden md:block" ref={cityDropdownRef}>
              <button
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18181F] hover:bg-[#22222D] border border-white/10 hover:border-white/20 transition-all duration-200 text-xs lg:text-sm text-slate-200 cursor-pointer select-none"
                aria-label="Select delivery city"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF462D] shrink-0" />
                <span className="font-medium max-w-[100px] lg:max-w-[130px] truncate">{currentCity}</span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", isCityOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isCityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-72 bg-[#18181F] border border-white/15 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-50 p-3"
                  >
                    <div className="text-xs font-semibold text-slate-400 mb-2 px-1 flex items-center justify-between">
                      <span>Delivery City</span>
                      <span className="text-[10px] text-[#FF462D]">India</span>
                    </div>

                    <div className="relative mb-2">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search city..."
                        value={citySearchQuery}
                        onChange={(e) => setCitySearchQuery(e.target.value)}
                        className="w-full bg-[#121217] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF462D]/50"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-48 overflow-y-auto no-scrollbar space-y-0.5">
                      {filteredCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => handleCitySelect(city)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer",
                            city === currentCity 
                              ? "bg-[#FF462D]/15 text-[#FF6B4A] font-semibold" 
                              : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                          )}
                        >
                          <span>{city}</span>
                          {city === currentCity && <span className="w-1.5 h-1.5 rounded-full bg-[#FF462D]"></span>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Center: Universal Search Bar on Desktop (md+) */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center w-full">
                <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search restaurants, cuisines, or dishes..."
                  className="w-full h-10 lg:h-11 bg-[#18181F] text-slate-100 placeholder:text-slate-500 pl-10 pr-16 rounded-xl border border-white/10 focus:border-[#FF462D]/60 focus:ring-2 focus:ring-[#FF462D]/20 focus:outline-none text-xs lg:text-sm transition-all duration-200"
                />
                <div className="absolute right-3 flex items-center gap-1">
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/[0.06] border border-white/10 rounded-md">
                      ⌘K
                    </kbd>
                  )}
                </div>
              </div>
            </form>

            {/* Quick Suggestions Dropdown */}
            <AnimatePresence>
              {isSearchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#18181F] border border-white/15 rounded-2xl p-4 shadow-2xl shadow-black/80 z-50 backdrop-blur-xl"
                >
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
                    Popular Searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          const query = tag.replace(/^[^\s]+\s/, '');
                          setSearchQuery(query);
                          onSearch?.(query);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-[#FF462D]/15 hover:text-[#FF6B4A] border border-white/5 hover:border-[#FF462D]/30 text-xs text-slate-300 transition-all cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Actions (Food Reels Live, Cart, Theme, User Profile / Auth) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Reels Discovery Button (Desktop only) */}
            <Link
              to="/reel"
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF462D]/20 to-[#FFB703]/20 hover:from-[#FF462D]/30 hover:to-[#FFB703]/30 border border-[#FF462D]/30 text-xs font-semibold text-white transition-all duration-200"
            >
              <Film className="w-3.5 h-3.5 text-[#FF462D]" />
              <span>Food Reels</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF462D] animate-pulse"></span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-[#18181F] hover:bg-slate-200 dark:hover:bg-[#22222D] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shrink-0"
              aria-label="View shopping cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {cartItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#FF462D] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0D0D11] shadow-md shadow-[#FF462D]/40"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-[#18181F] hover:bg-[#22222D] border border-white/10 hover:border-white/20 text-slate-300 hover:text-[#FFB703] transition-all cursor-pointer shrink-0"
              aria-label="Toggle light and dark mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* User Auth or Profile Button */}
            {isAuthenticated && user ? (
              <Link
                to={user.userType === 'partner' ? '/partner/profile' : '/user/profile'}
                className="flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-1.5 sm:pr-3 sm:py-1 rounded-xl bg-[#18181F] hover:bg-[#22222D] border border-white/10 hover:border-white/20 transition-all text-xs text-white shrink-0"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-[#FF462D] to-[#FFB703] flex items-center justify-center text-white font-bold text-[11px] sm:text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
                <span className="font-medium hidden sm:inline max-w-[70px] lg:max-w-[90px] truncate">{user.name || 'Profile'}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                <Link to="/user/login">
                  <Button variant="default" size="sm" className="px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold">
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Sign In</span>
                  </Button>
                </Link>
                <Link to="/partner/login" className="hidden 2xl:inline-flex">
                  <Button variant="outline" size="sm">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-[#FFB703]" />
                    <span>Partner</span>
                  </Button>
                </Link>
              </div>
            )}

          </div>

        </div>

        {/* Mobile & Tablet Sub-Row (< md): Compact Location Selector + Full Search Bar */}
        <div className="mt-2.5 flex items-center gap-2 md:hidden">
          
          {/* Mobile Location Selector Chip */}
          <div className="relative shrink-0" ref={cityDropdownRef}>
            <button
              onClick={() => setIsCityOpen(!isCityOpen)}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#18181F] hover:bg-[#22222D] border border-white/10 hover:border-white/20 transition-all text-xs text-slate-200 cursor-pointer select-none shrink-0"
              aria-label="Select delivery city"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF462D] shrink-0" />
              <span className="font-medium max-w-[75px] xs:max-w-[95px] truncate">{currentCity}</span>
              <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform duration-200", isCityOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isCityOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-[#18181F] border border-white/15 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden z-50 p-3"
                >
                  <div className="text-[11px] font-semibold text-slate-400 mb-2 px-1 flex items-center justify-between">
                    <span>Delivery City</span>
                    <span className="text-[10px] text-[#FF462D]">India</span>
                  </div>

                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={citySearchQuery}
                      onChange={(e) => setCitySearchQuery(e.target.value)}
                      className="w-full bg-[#121217] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FF462D]/50"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-44 overflow-y-auto no-scrollbar space-y-0.5">
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer",
                          city === currentCity 
                            ? "bg-[#FF462D]/15 text-[#FF6B4A] font-semibold" 
                            : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                        )}
                      >
                        <span>{city}</span>
                        {city === currentCity && <span className="w-1.5 h-1.5 rounded-full bg-[#FF462D]"></span>}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes or cuisines..."
                className="w-full h-9 bg-[#18181F] text-slate-100 placeholder:text-slate-500 pl-8 pr-3 rounded-xl border border-white/10 focus:border-[#FF462D]/60 focus:outline-none text-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </form>

        </div>

      </div>
    </header>
  );
};

export default Navbar;
