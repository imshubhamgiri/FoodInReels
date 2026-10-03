import * as React from 'react';
import { useEffect, useState } from 'react';
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
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* 1. Backdrop: Pure GPU Alpha fade without expensive full-screen blur */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/65 dark:bg-black/80 transition-opacity duration-150 ease-out cursor-pointer ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* 2. Modal Card: Hardware-accelerated CSS transform on GPU compositor */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-[#0B0F19] border border-slate-200/90 dark:border-sky-500/20 shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-white transition-all duration-150 ease-out transform-gpu ${
          isVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-3'
        }`}
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

        {/* Lightweight Clean Partner View */}
        <UploadAccessFallback onClose={onClose} isModal />
      </div>
    </div>
  );
};

export default UploadFoodReelModal;
