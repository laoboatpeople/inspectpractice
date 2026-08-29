'use client';

import * as React from 'react';
import { cn } from './utils';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked = false,
      onChange,
      label,
      description,
      disabled,
      indeterminate = false,
      error,
      className,
      id,
    },
    ref
  ) => {
    const checkboxId = id || React.useId();
    const [isChecked, setIsChecked] = React.useState(checked);

    React.useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const handleClick = () => {
      if (disabled) return;
      const newValue = !isChecked;
      setIsChecked(newValue);
      onChange?.(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <button
          ref={ref}
          type="button"
          role="checkbox"
          id={checkboxId}
          aria-checked={indeterminate ? 'mixed' : isChecked}
          disabled={disabled}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-primary',
            isChecked || indeterminate
              ? 'border-blue bg-blue'
              : 'border-border bg-card hover:border-text-tertiary',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-red'
          )}
        >
          {isChecked && !indeterminate && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          {indeterminate && <Minus className="h-3 w-3 text-white" strokeWidth={3} />}
        </button>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium text-text-primary cursor-pointer',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-text-tertiary">{description}</p>
            )}
          </div>
        )}
        {error && (
          <p className="text-xs text-red">{error}</p>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
