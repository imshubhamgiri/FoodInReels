import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  ArrowRight, 
  Play, 
  Clock, 
  Star,
  Tag,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface SlideItem {
  id: number;
  title: string;
  restaurant: string;
  rating: number;
  time: string;
  discount: string;
  image: string;
}

const FEATURED_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'Smoked Butter Chicken & Garlic Naan',
    restaurant: 'Pind Balluchi Gourmet',
    rating: 4.8,
    time: '25-30 min',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Truffle Mushroom Artisan Pizza',
    restaurant: 'La Pinoz Signature',
    rating: 4.9,
    time: '20-25 min',
    discount: '40% OFF',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Hyderabadi Dum Biryani Feast',
    restaurant: 'Behrouz Royal Kitchen',
    rating: 4.7,
    time: '30-35 min',
    discount: 'FLAT ₹150 OFF',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 4,
    title: 'Double Smash Cheeseburger & Crispy Fries',
    restaurant: 'The Burger Club',
    rating: 4.6,
    time: '15-20 min',
    discount: 'BUY 1 GET 1',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
  }
];

export const PromoBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const couponCode = 'FREEDOM';

  // Auto-slide every 5 seconds unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered]);

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
        
        {/* Main Banner Container with Dual-Tone Glowing Background */}
        <div 
          className="relative overflow-hidden rounded-3xl bg-[#18181F] border border-white/[0.09] shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#FF462D]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FFB703]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines, Promo Code & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-5 md:space-y-6">
              
              {/* Offer Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF462D]/20 to-[#FFB703]/20 border border-[#FF462D]/30 text-xs font-semibold text-white shadow-sm">
                <Flame className="w-4 h-4 text-[#FF462D] animate-bounce" />
                <span>Midnight Feasts & Gourmet Treats</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFB703]"></span>
                <span className="text-[#FFB703]">Up to 50% Off</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.1]">
                  Crave It. <span className="gradient-text-coral">Watch It.</span> <br />
                  <span className="gradient-text-gold">Taste It.</span>
                </h1>
                <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-normal leading-relaxed">
                  Discover mouthwatering dishes through authentic video reels. Get ultra-fast delivery and ₹150 off on your first gourmet order.
                </p>
              </div>

              {/* Coupon Code Section */}
              <div className="w-full max-w-md p-3.5 rounded-2xl bg-[#121217]/80 border border-dashed border-[#FFB703]/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFB703]/15 flex items-center justify-center text-[#FFB703] shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">Use promo coupon code:</div>
                    <div className="font-mono font-bold text-base text-[#FFB703] tracking-widest flex items-center gap-1.5">
                      {couponCode}
                      <span className="text-[10px] font-sans font-normal text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Free Delivery</span>
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
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
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
                  <Button variant="default" size="lg" className="shadow-xl shadow-[#FF462D]/30">
                    <span>Order Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Link to="/reel">
                  <Button variant="glass" size="lg" className="border-white/20">
                    <Play className="w-4 h-4 text-[#FF462D] fill-[#FF462D]" />
                    <span>Watch Food Reels</span>
                  </Button>
                </Link>
              </div>

            </div>

            {/* Right Column: Featured Dish Showcase Slider */}
            <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-white/10 group shadow-2xl">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full"
                >
                  {/* Dish Image */}
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay for Readable Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-[#0D0D11]/40 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-[#FF462D] text-white text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-[#FF462D]/40">
                      {activeSlide.discount}
                    </span>
                    
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
                      <Star className="w-3.5 h-3.5 text-[#FFB703] fill-[#FFB703]" />
                      <span className="font-bold">{activeSlide.rating}</span>
                    </div>
                  </div>

                  {/* Bottom Dish Details */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>{activeSlide.time}</span>
                      <span>•</span>
                      <span className="text-[#FFB703] font-medium">{activeSlide.restaurant}</span>
                    </div>
                    
                    <h2 className="text-lg sm:text-xl font-bold font-heading text-white line-clamp-1">
                      {activeSlide.title}
                    </h2>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 cursor-pointer"
                aria-label="Previous featured dish"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-20 cursor-pointer"
                aria-label="Next featured dish"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Pagination Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {FEATURED_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                      idx === currentSlide 
                        ? "w-6 bg-[#FF462D]" 
                        : "w-1.5 bg-white/40 hover:bg-white/70"
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

