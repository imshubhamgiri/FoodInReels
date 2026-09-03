import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, 
  ShieldAlert, 
  ChefHat, 
  UtensilsCrossed, 
  Store, 
  Video, 
  CheckCircle2, 
  Tv, 
  Link2, 
  Flame, 
  ArrowRight, 
  LogIn, 
  ExternalLink,
  Sparkles,
  BadgeCheck,
  Compass
} from 'lucide-react';
import { CulinaryCameraLockIllustration } from './CulinaryCameraLockIllustration';

export interface UploadAccessFallbackProps {
  onApply?: () => void;
  onSignIn?: () => void;
  onClose?: () => void;
  className?: string;
  isModal?: boolean;
}

export const UploadAccessFallback: React.FC<UploadAccessFallbackProps> = ({
  onApply,
  onSignIn,
  onClose,
  className = '',
  isModal = false
}) => {
  const navigate = useNavigate();

  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      navigate('/partner/register');
      onClose?.();
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
    } else {
      navigate('/partner/login');
      onClose?.();
    }
  };

  return (
    <div
      className={`w-full max-w-2xl mx-auto space-y-5 sm:space-y-6 text-slate-900 dark:text-slate-100 selection:bg-[#EA580C]/20 ${className}`}
    >
      {/* 1. Ambient Culinary Lock Hero Card with Glasmorphic Black & Midnight Blue */}
      <div className="relative w-full rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-[#0A0E1A]/85 backdrop-blur-2xl shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/70">
        
        {/* Layered Radial Atmosphere: Fiery Terracotta + Deep Midnight Blue + Saffron Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-b from-[#EA580C]/20 via-[#F59E0B]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#1E3A8A]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#0284C7]/15 blur-3xl pointer-events-none" />

        {/* Route Breadcrumb & Status Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 dark:bg-[#131B2E]/90 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold shadow-xs">
            <Lock className="w-3.5 h-3.5 text-[#EA580C] dark:text-[#F59E0B]" />
            <span>/partner/upload</span>
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/10 dark:bg-rose-950/40 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[11px] font-bold tracking-wider uppercase">
            <ShieldAlert className="w-3 h-3" />
            <span>Restricted Access</span>
          </span>
        </div>

        {/* Centerpiece Vector Illustration with Orbit Rings */}
        <div className="relative z-10 my-1 sm:my-2 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative"
          >
            <CulinaryCameraLockIllustration className="w-44 h-40 sm:w-56 sm:h-48 drop-shadow-[0_12px_24px_rgba(234,88,12,0.25)]" />
          </motion.div>
        </div>

        {/* Title & Statement */}
        <div className="relative z-10 mt-2 space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-[#F59E0B] text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" />
            <span>Creator Studio Upload</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
            Exclusive Partner Feature
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Uploading short-form food reels, culinary stories, and masterclasses is reserved for verified culinary partners, executive chefs, artisan bakers, and registered kitchens.
          </p>
        </div>

      </div>

      {/* 2. Eligible Partner Tiers & Privileges */}
      <div className="relative w-full rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/[0.08] bg-white/70 dark:bg-[#0D1220]/80 backdrop-blur-xl shadow-lg dark:shadow-black/50 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-200/60 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#EA580C] to-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-[#EA580C]/30">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white">
                Eligible Partner Tiers
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified culinary professionals</p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-[#EA580C]/10 dark:from-amber-500/20 dark:to-[#EA580C]/20 text-amber-700 dark:text-[#F59E0B] border border-amber-500/30">
            Tier 1 &amp; 2 Only
          </span>
        </div>

        {/* 4-Card Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Executive Chefs */}
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111827]/70 hover:bg-slate-100/90 dark:hover:bg-[#172138] border border-slate-200/80 dark:border-white/[0.06] hover:border-[#EA580C]/40 transition-all duration-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-[#EA580C] dark:text-[#FB923C] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Executive Chefs
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Fine dining &amp; pop-ups
              </p>
            </div>
          </div>

          {/* Artisan Bakers */}
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111827]/70 hover:bg-slate-100/90 dark:hover:bg-[#172138] border border-slate-200/80 dark:border-white/[0.06] hover:border-[#F59E0B]/40 transition-all duration-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-[#F59E0B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Artisan Bakers
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Craft &amp; micro-patisserie
              </p>
            </div>
          </div>

          {/* Food Establishments */}
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111827]/70 hover:bg-slate-100/90 dark:hover:bg-[#172138] border border-slate-200/80 dark:border-white/[0.06] hover:border-sky-500/40 transition-all duration-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Store className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Food Establishments
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Licensed kitchens &amp; bistros
              </p>
            </div>
          </div>

          {/* Culinary Creators */}
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111827]/70 hover:bg-slate-100/90 dark:hover:bg-[#172138] border border-slate-200/80 dark:border-white/[0.06] hover:border-indigo-500/40 transition-all duration-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Culinary Creators
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Verified tasting editors
              </p>
            </div>
          </div>
        </div>

        {/* Micro Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Verified Checkmark</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/25 text-sky-800 dark:text-sky-300 text-xs font-semibold">
            <Tv className="w-3.5 h-3.5 text-sky-500" />
            <span>4K Ultra HD Streaming</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <Link2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Direct Booking Links</span>
          </span>
        </div>
      </div>

      {/* 3. Section 2: The Purpose & Local Reach */}
      <div className="relative w-full rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-white/[0.08] bg-white/70 dark:bg-[#0D1220]/80 backdrop-blur-xl shadow-lg dark:shadow-black/50 space-y-4 overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EA580C]/20 to-[#F59E0B]/20 border border-[#EA580C]/30 text-[#EA580C] dark:text-[#FB923C] flex items-center justify-center shrink-0 mt-0.5">
            <Flame className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-bold font-heading text-slate-900 dark:text-white leading-snug">
              Broadcast Real-Time Culinary Creations to Hungry Locals
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Showcase live pan sizzles, daily kitchen specials, technique masterclasses, and fresh tasting menus. Your posts reach local diners within your immediate delivery and dining radius in real time.
            </p>
          </div>
        </div>

        {/* High-Impact Metrics Grid with Cool Midnight Blue & Saffron Accents */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 text-center">
          <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111827]/70 border border-slate-200/70 dark:border-white/[0.05] flex flex-col items-center justify-center">
            <span className="text-lg sm:text-xl font-black text-[#EA580C] dark:text-[#FB923C] font-heading">
              3.4x
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Foot Traffic
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111827]/70 border border-slate-200/70 dark:border-white/[0.05] flex flex-col items-center justify-center">
            <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-[#F59E0B] font-heading">
              1-Tap
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Menu Links
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111827]/70 border border-slate-200/70 dark:border-white/[0.05] flex flex-col items-center justify-center">
            <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400 font-heading">
              15km
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Local Radius
            </span>
          </div>
        </div>
      </div>

      {/* 4. Interactive Action Suite */}
      <div className="w-full space-y-3 pt-1 pb-2">
        {/* Primary CTA: Apply for Partner Account */}
        <button
          onClick={handleApply}
          type="button"
          className="w-full h-12 sm:h-13 rounded-2xl bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#D97706] hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#EA580C]/25 transition-all duration-200 cursor-pointer border border-amber-300/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>Apply for a Partner Account</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Secondary CTA: Sign in if already a partner */}
        <button
          onClick={handleSignIn}
          type="button"
          className="w-full h-11 sm:h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#131B2E]/90 dark:hover:bg-[#1A253E] active:scale-[0.99] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>Already a Partner? Sign In</span>
        </button>

        {/* Tertiary Info Link */}
        <div className="text-center pt-1">
          <a
            href="#partner-guidelines"
            onClick={(e) => {
              e.preventDefault();
              navigate('/partner/register');
              onClose?.();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#EA580C] dark:hover:text-[#F59E0B] transition-colors"
          >
            <span>Learn more about Creator Partner Program &amp; Guidelines</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default UploadAccessFallback;

