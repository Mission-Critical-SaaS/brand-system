'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from 'lucide-react';

import { cn } from '../../lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Skeleton } from '../ui/skeleton';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { SearchIcon } from 'lucide-react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Sort direction type - 'asc' for ascending, 'desc' for descending
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort state interface for hook usage (supports null for cleared state)
 */
export interface SortState {
  column: string | null;
  direction: SortDirection | null;
}

/**
 * Column definition for DataTable
 */
export interface Column<T> {
  /** Unique key identifying this column, supports dot notation for nested access (e.g., "user.name") */
  key: string;
  /** Display header text */
  header: string;
  /** Whether this column can be sorted */
  sortable?: boolean;
  /** Custom render function for cell content */
  render?: (value: unknown, row: T, rowIndex: number) => React.ReactNode;
  /** Additional className for body cells */
  className?: string;
  /** Additional className for header cell */
  headerClassName?: string;
  /** Column width (e.g., "150px", "20%") */
  width?: string;
}

/**
 * DataTable props interface
 */
export interface DataTableProps<T> {
  /** Column definitions */
  columns: Column<T>[];
  /** Data array to display */
  data: T[];
  /** Currently sorted column key */
  sortColumn?: string;
  /** Current sort direction */
  sortDirection?: SortDirection;
  /** Callback when sort changes: (column: string, direction: 'asc' | 'desc') => void */
  onSortChange?: (column: string, direction: SortDirection) => void;
  /** Whether the table is in loading state */
  isLoading?: boolean;
  /** Number of skeleton rows to show when loading (default: 5) */
  loadingRowCount?: number;
  /** Message to display when data is empty */
  emptyMessage?: string;
  /** Additional description for empty state */
  emptyDescription?: string;
  /** Function or key to extract unique row identifier */
  rowKey: keyof T | ((row: T, index: number) => string);
  /** Callback when a row is clicked */
  onRowClick?: (row: T, index: number) => void;
  /** Additional className for the table container */
  className?: string;
  /** Additional className for the table element */
  tableClassName?: string;
  /** Whether to show zebra striping on rows using LMNTL brand colors (default: true) */
  striped?: boolean;
  /** Whether rows should highlight on hover (default: true) */
  hoverable?: boolean;
  /** Caption text for accessibility (visually hidden) */
  caption?: string;
  /** ARIA label for the table */
  ariaLabel?: string;
}

// -----------------------------------------------------------------------------
// CVA Variants
// -----------------------------------------------------------------------------

const dataTableContainerVariants = cva('relative w-full', {
  variants: {
    loading: {
      true: 'pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    loading: false,
  },
});

const dataTableRowVariants = cva('transition-colors border-b', {
  variants: {
    striped: {
      true: 'odd:bg-lmntl-purple/5',
      false: '',
    },
    hoverable: {
      true: 'hover:bg-muted/50',
      false: '',
    },
    clickable: {
      true: 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
      false: '',
    },
  },
  defaultVariants: {
    striped: true,
    hoverable: true,
    clickable: false,
  },
});

const sortableHeaderVariants = cva('select-none transition-colors group', {
  variants: {
    sortable: {
      true: 'cursor-pointer hover:bg-muted/50',
      false: '',
    },
    active: {
      true: 'text-primary',
      false: '',
    },
  },
  defaultVariants: {
    sortable: false,
    active: false,
  },
});

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue<T>(obj: T, path: string): unknown {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

/**
 * Sort indicator component that shows the current sort state
 */
function SortIndicator({ direction, active }: { direction?: SortDirection; active: boolean }) {
  if (!active) {
    return (
      <ArrowUpDownIcon
        className="ml-1.5 size-4 opacity-30 transition-opacity group-hover:opacity-70"
        aria-hidden="true"
      />
    );
  }

  if (direction === 'asc') {
    return <ArrowUpIcon className="ml-1.5 size-4 text-primary" aria-hidden="true" />;
  }

  return <ArrowDownIcon className="ml-1.5 size-4 text-primary" aria-hidden="true" />;
}

/**
 * Loading skeleton row component with zebra striping support
 */
function SkeletonRow<T>({
  columns,
  rowIndex,
  striped,
}: {
  columns: Column<T>[];
  rowIndex: number;
  striped: boolean;
}) {
  return (
    <TableRow className={cn('border-b', striped && rowIndex % 2 === 1 && 'bg-lmntl-purple/5')}>
      {columns.map((column) => (
        <TableCell
          key={column.key}
          className={column.className}
          style={column.width ? { width: column.width } : undefined}
        >
          <Skeleton className="h-5 w-full max-w-[200px]" />
        </TableCell>
      ))}
    </TableRow>
  );
}

/**
 * Empty state component
 */
function EmptyState({
  message,
  description,
  colSpan,
}: {
  message: string;
  description?: string;
  colSpan: number;
}) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        <div className="text-muted-foreground">
          <p className="font-medium">{message}</p>
          {description && <p className="mt-1 text-sm">{description}</p>}
        </div>
      </TableCell>
    </TableRow>
  );
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

/**
 * A comprehensive, reusable data table component with sorting, zebra striping,
 * loading states, and accessibility features.
 *
 * Features:
 * - Clickable column headers with sort indicators (arrows up/down)
 * - Zebra striping using LMNTL brand colors (bg-lmntl-purple/5)
 * - Loading skeleton state
 * - Empty state message
 * - Row click handler with keyboard support
 * - Fully keyboard accessible
 * - CVA pattern for variants
 *
 * @example
 * ```tsx
 * const columns: Column<User>[] = [
 *   { key: 'name', header: 'Name', sortable: true },
 *   { key: 'email', header: 'Email', sortable: true },
 *   {
 *     key: 'status',
 *     header: 'Status',
 *     render: (value) => <Badge>{value}</Badge>
 *   },
 * ]
 *
 * <DataTable
 *   columns={columns}
 *   data={users}
 *   rowKey="id"
 *   sortColumn="name"
 *   sortDirection="asc"
 *   onSortChange={(col, dir) => handleSort(col, dir)}
 *   onRowClick={(row) => navigate(`/users/${row.id}`)}
 * />
 * ```
 */
function DataTable<T>({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSortChange,
  isLoading = false,
  loadingRowCount = 5,
  emptyMessage = 'No data available',
  emptyDescription,
  rowKey,
  onRowClick,
  className,
  tableClassName,
  striped = true,
  hoverable = true,
  caption,
  ariaLabel,
}: DataTableProps<T>) {
  /**
   * Get the unique key for a row
   */
  const getRowKey = React.useCallback(
    (row: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(row, index);
      }
      const value = row[rowKey];
      return String(value ?? index);
    },
    [rowKey]
  );

  /**
   * Handle column header click for sorting
   */
  const handleHeaderClick = React.useCallback(
    (column: Column<T>) => {
      if (!column.sortable || !onSortChange) return;

      // Cycle through: none -> asc -> desc -> asc
      let newDirection: SortDirection;
      if (sortColumn !== column.key) {
        newDirection = 'asc';
      } else if (sortDirection === 'asc') {
        newDirection = 'desc';
      } else {
        newDirection = 'asc';
      }

      onSortChange(column.key, newDirection);
    },
    [sortColumn, sortDirection, onSortChange]
  );

  /**
   * Handle keyboard navigation on sortable headers
   */
  const handleHeaderKeyDown = React.useCallback(
    (event: React.KeyboardEvent, column: Column<T>) => {
      if (!column.sortable) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleHeaderClick(column);
      }
    },
    [handleHeaderClick]
  );

  /**
   * Handle row click
   */
  const handleRowClick = React.useCallback(
    (row: T, index: number) => {
      if (onRowClick) {
        onRowClick(row, index);
      }
    },
    [onRowClick]
  );

  /**
   * Handle keyboard navigation on rows
   */
  const handleRowKeyDown = React.useCallback(
    (event: React.KeyboardEvent, row: T, index: number) => {
      if (!onRowClick) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleRowClick(row, index);
      }
    },
    [handleRowClick, onRowClick]
  );

  /**
   * Get ARIA sort attribute value
   */
  const getAriaSortValue = (column: Column<T>): 'ascending' | 'descending' | 'none' | undefined => {
    if (!column.sortable) return undefined;
    if (sortColumn !== column.key) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div
      data-slot="data-table"
      className={cn(dataTableContainerVariants({ loading: isLoading }), className)}
    >
      <Table className={tableClassName} aria-label={ariaLabel}>
        {caption && <caption className="sr-only">{caption}</caption>}
        <TableHeader>
          <TableRow className="border-b hover:bg-transparent">
            {columns.map((column) => {
              const isActive = sortColumn === column.key;
              const isSortable = column.sortable && !!onSortChange;

              return (
                <TableHead
                  key={column.key}
                  className={cn(
                    sortableHeaderVariants({
                      sortable: isSortable,
                      active: isActive,
                    }),
                    column.headerClassName
                  )}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={isSortable ? () => handleHeaderClick(column) : undefined}
                  onKeyDown={isSortable ? (e) => handleHeaderKeyDown(e, column) : undefined}
                  tabIndex={isSortable ? 0 : undefined}
                  role="columnheader"
                  aria-sort={getAriaSortValue(column)}
                >
                  <div className="flex items-center">
                    <span>{column.header}</span>
                    {isSortable && <SortIndicator direction={sortDirection} active={isActive} />}
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: loadingRowCount }).map((_, index) => (
              <SkeletonRow
                key={`skeleton-${index}`}
                columns={columns}
                rowIndex={index}
                striped={striped}
              />
            ))
          ) : data.length === 0 ? (
            // Empty state
            <EmptyState
              message={emptyMessage}
              description={emptyDescription}
              colSpan={columns.length}
            />
          ) : (
            // Data rows
            data.map((row, rowIndex) => {
              const key = getRowKey(row, rowIndex);
              const hasClickHandler = !!onRowClick;

              return (
                <TableRow
                  key={key}
                  className={cn(
                    dataTableRowVariants({
                      striped,
                      hoverable,
                      clickable: hasClickHandler,
                    })
                  )}
                  onClick={hasClickHandler ? () => handleRowClick(row, rowIndex) : undefined}
                  onKeyDown={
                    hasClickHandler ? (e) => handleRowKeyDown(e, row, rowIndex) : undefined
                  }
                  tabIndex={hasClickHandler ? 0 : undefined}
                  role={hasClickHandler ? 'button' : undefined}
                  aria-label={hasClickHandler ? `View details for row ${rowIndex + 1}` : undefined}
                >
                  {columns.map((column) => {
                    const value = getNestedValue(row, column.key);

                    return (
                      <TableCell
                        key={column.key}
                        className={column.className}
                        style={column.width ? { width: column.width } : undefined}
                      >
                        {column.render
                          ? column.render(value, row, rowIndex)
                          : value !== null && value !== undefined
                            ? String(value)
                            : '-'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Hook for Sort State Management
// -----------------------------------------------------------------------------

/**
 * Hook for managing sort state
 *
 * @example
 * ```tsx
 * const { sort, handleSort, clearSort } = useSortState('name', 'asc')
 *
 * <DataTable
 *   sortColumn={sort.column ?? undefined}
 *   sortDirection={sort.direction ?? undefined}
 *   onSortChange={handleSort}
 *   ...
 * />
 * ```
 */
export function useSortState(
  initialColumn: string | null = null,
  initialDirection: SortDirection | null = null
) {
  const [sort, setSort] = React.useState<SortState>({
    column: initialColumn,
    direction: initialDirection,
  });

  const handleSort = React.useCallback((column: string, direction: SortDirection) => {
    setSort({ column, direction });
  }, []);

  const clearSort = React.useCallback(() => {
    setSort({ column: null, direction: null });
  }, []);

  return { sort, setSort, handleSort, clearSort };
}

/**
 * Hook for managing sort state with URL persistence support
 */
export function useSortStateWithUrl(
  defaultColumn: string | null = null,
  defaultDirection: SortDirection | null = null
) {
  const [sort, setSort] = React.useState<SortState>({
    column: defaultColumn,
    direction: defaultDirection,
  });

  const handleSort = React.useCallback((column: string, direction: SortDirection) => {
    setSort({ column, direction });
  }, []);

  const clearSort = React.useCallback(() => {
    setSort({ column: null, direction: null });
  }, []);

  // Initialize from URL params
  const initFromUrl = React.useCallback((searchParams: URLSearchParams) => {
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder') as SortDirection | null;
    if (sortBy) {
      setSort({
        column: sortBy,
        direction: sortOrder || 'asc',
      });
    }
  }, []);

  // Get URL params from current sort state
  const getUrlParams = React.useCallback((): Record<string, string> => {
    if (!sort.column || !sort.direction) {
      return {};
    }
    return {
      sortBy: sort.column,
      sortOrder: sort.direction,
    };
  }, [sort]);

  return { sort, setSort, handleSort, clearSort, initFromUrl, getUrlParams };
}

// -----------------------------------------------------------------------------
// DataTableFilters Component
// -----------------------------------------------------------------------------

/**
 * Filter option for select filters
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Individual filter definition
 */
export interface DataTableFilter {
  /** Unique key for this filter */
  key: string;
  /** Display label */
  label: string;
  /** Filter type */
  type: 'search' | 'select';
  /** Placeholder text */
  placeholder?: string;
  /** Options for select type */
  options?: FilterOption[];
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
}

/**
 * DataTableFilters props
 */
export interface DataTableFiltersProps {
  /** Array of filter definitions */
  filters: DataTableFilter[];
  /** Additional className */
  className?: string;
}

/**
 * A reusable filters component for DataTable
 *
 * @example
 * ```tsx
 * const filters: DataTableFilter[] = [
 *   {
 *     key: 'search',
 *     label: 'Search',
 *     type: 'search',
 *     placeholder: 'Search...',
 *     value: searchTerm,
 *     onChange: setSearchTerm,
 *   },
 *   {
 *     key: 'status',
 *     label: 'Status',
 *     type: 'select',
 *     options: [
 *       { value: 'all', label: 'All' },
 *       { value: 'active', label: 'Active' },
 *     ],
 *     value: statusFilter,
 *     onChange: setStatusFilter,
 *   },
 * ]
 *
 * <DataTableFilters filters={filters} />
 * ```
 */
export function DataTableFilters({ filters, className }: DataTableFiltersProps) {
  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {filters.map((filter) => {
        if (filter.type === 'search') {
          return (
            <div key={filter.key} className="relative">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={filter.placeholder || `Search ${filter.label.toLowerCase()}...`}
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="pl-10"
              />
            </div>
          );
        }

        if (filter.type === 'select' && filter.options) {
          return (
            <Select key={filter.key} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder || filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        return null;
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Status Badge Component (for common table cell rendering)
// -----------------------------------------------------------------------------

export interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'default' | 'info';
  className?: string;
}

const statusVariantMap: Record<string, StatusBadgeProps['variant']> = {
  active: 'success',
  inactive: 'default',
  archived: 'danger',
  pending: 'warning',
  completed: 'success',
  cancelled: 'danger',
  paid: 'success',
  unpaid: 'warning',
  overdue: 'danger',
  draft: 'default',
};

const variantStyles: Record<NonNullable<StatusBadgeProps['variant']>, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
};

/**
 * Status badge component for consistent status display in tables
 */
export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant || statusVariantMap[status.toLowerCase()] || 'default';
  const colorClasses = variantStyles[resolvedVariant];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClasses,
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export { DataTable, dataTableContainerVariants, dataTableRowVariants, sortableHeaderVariants };
