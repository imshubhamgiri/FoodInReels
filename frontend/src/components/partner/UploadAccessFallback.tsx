import * as React from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowRight, 
  LogIn, 
  ExternalLink,
  Sparkles,
  BadgeCheck
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
      className={`w-full max-w-2xl mx-auto space-y-4 sm:space-y-5 text-slate-900 dark:text-slate-100 ${className}`}
    >
      {/* 1. Hero Card: Clean Paper White (Light) & Midnight Slate with Sky Blue (Dark) */}
      <div className="relative w-full rounded-3xl p-5 sm:p-7 flex flex-col items-center text-center overflow-hidden bg-white dark:bg-[#0C121E] border border-slate-200/80 dark:border-sky-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.7)] transition-colors">
        
        {/* Subtle Ambient Radial Highlight for Dark Mode (GPU-lightweight) */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-44 rounded-full bg-gradient-to-b from-sky-500/10 via-blue-500/5 to-transparent pointer-events-none hidden dark:block" />

        {/* Route Breadcrumb & Status Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#142036] border border-slate-200 dark:border-sky-500/20 text-slate-700 dark:text-sky-300 font-mono text-xs font-semibold shadow-xs">
            <Lock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>/partner/upload</span>
          </span>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-500/15 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-[11px] font-bold tracking-wider uppercase">
            <ShieldAlert className="w-3 h-3 text-sky-500" />
            <span>Partner Access Only</span>
          </span>
        </div>

        {/* Centerpiece Vector Illustration */}
        <div className="relative z-10 my-1 flex items-center justify-center">
          <CulinaryCameraLockIllustration className="w-40 h-36 sm:w-48 sm:h-40" />
        </div>

        {/* Title & Statement */}
        <div className="relative z-10 mt-1 space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-100 dark:bg-sky-500/10 border border-slate-200 dark:border-sky-500/20 text-slate-700 dark:text-sky-300 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>Creator Studio Upload</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
            Exclusive Partner Feature
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Uploading short-form food reels and kitchen stories is reserved for verified culinary partners, executive chefs, artisan bakers, and registered kitchens.
          </p>
        </div>

      </div>

      {/* 2. Eligible Partner Tiers & Privileges Card */}
      <div className="relative w-full rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0C121E] border border-slate-200/80 dark:border-sky-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.03),0_8px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] space-y-4 transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
              <BadgeCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-heading text-slate-900 dark:text-white">
                Eligible Partner Tiers
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Verified culinary professionals</p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-sky-500/15 text-slate-700 dark:text-sky-300 border border-slate-200 dark:border-sky-500/30">
            Tier 1 &amp; 2 Verified
          </span>
        </div>

        {/* 4-Card Roles Grid: Paper Elevation in Light, Deep Midnight Blue in Dark */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Executive Chefs */}
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111A2E] hover:bg-slate-100/90 dark:hover:bg-[#16223B] border border-slate-200/70 dark:border-sky-500/15 hover:border-sky-400/40 transition-all duration-200 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Executive Chefs
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Fine dining &amp; masterclasses
              </p>
            </div>
          </div>

          {/* Artisan Bakers */}
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111A2E] hover:bg-slate-100/90 dark:hover:bg-[#16223B] border border-slate-200/70 dark:border-sky-500/15 hover:border-sky-400/40 transition-all duration-200 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                Artisan Bakers
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Craft patisseries &amp; bakeries
              </p>
            </div>
          </div>

          {/* Food Establishments */}
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111A2E] hover:bg-slate-100/90 dark:hover:bg-[#16223B] border border-slate-200/70 dark:border-sky-500/15 hover:border-sky-400/40 transition-all duration-200 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
          <div className="group p-3 rounded-2xl bg-slate-50/80 dark:bg-[#111A2E] hover:bg-slate-100/90 dark:hover:bg-[#16223B] border border-slate-200/70 dark:border-sky-500/15 hover:border-sky-400/40 transition-all duration-200 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#111A2E] border border-slate-200 dark:border-sky-500/20 text-slate-700 dark:text-sky-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
            <span>Verified Checkmark</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#111A2E] border border-slate-200 dark:border-sky-500/20 text-slate-700 dark:text-sky-300 text-xs font-semibold">
            <Tv className="w-3.5 h-3.5 text-cyan-500" />
            <span>4K Video Streaming</span>
          </span>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#111A2E] border border-slate-200 dark:border-sky-500/20 text-slate-700 dark:text-sky-300 text-xs font-semibold">
            <Link2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Direct Ordering Links</span>
          </span>
        </div>
      </div>

      {/* 3. Purpose & Local Reach Metrics */}
      <div className="relative w-full rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#0C121E] border border-slate-200/80 dark:border-sky-500/20 shadow-[0_2px_8px_rgba(0,0,0,0.03),0_8px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] space-y-3.5 transition-colors">
        <div className="space-y-1">
          <h3 className="text-xs sm:text-sm font-bold font-heading text-slate-900 dark:text-white leading-snug">
            Broadcast Real-Time Culinary Reels to Local Diners
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Showcase live kitchen specials, secret sauces, and behind-the-scenes techniques. Your reels reach hungry diners in your delivery radius in real time.
          </p>
        </div>

        {/* High-Impact Metrics Grid: Minimal Paper Cards in Light, Deep Blue in Dark */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200/70 dark:border-sky-500/15 flex flex-col items-center justify-center shadow-xs">
            <span className="text-lg sm:text-xl font-black text-sky-600 dark:text-sky-400 font-heading">
              3.4x
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Foot Traffic
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200/70 dark:border-sky-500/15 flex flex-col items-center justify-center shadow-xs">
            <span className="text-lg sm:text-xl font-black text-cyan-600 dark:text-cyan-400 font-heading">
              1-Tap
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Menu Links
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200/70 dark:border-sky-500/15 flex flex-col items-center justify-center shadow-xs">
            <span className="text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400 font-heading">
              15km
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Local Radius
            </span>
          </div>
        </div>
      </div>

      {/* 4. Action Suite (CTAs) */}
      <div className="w-full space-y-2.5 pt-1 pb-1">
        {/* Primary CTA: Clean Dark/Sky Button in Light Mode, Radiant Sky-Blue in Dark Mode */}
        <button
          onClick={handleApply}
          type="button"
          className="w-full h-11 sm:h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-gradient-to-r dark:from-sky-500 dark:via-blue-600 dark:to-indigo-600 dark:hover:brightness-110 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md dark:shadow-sky-500/20 transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Apply for a Partner Account</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        {/* Secondary CTA: Sign in if already a partner */}
        <button
          onClick={handleSignIn}
          type="button"
          className="w-full h-10 sm:h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-[#111A2E] dark:hover:bg-[#16223B] active:scale-[0.99] border border-slate-200 dark:border-sky-500/20 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5 text-slate-500 dark:text-sky-400" />
          <span>Already a Partner? Sign In</span>
        </button>

        {/* Tertiary Info Link */}
        <div className="text-center pt-0.5">
          <a
            href="#partner-guidelines"
            onClick={(e) => {
              e.preventDefault();
              navigate('/partner/register');
              onClose?.();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
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
