'use client';

import React from 'react';
import { Icon } from '@/components/Icons';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'danger-light' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500 transform hover:scale-[1.02] active:scale-[0.98]',
      secondary: 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      'danger-light': 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500',
      outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && <Icon name="Spinner" className="w-4 h-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
