import * as React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Zap, 
  Heart, 
  Plus, 
  Minus
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';

export interface FoodProduct {
  _id?: string | number;
  id?: string | number;
  name: string;
  restaurant?: string;
  restaurantName?: string;
  foodPartner?: {
    restaurantName?: string;
    name?: string;
  };
  price: number;
  originalPrice?: number;
  rating?: number;
  likeCount?: number;
  deliveryTime?: string;
  image?: string;
  tags?: string[];
  isVeg?: boolean;
  category?: string;
}

interface FoodCardProps {
  product: FoodProduct;
  onAddToCart?: (product: FoodProduct, quantity: number) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ product, onAddToCart }) => {
  const { Cart, setCart } = useAppContext() || {};
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const id = product._id || product.id || product.name;
  const name = product.name || 'Gourmet Specialty';
  const restaurant = product.restaurant || product.restaurantName || product.foodPartner?.restaurantName || 'Artisan Kitchen';
  const price = Number(product.price || 199);
  const originalPrice = product.originalPrice || price + 60;
  const rating = product.rating || 4.6;
  const deliveryTime = product.deliveryTime || '25-30 min';
  const image = product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const isVeg = product.isVeg !== undefined ? product.isVeg : (tags.some(t => t.toLowerCase().includes('veg') && !t.toLowerCase().includes('non')));

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQty = quantity + 1;
    setQuantity(newQty);
    onAddToCart?.(product, newQty);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newQty = Math.max(0, quantity - 1);
    setQuantity(newQty);
    onAddToCart?.(product, newQty);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="group relative flex flex-col h-full bg-[#18181F] rounded-2xl border border-white/[0.08] hover:border-white/20 shadow-md hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 overflow-hidden select-none"
    >
      {/* Top Image Container */}
      <div className="relative w-full h-28 xs:h-32 sm:h-36 md:h-44 overflow-hidden bg-[#121217] shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          loading="lazy"
        />

        {/* Ambient Gradient Shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18181F] via-transparent to-black/30 pointer-events-none" />

        {/* Top Left: Veg Indicator & Tag */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5 z-10">
          <Badge variant={isVeg ? 'veg' : 'nonveg'} />
          
          {tags.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-black/60 backdrop-blur-md text-[#FFB703] border border-[#FFB703]/30 shadow-xs line-clamp-1 max-w-[90px]">
              {tags[0]}
            </span>
          )}
        </div>

        {/* Top Right: Favorite Button */}
        <button
          onClick={handleToggleLike}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all z-10 cursor-pointer active:scale-90"
          aria-label={isLiked ? "Unlike dish" : "Like dish"}
        >
          <Heart 
            className={cn(
              "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors", 
              isLiked ? "fill-[#FF462D] text-[#FF462D]" : "text-white hover:text-[#FF462D]"
            )} 
          />
        </button>

        {/* Bottom Right: Rating Badge */}
        <div className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs text-white">
          <Star className="w-3 h-3 text-[#FFB703] fill-[#FFB703]" />
          <span className="font-bold">{rating}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between">
        
        <div>
          {/* Restaurant & Free Delivery Tag */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-[#94A3B8] font-medium mb-1 gap-1">
            <span className="truncate max-w-[130px] sm:max-w-[160px]">{restaurant}</span>
            <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] text-emerald-400 font-semibold shrink-0">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />
              Free
            </span>
          </div>

          {/* Dish Title */}
          <h3 className="font-heading font-bold text-xs sm:text-sm md:text-base text-white line-clamp-1 group-hover:text-[#FF6B4A] transition-colors mb-1.5">
            {name}
          </h3>

          {/* Delivery Estimate */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 mb-3">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>{deliveryTime}</span>
          </div>
        </div>

        {/* Bottom Price & Add Action */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
          
          {/* Price Tag */}
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-[11px] text-slate-500 line-through">₹{originalPrice}</span>
            <span className="text-sm sm:text-base md:text-lg font-extrabold text-white leading-tight">₹{price}</span>
          </div>

          {/* Interactive ADD / +/- Quantity Button */}
          <div className="shrink-0">
            {quantity === 0 ? (
              <button
                onClick={handleIncrement}
                className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-[#FF462D]/15 to-[#FF6B4A]/15 hover:from-[#FF462D] hover:to-[#FF6B4A] text-[#FF6B4A] hover:text-white border border-[#FF462D]/40 hover:border-transparent text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:shadow-[#FF462D]/30 active:scale-95"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>ADD</span>
              </button>
            ) : (
              <div
                className="flex items-center rounded-xl bg-[#FF462D] text-white h-7 px-1.5 shadow-md shadow-[#FF462D]/40 gap-1.5 border border-[#FF6B4A]/50"
              >
                <button
                  onClick={handleDecrement}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-black/20 hover:bg-black/40 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                </button>
                <span className="font-bold text-[11px] sm:text-xs min-w-3 sm:min-w-4 text-center">{quantity}</span>
                <button
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
};

export default FoodCard;
