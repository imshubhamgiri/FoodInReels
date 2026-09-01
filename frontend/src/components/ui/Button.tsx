import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'glass' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white shadow-lg shadow-[#FF462D]/25 hover:shadow-[#FF462D]/40 hover:brightness-110 border border-[#FF6B4A]/40',
  primary: 'bg-gradient-to-r from-[#FF462D] to-[#FF6B4A] text-white shadow-lg shadow-[#FF462D]/25 hover:shadow-[#FF462D]/40 hover:brightness-110 border border-[#FF6B4A]/40',
  gold: 'bg-gradient-to-r from-[#FFB703] to-[#FFA000] text-black font-semibold shadow-lg shadow-[#FFB703]/25 hover:shadow-[#FFB703]/40 hover:brightness-105 border border-[#FFD066]/50',
  secondary: 'bg-[#1E1E27] text-slate-200 hover:bg-[#282834] hover:text-white border border-white/10 shadow-sm',
  outline: 'bg-transparent text-slate-200 hover:text-white border border-white/15 hover:border-white/30 hover:bg-white/[0.04]',
  ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/[0.06]',
  glass: 'bg-white/[0.08] backdrop-blur-md text-white border border-white/15 hover:bg-white/[0.14] shadow-sm',
  destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-900/30'
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
  lg: 'text-base px-6 py-3.5 rounded-xl font-semibold gap-2.5',
  icon: 'w-10 h-10 p-0 rounded-xl justify-center items-center'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.97 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF462D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0D11] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

