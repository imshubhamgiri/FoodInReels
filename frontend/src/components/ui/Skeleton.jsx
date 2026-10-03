import React from 'react';

export function Skeleton({ className = '', height = 'h-6', width = 'w-full', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-stone-200 dark:bg-white/[0.06] ${height} ${width} ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
