import * as React from 'react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Flame, 
  Utensils
} from 'lucide-react';
import { FoodCard, type FoodProduct } from './FoodCard';
import { Tabs, type TabItem } from '../ui/Tabs';
import { Skeleton } from '../ui/Skeleton';
import { foodAPI } from '../../services/api';
import { products as FALLBACK_PRODUCTS } from '../../data/products';
import { useCart } from '../../context/CartContext';

interface FoodFeedProps {
  searchQuery?: string;
  onAddToCart?: (product: FoodProduct, quantity: number) => void;
}

const CATEGORIES: TabItem[] = [
  { id: 'all', label: 'All Specials' },
  { id: 'pizza', label: '🍕 Pizza & Pasta' },
  { id: 'burger', label: '🍔 Burgers' },
  { id: 'biryani', label: '🍗 Biryani & Bowls' },
  { id: 'dessert', label: '🍰 Desserts' },
  { id: 'beverages', label: '🥤 Beverages' }
];

export const FoodFeed: React.FC<FoodFeedProps> = ({ searchQuery = '', onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [productsList, setProductsList] = useState<FoodProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cart integration for high-performance memoized FoodCards
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  // Stable ref for cart actions so callback props never change reference
  const cartActionsRef = useRef({ addToCart, updateQuantity, removeFromCart, onAddToCart });
  useEffect(() => {
    cartActionsRef.current = { addToCart, updateQuantity, removeFromCart, onAddToCart };
  }, [addToCart, updateQuantity, removeFromCart, onAddToCart]);

  // Fast O(1) map of food ID -> quantity in cart
  const cartQuantityMap = useMemo(() => {
    const map: Record<string, number> = {};
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && item._id) {
          map[String(item._id)] = Number(item.quantity || 0);
        }
      }
    }
    return map;
  }, [items]);

  // Permanently stable increment callback (never breaks React.memo)
  const handleIncrement = useCallback((product: FoodProduct, currentQty: number) => {
    const id = String(product._id || product.id || product.name);
    if (currentQty === 0) {
      cartActionsRef.current.addToCart(product, 1);
    } else {
      cartActionsRef.current.updateQuantity(id, currentQty + 1);
    }
  }, []);

  // Permanently stable decrement callback (never breaks React.memo)
  const handleDecrement = useCallback((id: string, currentQty: number) => {
    if (currentQty <= 1) {
      cartActionsRef.current.removeFromCart(id);
    } else {
      cartActionsRef.current.updateQuantity(id, currentQty - 1);
    }
  }, []);

  // Fetch foods from API with fallback to clean mock data
  useEffect(() => {
    let isMounted = true;
    const fetchDishes = async () => {
      setIsLoading(true);
      try {
        const res = await foodAPI.getAllFoods(new URLSearchParams({ limit: '24' }));
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setProductsList(res.data);
        } else if (isMounted) {
          setProductsList(FALLBACK_PRODUCTS as FoodProduct[]);
        }
      } catch (err) {
        console.warn('Backend API offline, utilizing curated gourmet menu data:', err);
        if (isMounted) {
          setProductsList(FALLBACK_PRODUCTS as FoodProduct[]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDishes();
    return () => { isMounted = false; };
  }, []);

  // Filter products by search query and category using authentic fields (memoized)
  const filteredProducts = useMemo(() => {
    return productsList.filter((item) => {
      const itemName = (item.name || '').toLowerCase();
      const itemDesc = (item.description || '').toLowerCase();
      const itemRest = (item.restaurant || item.restaurantName || item.foodPartner?.restaurantName || '').toLowerCase();
      const search = searchQuery.toLowerCase().trim();

      const matchesSearch = !search || itemName.includes(search) || itemDesc.includes(search) || itemRest.includes(search);
      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'pizza') return itemName.includes('pizza') || itemDesc.includes('pizza') || itemName.includes('pasta');
      if (activeCategory === 'burger') return itemName.includes('burger') || itemDesc.includes('burger') || itemName.includes('sandwich');
      if (activeCategory === 'biryani') return itemName.includes('biryani') || itemDesc.includes('biryani') || itemName.includes('chicken') || itemName.includes('rice');
      if (activeCategory === 'dessert') return itemName.includes('cake') || itemDesc.includes('cake') || itemName.includes('choco') || itemDesc.includes('dessert') || itemName.includes('ice');
      if (activeCategory === 'beverages') return itemName.includes('coffee') || itemDesc.includes('coffee') || itemName.includes('shake') || itemName.includes('juice') || itemName.includes('tea');

      return true;
    });
  }, [productsList, searchQuery, activeCategory]);

  return (
    <section id="trending-feed" className="py-10 md:py-20 bg-[#FAFAF9] dark:bg-[#0D0D11] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF462D]/10 border border-[#FF462D]/25 text-xs font-semibold text-[#FF462D]">
              <Flame className="w-3.5 h-3.5" />
              <span>Chef's Choice & Trending Cravings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-stone-900 dark:text-white tracking-tight">
              Trending <span className="gradient-text-coral">Deliciousness</span>
            </h2>
            <p className="text-stone-600 dark:text-slate-400 text-xs sm:text-sm md:text-base max-w-xl">
              Freshly prepared dishes by top-rated artisanal kitchens in your city.
            </p>
          </div>

          {/* Dish Counter */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-1">
            <span className="text-xs text-stone-500 dark:text-slate-400 font-medium">
              <span className="text-stone-900 dark:text-white font-bold">{filteredProducts.length}</span> dishes available
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 md:mb-8">
          <Tabs
            tabs={CATEGORIES}
            activeTab={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        {/* Horizontal card grid on mobile, regular grid on larger screens */}
        {isLoading ? (
          <div className="grid grid-rows-1 grid-flow-col auto-cols-[calc(50%-8px)] sm:auto-cols-[calc(33.333%-16px)] md:grid-flow-row md:grid-rows-none md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:overflow-visible md:pb-0">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-full min-w-0 bg-white dark:bg-[#18181F] rounded-2xl p-3 sm:p-4 border border-stone-200/80 dark:border-white/5 space-y-3 shadow-xs snap-start">
                <Skeleton height="h-36 sm:h-40 md:h-44" className="w-full rounded-xl" />
                <Skeleton height="h-3" className="w-1/3" />
                <Skeleton height="h-4" className="w-3/4" />
                <Skeleton height="h-3" className="w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton height="h-5" className="w-16" />
                  <Skeleton height="h-8" className="w-20 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-14 px-4 bg-white dark:bg-[#18181F] rounded-3xl border border-stone-200 dark:border-white/10 max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FF462D]/15 text-[#FF462D] flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">No dishes found</h3>
            <p className="text-xs text-stone-500 dark:text-slate-400 mb-4">
              We couldn't find dishes matching "{searchQuery || activeCategory}". Try selecting another category!
            </p>
            <button
              type="button"
              onClick={() => { setActiveCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-rows-1 grid-flow-col auto-cols-[calc(50%-8px)] sm:auto-cols-[calc(33.333%-16px)] md:grid-flow-row md:grid-rows-none md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:overflow-visible md:pb-0">
            {filteredProducts.map((product) => {
              const id = String(product._id || product.id || product.name);
              return (
                <div key={id} className="h-full min-w-0 snap-start">
                  <FoodCard
                    product={product}
                    quantity={cartQuantityMap[id] || 0}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onAddToCart={onAddToCart}
                  />
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default FoodFeed;
