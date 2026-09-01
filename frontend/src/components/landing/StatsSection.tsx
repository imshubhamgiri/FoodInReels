import * as React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Clock, Film, Star } from 'lucide-react';

const STATS = [
  {
    icon: Utensils,
    value: '500+',
    label: 'Partner Kitchens',
    sublabel: 'Verified hygiene standards',
    color: 'text-[#FF462D]'
  },
  {
    icon: Clock,
    value: '28 min',
    label: 'Avg Delivery Speed',
    sublabel: 'Thermal-insulated dispatch',
    color: 'text-[#10B981]'
  },
  {
    icon: Film,
    value: '100k+',
    label: 'Reels Watched Daily',
    sublabel: 'Authentic foodie community',
    color: 'text-[#FFB703]'
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'App Store Rating',
    sublabel: 'Over 50,000+ reviews',
    color: 'text-[#FF6B4A]'
  }
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-10 bg-[#121217] border-y border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, idx) => {
            const IconComp = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl bg-[#18181F]/50 border border-white/[0.04]"
              >
                <div className={`w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 ${stat.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold font-heading text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-300">
                    {stat.label}
                  </div>
                  <div className="text-[10px] text-slate-500 hidden sm:block">
                    {stat.sublabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

