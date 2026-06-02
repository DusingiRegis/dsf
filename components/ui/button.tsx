'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'default' | 'admin';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', theme = 'default', ...props }, ref) => {
    const defaultVariants = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
      danger: 'bg-danger text-white hover:bg-danger/90',
    };

    const adminVariants = {
      primary: 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white hover:from-cyan-500 hover:via-blue-600 hover:to-indigo-700 shadow-xl shadow-blue-500/40',
      secondary: 'border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 shadow-xl',
      danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-xl shadow-red-500/40',
    };

    const variants = theme === 'admin' ? adminVariants : defaultVariants;

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-3',
      lg: 'px-8 py-4 text-lg',
    };

    const adminAnimations = theme === 'admin' 
      ? 'transition-all duration-300 transform hover:scale-105 active:scale-95' 
      : 'transition-colors duration-200';

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-lg font-semibold',
          adminAnimations,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
