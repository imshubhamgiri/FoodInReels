import * as React from 'react';
import { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Minus
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FoodProduct {
  _id?: string | number;
  id?: string | number;
  name: string;
  description?: string;
  restaurant?: string;
  restaurantName?: string;
  foodPartner?: {
    restaurantName?: string;
    name?: string;
  };
  price: number;
  likeCount?: number;
  image?: string;
}

export interface FoodCardProps {
  product: FoodProduct;
  quantity?: number;
  onIncrement?: (product: FoodProduct, currentQuantity: number) => void;
  onDecrement?: (id: string, currentQuantity: number) => void;
  onAddToCart?: (product: FoodProduct, quantity: number) => void;
}

export const FoodCard = React.memo<FoodCardProps>(function FoodCard({ 
  product, 
  quantity = 0,
  onIncrement,
  onDecrement,
  onAddToCart 
}) {
  const [isLiked, setIsLiked] = useState(false);

  const id = String(product._id || product.id || product.name);
  const currentQuantity = quantity;
  const name = product.name || 'Gourmet Specialty';
  const description = product.description || '';
  const restaurant = product.foodPartner?.restaurantName || product.restaurantName || product.restaurant || 'Artisan Kitchen';
  const price = Number(product.price || 199);
  const initialLikes = Number(product.likeCount || 0);
  const displayLikes = initialLikes + (isLiked ? 1 : 0);
  const image = product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onIncrement?.(product, currentQuantity);
    onAddToCart?.(product, currentQuantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDecrement?.(id, currentQuantity);
    onAddToCart?.(product, Math.max(0, currentQuantity - 1));
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="group relative flex flex-col h-full bg-white dark:bg-[#18181F] rounded-2xl border border-stone-200/80 dark:border-white/[0.08] hover:border-stone-300 dark:hover:border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:shadow-md dark:hover:shadow-2xl dark:hover:shadow-black/60 transition-all duration-200 overflow-hidden select-none"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-32 sm:h-36 md:h-44 overflow-hidden bg-stone-100 dark:bg-[#121217] shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient Gradient Shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Top Right: Favorite Button with Real Like Count */}
        <button
          type="button"
          onClick={handleToggleLike}
          className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white flex items-center gap-1 transition-all z-10 cursor-pointer active:scale-90"
          aria-label={isLiked ? "Unlike dish" : "Like dish"}
        >
          <Heart 
            className={cn(
              "w-3.5 h-3.5 transition-colors", 
              isLiked ? "fill-[#FF462D] text-[#FF462D]" : "text-white hover:text-[#FF462D]"
            )} 
          />
          {displayLikes > 0 && (
            <span className="text-[10px] font-bold leading-none">{displayLikes}</span>
          )}
        </button>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
        <div>
          {/* Restaurant Name */}
          <div className="text-[11px] sm:text-xs text-stone-500 dark:text-[#94A3B8] font-medium truncate mb-1">
            {restaurant}
          </div>

          {/* Dish Title */}
          <h3 className="font-heading font-bold text-xs sm:text-sm md:text-base text-stone-900 dark:text-white line-clamp-1 group-hover:text-[#FF462D] dark:group-hover:text-[#FF6B4A] transition-colors mb-1">
            {name}
          </h3>

          {/* Dish Description from Backend */}
          {description ? (
            <p className="text-[11px] sm:text-xs text-stone-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
              {description}
            </p>
          ) : (
            <div className="h-3 mb-3" />
          )}
        </div>

        {/* Bottom Price & Add Action */}
        <div className="pt-2 border-t border-stone-100 dark:border-white/[0.06] flex items-center justify-between gap-2 mt-auto">
          {/* Real Price Tag */}
          <div className="flex flex-col">
            <span className="text-sm sm:text-base md:text-lg font-extrabold text-stone-900 dark:text-white leading-tight">
              ₹{price}
            </span>
          </div>

          {/* Interactive ADD / +/- Quantity Button */}
          <div className="shrink-0">
            {currentQuantity === 0 ? (
              <button
                type="button"
                onClick={handleIncrement}
                className="flex items-center gap-1 px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#FF462D]/10 to-[#FF6B4A]/10 hover:from-[#FF462D] hover:to-[#FF6B4A] text-[#FF462D] hover:text-white border border-[#FF462D]/30 hover:border-transparent text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:shadow-[#FF462D]/30 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div
                className="flex items-center rounded-xl bg-[#FF462D] text-white h-7 px-1.5 shadow-md shadow-[#FF462D]/40 gap-1.5 border border-[#FF6B4A]/50"
              >
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </button>
                <span className="font-bold text-[11px] sm:text-xs min-w-3 sm:min-w-4 text-center">{currentQuantity}</span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FoodCard;
