import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  LogIn, 
  UtensilsCrossed, 
  CheckCircle2, 
  Tv, 
  Link2 
} from 'lucide-react';

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
  className = ''
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
    <div className={`w-full max-w-lg mx-auto text-slate-900 dark:text-slate-100 ${className}`}>
      
      {/* Center Icon & Badge */}
      <div className="flex flex-col items-center text-center space-y-3 pt-2 pb-4">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-br from-[#FF462D]/10 to-[#FFB703]/10 dark:from-sky-500/15 dark:to-blue-600/15 border border-[#FF462D]/20 dark:border-sky-500/30 flex items-center justify-center text-[#FF462D] dark:text-sky-400 shadow-sm">
          <UtensilsCrossed className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF462D]/10 dark:bg-sky-500/10 border border-[#FF462D]/20 dark:border-sky-500/20 text-[#FF462D] dark:text-sky-300 text-xs font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Creator Studio Access</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
          Exclusive Partner Feature
        </h2>

        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed max-w-sm">
          Uploading short-form food reels and kitchen stories is reserved for verified culinary partners, executive chefs, and registered kitchens.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-200/80 dark:border-white/[0.08] my-2">
        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03]">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Verified Badge</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Trust mark</span>
        </div>

        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03]">
          <Tv className="w-4 h-4 text-sky-500 mb-1" />
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">4K Live Reels</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">High-bitrate</span>
        </div>

        <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 dark:bg-white/[0.03]">
          <Link2 className="w-4 h-4 text-amber-500 mb-1" />
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">1-Tap Order</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Direct sales</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-3">
        <button
          onClick={handleApply}
          type="button"
          className="w-full h-11 sm:h-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-gradient-to-r dark:from-sky-500 dark:to-blue-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400 dark:text-white" />
          <span>Apply for Partner Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleSignIn}
          type="button"
          className="w-full h-10 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#151D2E] dark:hover:bg-[#1C273D] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <LogIn className="w-4 h-4 text-slate-600 dark:text-sky-400" />
          <span>Already a Partner? Sign In</span>
        </button>
      </div>

    </div>
  );
};

export default UploadAccessFallback;
