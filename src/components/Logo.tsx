import React from 'react';
import { motion } from 'motion/react';

export default function Logo({ className = '', onClick, 'aria-label': ariaLabel }: { className?: string; onClick?: () => void; 'aria-label'?: string }) {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer flex items-center justify-center md:justify-start z-50 transition-all duration-300 hover:opacity-80 ${className}`}
      aria-label={ariaLabel || "Winterberg Wirtschaft Logo"}
    >
      <span className="font-display tracking-wider text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-current uppercase leading-[1.1] md:leading-tight text-center md:text-left">
        <span className="font-bold relative z-10 inline-block">
          Winterberg
          <svg 
            className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-3 md:h-5 overflow-visible pointer-events-none z-0" 
            viewBox="0 0 300 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <motion.path 
              d="M 5 15 Q 100 0 200 12 T 295 8" 
              stroke="#ffc084" 
              strokeWidth="6" 
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.1 }}
            />
          </svg>
        </span>{' '}
        <span className="font-normal relative z-10 inline-block">Wirtschaft</span>
      </span>
    </div>
  );
}
