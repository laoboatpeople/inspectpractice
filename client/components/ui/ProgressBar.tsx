'use client';

import * as React from 'react';
import { cn } from './utils';

export interface ProgressBarProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  indeterminate?: boolean;
  className?: string;
}

const variantClasses = {
  default: 'bg-blue',
  success: 'bg-green',
  warning: 'bg-amber',
  error: 'bg-red',
};

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  label,
  showValue = false,
  variant = 'default',
  size = 'md',
  indeterminate = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-text-secondary">{label}</span>
          )}
          {showValue && !indeterminate && (
            <span className="text-sm text-text-tertiary">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-secondary',
          sizeClasses[size]
        )}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantClasses[variant],
            indeterminate && 'animate-pulse'
          )}
          style={
            indeterminate
              ? { width: '100%', animation: 'progress-indeterminate 1.5s ease-in-out infinite' }
              : { width: `${percentage}%` }
          }
        />
      </div>
      <style jsx>{`
        @keyframes progress-indeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export { ProgressBar };
