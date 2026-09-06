import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';

interface LogoutLoaderProps {
  isOpen?: boolean;
  message?: string;
  subMessage?: string;
}

export const LogoutLoader: React.FC<LogoutLoaderProps> = ({
  isOpen = true,
  message = "Signing Out...",
  subMessage = "Closing your session and taking you back home..."
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 select-none"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative max-w-xs sm:max-w-sm w-full mx-4 rounded-3xl border border-white/15 bg-[#121218]/90 backdrop-blur-2xl p-8 shadow-2xl shadow-black/80 overflow-hidden flex flex-col items-center text-center"
        >
          {/* Ambient Glassmorphic Background Glow Blobs */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#FF462D]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Spinner & Logout Icon Container */}
          <div className="relative mb-6 flex items-center justify-center">
            {/* Outer Glowing Ring */}
            <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-inner">
              <LogOut className="w-6 h-6 text-[#FF6B4A] animate-pulse" />
            </div>

            {/* Rotating gradient accent spinner */}
            <svg
              className="absolute w-20 h-20 -inset-2 animate-spin text-[#FF462D]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-20 text-white"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>

          {/* Text Information */}
          <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
            {message}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-[240px]">
            {subMessage}
          </p>

          {/* Subtle animated progress track */}
          <div className="w-36 h-1 bg-white/10 rounded-full overflow-hidden mt-6 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF462D] via-[#FFB703] to-[#FF462D] rounded-full w-1/2"
              animate={{
                x: [-100, 160],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LogoutLoader;

