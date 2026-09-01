import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: 'none' | 'primary' | 'gold' | 'emerald';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glow = 'none', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-[#18181F] text-[#F8FAFC] rounded-2xl border border-white/[0.08] transition-all duration-300',
          hoverEffect && 'hover:border-white/20 hover:bg-[#1E1E28] hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40',
          glow === 'primary' && 'hover:shadow-[0_0_30px_-5px_rgba(255,70,45,0.25)] hover:border-[#FF462D]/40',
          glow === 'gold' && 'hover:shadow-[0_0_30px_-5px_rgba(255,183,3,0.25)] hover:border-[#FFB703]/40',
          glow === 'emerald' && 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)] hover:border-[#10B981]/40',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-5 md:p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold text-lg md:text-xl leading-none tracking-tight text-white font-heading', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-[#94A3B8]', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 md:p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-5 md:p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

