import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  shortcut?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leadingIcon, trailingIcon, shortcut, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('relative flex items-center w-full', containerClassName)}>
        {leadingIcon && (
          <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
            {leadingIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-11 w-full rounded-xl bg-[#18181F] px-4 py-2 text-sm text-[#F8FAFC] placeholder:text-slate-500 border border-white/10 transition-all duration-200 focus-visible:outline-none focus-visible:border-[#FF462D]/60 focus-visible:ring-2 focus-visible:ring-[#FF462D]/20 disabled:cursor-not-allowed disabled:opacity-50',
            leadingIcon && 'pl-10',
            (trailingIcon || shortcut) && 'pr-14',
            className
          )}
          ref={ref}
          {...props}
        />
        {shortcut && (
          <div className="absolute right-3 hidden sm:flex items-center pointer-events-none">
            <kbd className="px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white/[0.06] border border-white/10 rounded-md shadow-xs">
              {shortcut}
            </kbd>
          </div>
        )}
        {trailingIcon && !shortcut && (
          <div className="absolute right-3.5 flex items-center text-slate-400">
            {trailingIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

