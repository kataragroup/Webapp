import React from 'react';
import { cn } from '../../lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: any;
  rightElement?: React.ReactNode;
};

export function Input({ className, icon, rightElement, ...props }: InputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 flex items-center">
           {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full bg-[#1a1a1a] border-2 border-white/5 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:border-blue-500 focus:outline-none transition-all font-bold",
          icon ? "pl-12" : "pl-4",
          rightElement ? "pr-12" : "pr-4",
          className
        )}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 flex items-center">
           {rightElement}
        </div>
      )}
    </div>
  );
}
