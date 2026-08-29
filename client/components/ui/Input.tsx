'use client';

import * as React from 'react';
import { cn } from './utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, leftIcon, rightIcon, loading, disabled, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-tertiary">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-input border bg-[#0A0E1A] px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red focus:ring-red'
                : 'border-border hover:border-text-tertiary',
              leftIcon && 'pl-10',
              (rightIcon || loading) && 'pr-10',
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-text-tertiary border-t-transparent" />
            </div>
          )}
          {!loading && rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <div className="mt-1.5 flex items-center gap-1 text-xs text-red">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
