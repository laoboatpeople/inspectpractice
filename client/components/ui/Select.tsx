"use client";

import * as React from 'react';
import { cn } from './utils';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  id?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Select an option',
      label,
      error,
      hint,
      disabled,
      loading,
      className,
      id,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectId = id || React.useId();
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on Escape
    React.useEffect(() => {
      if (!isOpen) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
    };

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={ref}
            type="button"
            id={selectId}
            disabled={disabled || loading}
            onClick={() => !disabled && !loading && setIsOpen(prev => !prev)}
            className={cn(
              'flex h-10 w-full items-center justify-between rounded-input border bg-[#0A0E1A] px-3 py-2 text-sm text-text-primary transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-red focus:ring-red'
                : 'border-border hover:border-text-tertiary',
              isOpen && 'ring-2 ring-blue ring-offset-2 ring-offset-primary',
              className
            )}
          >
            <span className={cn(selectedOption ? 'text-text-primary' : 'text-text-tertiary')}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </span>
              ) : selectedOption ? (
                selectedOption.label
              ) : (
                placeholder
              )}
            </span>
            <ChevronDown
              className={cn(
                'h-4 w-4 text-text-tertiary transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Dropdown — rendered inline, NOT as portal */}
          {isOpen && (
            <div
              className="absolute top-full left-0 right-0 z-[60] mt-1 max-h-60 overflow-auto rounded-card border border-[#1A2035] bg-[#1A2035] shadow-2xl"
            >
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-text-tertiary">No options</div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-sm text-left text-text-primary transition-colors',
                      'hover:bg-hover',
                      option.disabled && 'cursor-not-allowed opacity-50',
                      option.value === value && 'bg-hover text-blue'
                    )}
                  >
                    <span>{option.label}</span>
                    {option.value === value && <Check className="h-4 w-4 text-blue" />}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-text-tertiary">{hint}</p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };
