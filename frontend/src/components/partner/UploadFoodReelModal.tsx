import * as React from 'react';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { UploadAccessFallback } from './UploadAccessFallback';

export interface UploadFoodReelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadFoodReelModal: React.FC<UploadFoodReelModalProps> = ({
  isOpen,
  onClose
}) => {
  // Close on Escape key and handle scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Lightweight Smooth Dimming Backdrop (Subtle 2px blur instead of 24px) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Modal Dialog Card:
              - Light Mode: Pure Paper White with layered soft shadows
              - Dark Mode: Deep Midnight with cool Sky-Blue border & shadow
              - GPU Transition: Smooth cubic-bezier without frame-dropping spring physics
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-sky-500/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_0_1px_1px_rgba(0,0,0,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.06)] p-4 sm:p-6 text-slate-900 dark:text-white"
          >
            {/* Top Close Button */}
            <div className="flex items-center justify-end pb-1">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-sky-300 hover:bg-slate-100 dark:hover:bg-sky-500/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Fallback View with Features and CTAs to Join/Sign In */}
            <UploadAccessFallback onClose={onClose} isModal />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UploadFoodReelModal;
