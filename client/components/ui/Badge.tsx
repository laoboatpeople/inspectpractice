'use client';

import * as React from 'react';
import { cn } from './utils';

type BadgeColor = 'slate' | 'blue' | 'green' | 'amber' | 'red' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorMap: Record<BadgeColor, string> = {
  slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export function Badge({ children, color = 'slate', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}