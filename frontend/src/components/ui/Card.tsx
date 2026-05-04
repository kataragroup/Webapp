import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  key?: React.Key;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-[#1a1a1a] border border-white/5 rounded-[40px] p-6 shadow-xl", 
        onClick && "cursor-pointer hover:bg-white/5 transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}
