'use client';

import * as React from 'react';
import { cn } from './utils';
import { Loader2 } from 'lucide-react';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface AreaChartDataPoint {
  [key: string]: string | number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  xAxisKey: string;
  dataKeys: string | string[];
  colors?: string[];
  title?: string;
  description?: string;
  height?: number;
  loading?: boolean;
  className?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  gradientId?: string;
}

const defaultColors = ['#C8102E', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#4C7FBF'];

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-card border border-border bg-card px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-text-secondary">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-text-secondary">{entry.name}:</span>
          <span className="font-medium text-text-primary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  xAxisKey,
  dataKeys,
  colors = defaultColors,
  title,
  description,
  height = 300,
  loading = false,
  className,
  showGrid = true,
  showTooltip = true,
  showLegend = false,
  gradientId = 'areaGradient',
}) => {
  const keys = Array.isArray(dataKeys) ? dataKeys : [dataKeys];

  if (loading) {
    return (
      <div className={cn('w-full rounded-card border border-border bg-card p-6', className)}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            {description && (
              <p className="text-sm text-text-secondary">{description}</p>
            )}
          </div>
        )}
        <div
          className="flex items-center justify-center"
          style={{ height: height - (title ? 60 : 0) }}
        >
          <Loader2 className="h-8 w-8 animate-spin text-blue" />
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={cn('w-full rounded-card border border-border bg-card p-6', className)}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            {description && (
              <p className="text-sm text-text-secondary">{description}</p>
            )}
          </div>
        )}
        <div
          className="flex items-center justify-center text-text-tertiary"
          style={{ height: height - (title ? 60 : 0) }}
        >
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full rounded-card border border-border bg-card p-6', className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
          {description && (
            <p className="text-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsAreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {keys.map((key, index) => (
                <linearGradient
                  key={key}
                  id={`${gradientId}-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2D3A52"
                vertical={false}
              />
            )}
            <XAxis
              dataKey={xAxisKey}
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
              }
            />
            {showTooltip && (
              <Tooltip content={<CustomTooltip />} />
            )}
            {showLegend && (
              <Legend />
            )}
            {keys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                fill={`url(#${gradientId}-${index})`}
                animationDuration={600}
                animationEasing="ease-out"
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Simple Legend component
const Legend: React.FC<{
  payload?: Array<{ value: string; color: string }>;
}> = ({ payload }) => {
  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-text-secondary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export { AreaChart };
