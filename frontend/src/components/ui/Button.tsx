import React from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
};

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  fullWidth,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-orange-600 text-white shadow-orange-500/20",
    secondary: "bg-blue-600 text-white shadow-blue-500/20",
    accent: "bg-emerald-500 text-white",
    danger: "bg-red-500 text-white",
    outline: "border-2 border-white/10 text-white hover:bg-white/5",
    ghost: "text-white hover:bg-white/5"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "p-3"
  };
  
  return (
    <button 
      className={cn(
        "rounded-2xl font-black italic uppercase tracking-tighter transition-all active:scale-95 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
