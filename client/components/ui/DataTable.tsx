'use client';

import * as React from 'react';
import { cn } from './utils';
import { ChevronUp, ChevronDown, ChevronsUpDown, Loader2 } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedRows?: Set<string>;
  onSelectionChange?: (selectedKeys: Set<string>) => void;
  rowKey?: (row: T) => string;
  className?: string;
  stickyHeader?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  selectedRows,
  onSelectionChange,
  rowKey = (row: T) => (row as { id?: string }).id || Math.random().toString(36).slice(2),
  className,
  stickyHeader = false,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortKey(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    const column = columns.find((col) => col.key === sortKey);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = column.accessor(a);
      const bValue = column.accessor(b);

      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection, columns]);

  const handleRowSelect = (key: string) => {
    if (!onSelectionChange) return;
    const newSelection = new Set(selectedRows);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedRows?.size === data.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(data.map(rowKey)));
    }
  };

  const isAllSelected = data.length > 0 && selectedRows?.size === data.length;
  const isIndeterminate = selectedRows && selectedRows.size > 0 && selectedRows.size < data.length;

  return (
    <div className={cn('w-full overflow-hidden rounded-card border border-border bg-card', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className={cn('bg-secondary text-text-secondary', stickyHeader && 'sticky top-0 z-10')}>
            <tr>
              {onSelectionChange && (
                <th className="w-12 px-4 py-3">
                  <button
                    onClick={handleSelectAll}
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                      isAllSelected
                        ? 'border-blue bg-blue'
                        : isIndeterminate
                        ? 'border-blue bg-blue/50'
                        : 'border-border hover:border-text-tertiary'
                    )}
                  >
                    {isAllSelected && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M10.28 2.28L4.5 8.06 1.72 5.28a1 1 0 00-1.44 1.44l3.5 3.5a1 1 0 001.44 0l7-7a1 1 0 00-1.44-1.44z" />
                      </svg>
                    )}
                    {isIndeterminate && (
                      <div className="h-0.5 w-3 bg-white rounded" />
                    )}
                  </button>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left font-medium',
                    column.sortable && 'cursor-pointer select-none hover:text-text-primary',
                    column.className
                  )}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <span className="text-text-tertiary">
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-text-tertiary">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onSelectionChange ? 1 : 0)}
                  className="h-48 text-center text-text-tertiary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => {
                const key = rowKey(row);
                const isSelected = selectedRows?.has(key);

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-t border-border transition-colors',
                      onRowClick && 'cursor-pointer',
                      isSelected ? 'bg-blue/10' : 'hover:bg-hover',
                      rowIndex % 2 === 0 ? 'bg-secondary/30' : ''
                    )}
                  >
                    {onSelectionChange && (
                      <td className="w-12 px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleRowSelect(key)}
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded border-2 transition-colors',
                            isSelected
                              ? 'border-blue bg-blue'
                              : 'border-border hover:border-text-tertiary'
                          )}
                        >
                          {isSelected && (
                            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                              <path d="M10.28 2.28L4.5 8.06 1.72 5.28a1 1 0 00-1.44 1.44l3.5 3.5a1 1 0 001.44 0l7-7a1 1 0 00-1.44-1.44z" />
                            </svg>
                          )}
                        </button>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn('px-4 py-3 text-text-primary', column.className)}
                      >
                        {column.accessor(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
