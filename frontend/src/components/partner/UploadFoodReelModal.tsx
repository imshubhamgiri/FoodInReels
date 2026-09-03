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
          {/* Glassmorphic Dark Blue & Black Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050811]/75 dark:bg-black/85 backdrop-blur-xl transition-opacity cursor-pointer"
          />

          {/* Modal Dialog Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl shadow-2xl shadow-slate-900/40 dark:shadow-black/90 p-4 sm:p-6 md:p-8 text-slate-900 dark:text-white"
          >
            {/* Top Close Button */}
            <div className="flex items-center justify-end pb-2">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
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
