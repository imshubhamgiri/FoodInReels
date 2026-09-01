import React from 'react';

export function Skeleton({ className = '', height = 'h-6', width = 'w-full', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-white/[0.06] backdrop-blur-sm ${height} ${width} ${className}`}
      {...props}
    />
  );
}

export default Skeleton;

