import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string;
  width?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  height,
  width,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-stone-200/80 dark:bg-white/[0.06]',
        height,
        width,
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;

