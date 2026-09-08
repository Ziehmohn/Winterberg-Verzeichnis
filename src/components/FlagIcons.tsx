import React from 'react';

interface FlagProps {
  className?: string;
}

export function GermanFlag({ className = "w-4 h-4" }: FlagProps) {
  return (
    <svg 
      viewBox="0 0 512 512" 
      className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs border border-black/10`} 
      aria-hidden="true"
    >
      <rect width="512" height="170.67" y="0" fill="#1B211D" />
      <rect width="512" height="170.67" y="170.67" fill="#D80027" />
      <rect width="512" height="170.67" y="341.33" fill="#FFDA44" />
    </svg>
  );
}

export function DutchFlag({ className = "w-4 h-4" }: FlagProps) {
  return (
    <svg 
      viewBox="0 0 512 512" 
      className={`${className} rounded-full overflow-hidden shrink-0 shadow-2xs border border-black/10`} 
      aria-hidden="true"
    >
      <rect width="512" height="170.67" y="0" fill="#AE1C28" />
      <rect width="512" height="170.67" y="170.67" fill="#FFFFFF" />
      <rect width="512" height="170.67" y="341.33" fill="#21468B" />
    </svg>
  );
}
