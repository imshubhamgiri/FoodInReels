import * as React from 'react';
import { useState } from 'react';
import { 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  ArrowRight, 
  Play, 
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface SlideItem {
  id: number;
  title: string;
  restaurant: string;
  image: string;
}

const FEATURED_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'Smoked Butter Chicken & Garlic Naan',
    restaurant: 'Pind Balluchi Gourmet',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Truffle Mushroom Artisan Pizza',
    restaurant: 'La Pinoz Signature',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Hyderabadi Dum Biryani Feast',
    restaurant: 'Behrouz Royal Kitchen',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Double Smash Cheeseburger & Crispy Fries',
    restaurant: 'The Burger Club',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
  }
];

export const PromoBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const couponCode = 'FREEDOM';

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? FEATURED_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
  };

  const activeSlide = FEATURED_SLIDES[currentSlide];

  return (
    <section className="relative py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Container */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#18181F] border border-stone-200/90 dark:border-white/[0.09] shadow-[0_4px_25px_rgba(0,0,0,0.04)] dark:shadow-2xl p-6 sm:p-8 lg:p-10 transition-colors duration-200">
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines, Promo Code & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-5 md:space-y-6">
              
              {/* Offer Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF462D]/10 to-[#FFB703]/10 dark:from-[#FF462D]/20 dark:to-[#FFB703]/20 border border-[#FF462D]/25 dark:border-[#FF462D]/30 text-xs font-semibold text-stone-800 dark:text-white shadow-xs">
                <Flame className="w-4 h-4 text-[#FF462D]" />
                <span>Curated Gourmet Specials</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-stone-900 dark:text-white tracking-tight leading-[1.1]">
                  Crave It. <span className="gradient-text-coral">Watch It.</span> <br />
                  <span className="gradient-text-gold">Taste It.</span>
                </h1>
                <p className="text-stone-600 dark:text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed">
                  Discover mouthwatering dishes through authentic video reels. Fresh meals prepared by top artisanal kitchens.
                </p>
              </div>

              {/* Coupon Code Section */}
              <div className="w-full max-w-md p-3.5 rounded-2xl bg-[#FAFAF9] dark:bg-[#121217]/80 border border-dashed border-[#FFB703]/60 dark:border-[#FFB703]/40 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFB703]/15 flex items-center justify-center text-[#D97706] dark:text-[#FFB703] shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400 font-medium">Use promo coupon code:</div>
                    <div className="font-mono font-bold text-base text-[#D97706] dark:text-[#FFB703] tracking-widest flex items-center gap-1.5">
                      {couponCode}
                      <span className="text-[10px] font-sans font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Free Delivery</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCopyCoupon}
                  variant={isCopied ? 'glass' : 'gold'}
                  size="sm"
                  className="w-full sm:w-auto shrink-0 font-semibold"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a href="#trending-feed">
                  <Button variant="default" size="lg" className="shadow-lg shadow-[#FF462D]/25">
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Link to="/reel">
                  <Button variant="glass" size="lg" className="border-stone-300 dark:border-white/20 text-stone-800 dark:text-white hover:bg-stone-100 dark:hover:bg-white/10 shadow-xs">
                    <Play className="w-4 h-4 text-[#FF462D] fill-[#FF462D]" />
                    <span>Watch Food Reels</span>
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Column: Featured Dish Showcase Slider */}
            <div className="lg:col-span-5 relative w-full h-[300px] sm:h-[360px] rounded-2xl overflow-hidden border border-stone-200/80 dark:border-white/10 group shadow-lg">
              
              <div className="relative w-full h-full">
                {/* Dish Image */}
                <img
                  key={activeSlide.id}
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  loading="lazy"
                />

                {/* Gradient Overlay for Readable Text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 text-stone-900 dark:text-white text-xs font-bold tracking-wide uppercase shadow-sm">
                    Chef's Special
                  </span>
                </div>

                {/* Bottom Dish Details */}
                <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                  <div className="text-xs text-[#FFB703] font-semibold">
                    {activeSlide.restaurant}
                  </div>
                  
                  <h2 className="text-base sm:text-lg font-bold font-heading text-white line-clamp-1">
                    {activeSlide.title}
                  </h2>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 cursor-pointer active:scale-95"
                aria-label="Previous featured dish"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 cursor-pointer active:scale-95"
                aria-label="Next featured dish"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {FEATURED_SLIDES.map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-200 cursor-pointer",
                      idx === currentSlide 
                        ? "w-6 bg-[#FF462D]" 
                        : "w-1.5 bg-white/50 hover:bg-white/80"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default PromoBanner;
