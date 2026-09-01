import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Film, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Bike,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { Card } from '../ui/Card';

const FEATURES = [
  {
    step: '01',
    icon: UtensilsCrossed,
    iconGlow: 'bg-[#FF462D]/15 text-[#FF462D] border-[#FF462D]/30 shadow-[#FF462D]/20',
    title: 'Curated Culinary Network',
    description: 'We partner only with top-rated, hygiene-inspected restaurants, artisanal cloud kitchens, and gourmet bistros in your city.',
    highlight: '500+ Verified Partners'
  },
  {
    step: '02',
    icon: Film,
    iconGlow: 'bg-[#FFB703]/15 text-[#FFB703] border-[#FFB703]/30 shadow-[#FFB703]/20',
    title: 'Visual Reel-First Ordering',
    description: 'Watch the chef sauté, flame-grill, and plate your dish in crystal-clear reels. Tap once on any video to order instantly.',
    highlight: 'Zero Guesswork'
  },
  {
    step: '03',
    icon: Zap,
    iconGlow: 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30 shadow-[#10B981]/20',
    title: '30-Min Express Hot Delivery',
    description: 'Thermal-sealed, spill-proof packaging dispatched with dedicated delivery partners and live hyper-accurate GPS tracking.',
    highlight: 'Insulated & Fresh'
  }
];

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#0D0D11] relative overflow-hidden border-t border-white/[0.05]">
      {/* Subtle Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF462D]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FF462D]/10 border border-[#FF462D]/25 text-xs font-semibold text-[#FF6B4A]">
            <Sparkles className="w-3.5 h-3.5 text-[#FFB703]" />
            <span>The FoodInReels Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
            Why Foodies <span className="gradient-text-coral">Choose Us</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Every order is backed by culinary craftsmanship, interactive video discovery, and rapid delivery.
          </p>
        </div>

        {/* 3 Column Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {FEATURES.map((feature, idx) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card 
                  hoverEffect 
                  className="relative p-6 sm:p-8 flex flex-col h-full bg-[#18181F] border border-white/[0.08] hover:border-white/20 group"
                >
                  {/* Step Number Watermark */}
                  <span className="absolute top-5 right-6 text-4xl font-extrabold font-heading text-white/[0.04] group-hover:text-white/[0.08] transition-colors">
                    {feature.step}
                  </span>

                  {/* Icon Container with Soft Glow */}
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110 ${feature.iconGlow}`}>
                    <IconComponent className="w-7 h-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-heading text-white mb-3 group-hover:text-[#FF6B4A] transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
                    {feature.description}
                  </p>

                  {/* Highlight Chip */}
                  <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs font-semibold text-slate-300">{feature.highlight}</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FeaturesGrid;

