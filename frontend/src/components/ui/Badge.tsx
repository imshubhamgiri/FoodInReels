import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'gold' | 'emerald' | 'success' | 'outline' | 'glass' | 'secondary' | 'veg' | 'nonveg';
  size?: 'sm' | 'md';
}

const badgeVariants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-[#FF462D]/15 text-[#FF6B4A] border border-[#FF462D]/30',
  primary: 'bg-[#FF462D] text-white shadow-sm shadow-[#FF462D]/30 border border-[#FF6B4A]/50',
  gold: 'bg-[#FFB703]/15 text-[#FFB703] border border-[#FFB703]/30 font-semibold',
  emerald: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-medium',
  success: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-medium',
  outline: 'border border-white/15 text-slate-300 bg-transparent',
  glass: 'bg-white/[0.08] backdrop-blur-md text-white border border-white/15',
  secondary: 'bg-[#23232D] text-slate-300 border border-white/10',
  veg: 'border border-emerald-500/60 bg-emerald-500/10 text-emerald-400 p-0.5',
  nonveg: 'border border-rose-500/60 bg-rose-500/10 text-rose-400 p-0.5'
};

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  if (variant === 'veg') {
    return (
      <div 
        className={cn('inline-flex items-center justify-center w-4 h-4 rounded-sm border border-emerald-500 bg-emerald-950/40 p-0.5', className)}
        title="Pure Vegetarian"
        {...props}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      </div>
    );
  }

  if (variant === 'nonveg') {
    return (
      <div 
        className={cn('inline-flex items-center justify-center w-4 h-4 rounded-sm border border-rose-500 bg-rose-950/40 p-0.5', className)}
        title="Non-Vegetarian"
        {...props}
      >
        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors select-none',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

