import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Heart, 
  Sparkles, 
  Film, 
  ArrowRight, 
  Volume2, 
  Flame, 
  Eye, 
  UtensilsCrossed, 
  CheckCircle2 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const ReelsTeaser: React.FC = () => {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#FF462D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-[#FFB703]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual 3D Tilted Mockup Preview */}
          <div className="lg:col-span-6 flex items-center justify-center relative order-2 lg:order-1">
            
            {/* Background glowing frame */}
            <div className="relative w-full max-w-sm sm:max-w-md h-[440px] flex items-center justify-center">
              
              {/* Back tilted card */}
              <motion.div
                initial={{ opacity: 0, rotate: -8, x: -30 }}
                whileInView={{ opacity: 0.7, rotate: -8, x: -30 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="absolute w-56 sm:w-64 h-80 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#14141B] hidden sm:block"
              >
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
                  alt="Avocado Salmon Bowl"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-bold text-white">Avocado Salmon Bowl</p>
                  <p className="text-[10px] text-[#FFB703]">Green Kitchen</p>
                </div>
              </motion.div>

              {/* Main front focus card */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="relative z-10 w-64 sm:w-72 h-[410px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-black/80 bg-[#18181F] group"
              >
                {/* Reel video/image thumbnail */}
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80"
                  alt="Sizzling Barbeque Skewers"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Shading Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D11] via-black/30 to-black/40" />

                {/* Top Overlay Icons */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-white">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="font-semibold">LIVE REEL</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Center Play Pulse Button */}
                <Link 
                  to="/reel" 
                  className="absolute inset-0 flex items-center justify-center z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FF462D]/90 text-white flex items-center justify-center shadow-xl shadow-[#FF462D]/50 border-2 border-white/40 group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 fill-white ml-1 text-white" />
                  </div>
                </Link>

                {/* Right Floating Like/Comment Column */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 z-10">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#FF462D]">
                      <Heart className="w-4 h-4 fill-[#FF462D]" />
                    </div>
                    <span className="text-[10px] font-bold text-white mt-0.5">2.4k</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/15 flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-0.5">18k</span>
                  </div>
                </div>

                {/* Bottom Reel Dish Tag & Quick Order Button */}
                <div className="absolute bottom-4 left-4 right-4 z-10 space-y-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#FFB703] font-semibold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Barbeque Nation Grill</span>
                    </div>
                    <p className="text-sm font-bold text-white line-clamp-1 font-heading">
                      Peri Peri Char-Grilled Paneer Tikka
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-xs text-slate-400 line-through mr-1.5">₹349</span>
                      <span className="text-base font-extrabold text-white">₹279</span>
                    </div>
                    
                    <Link to="/reel">
                      <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white text-xs font-bold shadow-md shadow-[#FF462D]/30 flex items-center gap-1">
                        Watch <ArrowRight className="w-3 h-3" />
                      </span>
                    </Link>
                  </div>
                </div>

              </motion.div>

              {/* Floating Social Proof Pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 right-2 sm:right-4 z-20 px-4 py-2.5 rounded-2xl bg-[#18181F]/90 backdrop-blur-xl border border-white/15 shadow-xl flex items-center gap-3 text-xs text-white"
              >
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-rose-500 border border-black flex items-center justify-center text-[10px] font-bold">R</div>
                  <div className="w-6 h-6 rounded-full bg-amber-500 border border-black flex items-center justify-center text-[10px] font-bold">S</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border border-black flex items-center justify-center text-[10px] font-bold">A</div>
                </div>
                <div>
                  <div className="font-semibold text-white">10,000+ Foodies</div>
                  <div className="text-[10px] text-slate-400">Discovering dishes live</div>
                </div>
              </motion.div>

            </div>

          </div>

          {/* Right Column: Copy & Feature Highlights */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF462D]/10 border border-[#FF462D]/30 text-xs font-semibold text-[#FF6B4A]">
              <Film className="w-3.5 h-3.5" />
              <span>Video-First Food Experience</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                Stop Guessing. <br />
                <span className="gradient-text-coral">Watch the Sizzle Before Ordering.</span>
              </h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-normal">
                Never get disappointed by static food photos again. Scroll through authentic high-definition kitchen reels, see real portion sizes, and order directly in one tap.
              </p>
            </div>

            {/* Value Bullet Points */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Full HD Video Previews</h4>
                  <p className="text-xs text-slate-400">See the exact dish cooking process, sauces, and cheese pulls.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#FFB703]/15 border border-[#FFB703]/30 flex items-center justify-center text-[#FFB703] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">1-Click Instant Order</h4>
                  <p className="text-xs text-slate-400">Add the exact dish shown in the video to your cart without searching.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-[#FF462D]/15 border border-[#FF462D]/30 flex items-center justify-center text-[#FF6B4A] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Real Community Reviews</h4>
                  <p className="text-xs text-slate-400">Verified taste ratings, spice indicators, and genuine food lover tips.</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link to="/reel">
                <Button variant="default" size="lg" className="shadow-xl shadow-[#FF462D]/30 group">
                  <span>Explore Reel Discovery</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ReelsTeaser;

