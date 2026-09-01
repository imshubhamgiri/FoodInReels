import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  ArrowRight, 
  ChevronLeft,
  ChevronRight,
  Sparkles, 
  Utensils,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { FoodCard, type FoodProduct } from './FoodCard';
import { Tabs, type TabItem } from '../ui/Tabs';
import { Skeleton } from '../ui/Skeleton';
import { foodAPI } from '../../services/api';
import { products as FALLBACK_PRODUCTS } from '../../data/products';

interface FoodFeedProps {
  searchQuery?: string;
  onAddToCart?: (product: FoodProduct, quantity: number) => void;
}

const CATEGORIES: TabItem[] = [
  { id: 'all', label: 'All Specials' },
  { id: 'trending', label: '🔥 Trending' },
  { id: 'pizza', label: '🍕 Pizza & Pasta' },
  { id: 'burger', label: '🍔 Burgers' },
  { id: 'biryani', label: '🍗 Biryani & Bowls' },
  { id: 'veg', label: '🥗 Pure Veg' },
  { id: 'dessert', label: '🍰 Desserts' },
  { id: 'beverages', label: '🥤 Beverages' }
];

export const FoodFeed: React.FC<FoodFeedProps> = ({ searchQuery = '', onAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [productsList, setProductsList] = useState<FoodProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll left and right functions for horizontal scroll mode (< md)
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Fetch foods from API with fallback to rich mock data
  useEffect(() => {
    let isMounted = true;
    const fetchDishes = async () => {
      setIsLoading(true);
      try {
        const res = await foodAPI.getAllFoods(new URLSearchParams({ limit: '24' }));
        if (isMounted && res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setProductsList(res.data);
        } else if (isMounted) {
          setProductsList(FALLBACK_PRODUCTS.map((p: any) => ({
            ...p,
            isVeg: p.tags?.some((t: string) => 
              t.toLowerCase().includes('south') || 
              t.toLowerCase().includes('veg') || 
              t.toLowerCase().includes('dessert') ||
              p.name.toLowerCase().includes('paneer') ||
              p.name.toLowerCase().includes('dosa') ||
              p.name.toLowerCase().includes('cake')
            )
          })));
        }
      } catch (err) {
        console.warn('Backend API offline, utilizing curated gourmet menu data:', err);
        if (isMounted) {
          setProductsList(FALLBACK_PRODUCTS.map((p: any) => ({
            ...p,
            isVeg: p.tags?.some((t: string) => 
              t.toLowerCase().includes('south') || 
              t.toLowerCase().includes('veg') || 
              t.toLowerCase().includes('dessert') ||
              p.name.toLowerCase().includes('paneer') ||
              p.name.toLowerCase().includes('dosa') ||
              p.name.toLowerCase().includes('cake')
            )
          })));
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDishes();
    return () => { isMounted = false; };
  }, []);

  // Filter products by search query and category
  const filteredProducts = productsList.filter((item) => {
    const itemName = (item.name || '').toLowerCase();
    const itemRest = (item.restaurant || item.restaurantName || '').toLowerCase();
    const itemTags = (item.tags || []).join(' ').toLowerCase();
    const search = searchQuery.toLowerCase().trim();

    const matchesSearch = !search || itemName.includes(search) || itemRest.includes(search) || itemTags.includes(search);
    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'trending') return itemTags.includes('trending') || itemTags.includes('bestseller') || (item.rating && item.rating >= 4.5);
    if (activeCategory === 'pizza') return itemName.includes('pizza') || itemTags.includes('pizza') || itemTags.includes('italian');
    if (activeCategory === 'burger') return itemName.includes('burger') || itemTags.includes('burger') || itemName.includes('sandwich');
    if (activeCategory === 'biryani') return itemName.includes('biryani') || itemTags.includes('biryani') || itemName.includes('chicken');
    if (activeCategory === 'veg') return item.isVeg || itemTags.includes('veg') || itemName.includes('paneer') || itemName.includes('dosa');
    if (activeCategory === 'dessert') return itemName.includes('cake') || itemTags.includes('dessert') || itemName.includes('choco') || itemName.includes('ice');
    if (activeCategory === 'beverages') return itemTags.includes('beverage') || itemName.includes('coffee') || itemName.includes('shake');

    return true;
  });

  return (
    <section id="trending-feed" className="py-10 md:py-20 bg-[#0D0D11] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF462D]/10 border border-[#FF462D]/30 text-xs font-semibold text-[#FF6B4A]">
              <Flame className="w-3.5 h-3.5" />
              <span>Chef's Choice & Trending Cravings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
              Trending <span className="gradient-text-coral">Deliciousness</span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl">
              Freshly prepared by top-rated artisanal kitchens. Savor the most ordered gourmet meals in your city.
            </p>
          </div>

          {/* Left/Right Scroll Buttons for Mobile/Tablet (< md) + Desktop Counter */}
          <div className="flex items-center justify-between md:justify-end gap-3 pt-1">
            <span className="text-xs text-slate-400 font-medium">
              <span className="text-white font-bold">{filteredProducts.length}</span> dishes found
            </span>

            {/* Mobile/Tablet Horizontal Scroll Nav Buttons (< md) */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 rounded-xl bg-[#18181F] hover:bg-[#22222D] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                aria-label="Scroll dishes left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 rounded-xl bg-[#18181F] hover:bg-[#22222D] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                aria-label="Scroll dishes right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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

        {/* Swipe Hint Pill on Mobile (< md) */}
        <div className="flex md:hidden items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
          <span className="flex items-center gap-1 text-[#FFB703]">
            <Sparkles className="w-3 h-3" /> Scroll horizontally to explore
          </span>
          <span className="text-slate-500">2-row feed</span>
        </div>

        {/* Dishes Grid: 
            - On screens < md: 2-row horizontal scrollable grid with snap scrolling
            - On screens >= md: Standard 3/4 column responsive grid 
        */}
        {isLoading ? (
          <div 
            className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(220px,260px)] sm:auto-cols-[280px] md:auto-cols-auto gap-3.5 sm:gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none md:grid-rows-none md:grid-flow-row md:grid-cols-3 lg:grid-cols-4 no-scrollbar"
          >
            {[...Array(8)].map((_, i) => (
              <div key={i} className="snap-start h-full bg-[#18181F] rounded-2xl p-3 sm:p-4 border border-white/5 space-y-3 min-w-[220px] md:min-w-0">
                <Skeleton height="h-28 sm:h-36 md:h-44" className="w-full rounded-xl" />
                <Skeleton height="h-4" className="w-3/4" />
                <Skeleton height="h-3" className="w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton height="h-5" className="w-14" />
                  <Skeleton height="h-7" className="w-16 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-14 px-4 bg-[#18181F] rounded-3xl border border-white/10 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#FF462D]/15 text-[#FF462D] flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">No dishes found</h3>
            <p className="text-xs text-slate-400 mb-4">
              We couldn't find dishes matching "{searchQuery || activeCategory}". Try choosing another category!
            </p>
            <button
              onClick={() => { setActiveCategory('all'); }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="grid grid-rows-2 grid-flow-col auto-cols-[minmax(220px,260px)] sm:auto-cols-[280px] md:auto-cols-auto gap-3.5 sm:gap-4 md:gap-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 pt-1 snap-x snap-mandatory md:snap-none md:grid-rows-none md:grid-flow-row md:grid-cols-3 lg:grid-cols-4 no-scrollbar overscroll-x-contain"
          >
            {filteredProducts.map((product) => (
              <div 
                key={product._id || product.id || product.name} 
                className="snap-start h-full min-w-[220px] sm:min-w-[260px] md:min-w-0"
              >
                <FoodCard
                  product={product}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FoodFeed;
