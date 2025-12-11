"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import {
  SearchIcon,
  XIcon,
  CalendarIcon,
  DollarSignIcon,
} from "lucide-react"

import { cn } from "../../lib/utils"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * Option type for select filters (advanced version with disabled support)
 */
export interface AdvancedFilterOption {
  value: string
  label: string
  disabled?: boolean
}

/**
 * Date range value type
 */
export interface DateRangeValue {
  from: string | null
  to: string | null
}

/**
 * Balance filter value type
 */
export interface BalanceFilterValue {
  min: number | null
  max: number | null
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  /** Unique key for this filter */
  key: string
  /** Display label */
  label: string
  /** Filter type */
  type: "select" | "search" | "date-range" | "balance"
  /** Options for select filter */
  options?: AdvancedFilterOption[]
  /** Placeholder text */
  placeholder?: string
  /** Whether the filter is disabled */
  disabled?: boolean
  /** Additional className */
  className?: string
}

/**
 * Filter values - supports various value types based on filter type
 */
export type FilterValues = Record<
  string,
  string | DateRangeValue | BalanceFilterValue | undefined
>

/**
 * DataTableFiltersAdvanced props
 */
export interface DataTableFiltersAdvancedProps {
  /** Filter configurations */
  filters: FilterConfig[]
  /** Current filter values */
  values: FilterValues
  /** Callback when a filter value changes */
  onChange: (key: string, value: unknown) => void
  /** Callback to clear all filters */
  onClear?: () => void
  /** Whether to show the clear all button */
  showClearButton?: boolean
  /** Additional className for the container */
  className?: string
  /** Layout variant */
  layout?: "horizontal" | "vertical" | "grid"
  /** Number of columns for grid layout */
  columns?: 2 | 3 | 4
}

// -----------------------------------------------------------------------------
// CVA Variants
// -----------------------------------------------------------------------------

const filtersContainerVariants = cva("", {
  variants: {
    layout: {
      horizontal: "flex flex-wrap items-end gap-4",
      vertical: "flex flex-col gap-4",
      grid: "grid gap-4",
    },
    columns: {
      2: "md:grid-cols-2",
      3: "md:grid-cols-2 lg:grid-cols-3",
      4: "md:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    layout: "grid",
    columns: 3,
  },
})

const filterItemVariants = cva("space-y-1.5", {
  variants: {
    layout: {
      horizontal: "flex-1 min-w-[200px]",
      vertical: "w-full",
      grid: "",
    },
  },
  defaultVariants: {
    layout: "grid",
  },
})

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

/**
 * Search filter input with icon
 */
function SearchFilter({
  config,
  value,
  onChange,
  layout,
}: {
  config: FilterConfig
  value: string
  onChange: (value: string) => void
  layout: "horizontal" | "vertical" | "grid"
}) {
  return (
    <div className={cn(filterItemVariants({ layout }), config.className)}>
      <Label htmlFor={`filter-${config.key}`} className="text-sm font-medium">
        {config.label}
      </Label>
      <div className="relative">
        <SearchIcon
          className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          id={`filter-${config.key}`}
          type="search"
          placeholder={config.placeholder || `Search ${config.label.toLowerCase()}...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={config.disabled}
          className="pl-10"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
            onClick={() => onChange("")}
            aria-label={`Clear ${config.label} filter`}
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Select filter dropdown
 */
function SelectFilter({
  config,
  value,
  onChange,
  layout,
}: {
  config: FilterConfig
  value: string
  onChange: (value: string) => void
  layout: "horizontal" | "vertical" | "grid"
}) {
  if (!config.options) {
    console.warn(`SelectFilter "${config.key}" requires options`)
    return null
  }

  return (
    <div className={cn(filterItemVariants({ layout }), config.className)}>
      <Label htmlFor={`filter-${config.key}`} className="text-sm font-medium">
        {config.label}
      </Label>
      <Select
        value={value || ""}
        onValueChange={onChange}
        disabled={config.disabled}
      >
        <SelectTrigger id={`filter-${config.key}`} className="w-full">
          <SelectValue
            placeholder={config.placeholder || `Select ${config.label.toLowerCase()}`}
          />
        </SelectTrigger>
        <SelectContent>
          {config.options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * Date range filter with from/to inputs
 */
function DateRangeFilter({
  config,
  value,
  onChange,
  layout,
}: {
  config: FilterConfig
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  layout: "horizontal" | "vertical" | "grid"
}) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, from: e.target.value || null })
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, to: e.target.value || null })
  }

  return (
    <div className={cn(filterItemVariants({ layout }), config.className)}>
      <Label className="text-sm font-medium">{config.label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <CalendarIcon
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="date"
            placeholder="From"
            value={value.from || ""}
            onChange={handleFromChange}
            disabled={config.disabled}
            className="pl-10"
            aria-label={`${config.label} from date`}
          />
        </div>
        <span className="text-muted-foreground text-sm">to</span>
        <div className="relative flex-1">
          <CalendarIcon
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="date"
            placeholder="To"
            value={value.to || ""}
            onChange={handleToChange}
            disabled={config.disabled}
            className="pl-10"
            aria-label={`${config.label} to date`}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Balance/amount range filter with min/max inputs
 */
function BalanceFilter({
  config,
  value,
  onChange,
  layout,
}: {
  config: FilterConfig
  value: BalanceFilterValue
  onChange: (value: BalanceFilterValue) => void
  layout: "horizontal" | "vertical" | "grid"
}) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value ? parseFloat(e.target.value) : null
    onChange({ ...value, min: numValue })
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value ? parseFloat(e.target.value) : null
    onChange({ ...value, max: numValue })
  }

  return (
    <div className={cn(filterItemVariants({ layout }), config.className)}>
      <Label className="text-sm font-medium">{config.label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <DollarSignIcon
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="number"
            placeholder="Min"
            value={value.min ?? ""}
            onChange={handleMinChange}
            disabled={config.disabled}
            className="pl-10"
            aria-label={`${config.label} minimum`}
            step="0.01"
          />
        </div>
        <span className="text-muted-foreground text-sm">to</span>
        <div className="relative flex-1">
          <DollarSignIcon
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          />
          <Input
            type="number"
            placeholder="Max"
            value={value.max ?? ""}
            onChange={handleMaxChange}
            disabled={config.disabled}
            className="pl-10"
            aria-label={`${config.label} maximum`}
            step="0.01"
          />
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

/**
 * A comprehensive filter bar component for DataTable.
 * Supports search, select, date range, and balance/amount filters.
 *
 * Features:
 * - Multiple filter types: search, select, date-range, balance
 * - Responsive grid/horizontal/vertical layouts
 * - Clear all filters button
 * - Keyboard accessible
 * - LMNTL brand styling
 *
 * @example
 * ```tsx
 * const filters: FilterConfig[] = [
 *   { key: 'search', label: 'Search', type: 'search' },
 *   {
 *     key: 'status',
 *     label: 'Status',
 *     type: 'select',
 *     options: [
 *       { value: 'all', label: 'All Statuses' },
 *       { value: 'active', label: 'Active' },
 *       { value: 'inactive', label: 'Inactive' },
 *     ],
 *   },
 *   { key: 'dateRange', label: 'Date Range', type: 'date-range' },
 *   { key: 'balance', label: 'Balance', type: 'balance' },
 * ]
 *
 * const [filterValues, setFilterValues] = useState<FilterValues>({
 *   search: '',
 *   status: 'all',
 *   dateRange: { from: null, to: null },
 *   balance: { min: null, max: null },
 * })
 *
 * <DataTableFiltersAdvanced
 *   filters={filters}
 *   values={filterValues}
 *   onChange={(key, value) => setFilterValues(prev => ({ ...prev, [key]: value }))}
 *   onClear={() => setFilterValues(initialValues)}
 * />
 * ```
 */
function DataTableFiltersAdvanced({
  filters,
  values,
  onChange,
  onClear,
  showClearButton = true,
  className,
  layout = "grid",
  columns = 3,
}: DataTableFiltersAdvancedProps) {
  // Check if any filters have values
  const hasActiveFilters = React.useMemo(() => {
    return filters.some((filter) => {
      const value = values[filter.key]
      if (value === undefined || value === null || value === "") return false
      if (typeof value === "string") return value.length > 0
      if (filter.type === "date-range") {
        const dateValue = value as DateRangeValue
        return dateValue.from !== null || dateValue.to !== null
      }
      if (filter.type === "balance") {
        const balanceValue = value as BalanceFilterValue
        return balanceValue.min !== null || balanceValue.max !== null
      }
      return true
    })
  }, [filters, values])

  /**
   * Get default value for a filter type
   */
  const getDefaultValue = (
    type: FilterConfig["type"]
  ): string | DateRangeValue | BalanceFilterValue => {
    switch (type) {
      case "date-range":
        return { from: null, to: null }
      case "balance":
        return { min: null, max: null }
      default:
        return ""
    }
  }

  /**
   * Render a filter based on its type
   */
  const renderFilter = (config: FilterConfig) => {
    const value = values[config.key] ?? getDefaultValue(config.type)

    switch (config.type) {
      case "search":
        return (
          <SearchFilter
            key={config.key}
            config={config}
            value={value as string}
            onChange={(v) => onChange(config.key, v)}
            layout={layout}
          />
        )
      case "select":
        return (
          <SelectFilter
            key={config.key}
            config={config}
            value={value as string}
            onChange={(v) => onChange(config.key, v)}
            layout={layout}
          />
        )
      case "date-range":
        return (
          <DateRangeFilter
            key={config.key}
            config={config}
            value={value as DateRangeValue}
            onChange={(v) => onChange(config.key, v)}
            layout={layout}
          />
        )
      case "balance":
        return (
          <BalanceFilter
            key={config.key}
            config={config}
            value={value as BalanceFilterValue}
            onChange={(v) => onChange(config.key, v)}
            layout={layout}
          />
        )
      default:
        console.warn(`Unknown filter type: ${config.type}`)
        return null
    }
  }

  return (
    <div
      data-slot="data-table-filters"
      className={cn("space-y-4", className)}
      role="search"
      aria-label="Table filters"
    >
      <div
        className={cn(
          filtersContainerVariants({
            layout,
            columns: layout === "grid" ? columns : undefined,
          })
        )}
      >
        {filters.map(renderFilter)}
      </div>

      {showClearButton && onClear && hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClear}
            className="gap-2"
          >
            <XIcon className="size-4" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Hook for Filter State Management
// -----------------------------------------------------------------------------

/**
 * Hook for managing filter state
 *
 * @example
 * ```tsx
 * const { values, setValue, clearAll, hasActiveFilters } = useFilterState({
 *   search: '',
 *   status: 'all',
 *   dateRange: { from: null, to: null },
 * })
 *
 * <DataTableFilters
 *   filters={filters}
 *   values={values}
 *   onChange={setValue}
 *   onClear={clearAll}
 * />
 * ```
 */
export function useFilterState<T extends FilterValues>(initialValues: T) {
  const [values, setValues] = React.useState<T>(initialValues)

  const setValue = React.useCallback((key: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const clearAll = React.useCallback(() => {
    setValues(initialValues)
  }, [initialValues])

  const hasActiveFilters = React.useMemo(() => {
    return Object.entries(values).some(([, value]) => {
      if (value === undefined || value === null || value === "") return false
      if (typeof value === "string") return value.length > 0
      if (typeof value === "object") {
        if ("from" in value || "to" in value) {
          const dateValue = value as DateRangeValue
          return dateValue.from !== null || dateValue.to !== null
        }
        if ("min" in value || "max" in value) {
          const balanceValue = value as BalanceFilterValue
          return balanceValue.min !== null || balanceValue.max !== null
        }
      }
      return true
    })
  }, [values])

  return { values, setValues, setValue, clearAll, hasActiveFilters }
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export {
  DataTableFiltersAdvanced,
  filtersContainerVariants,
  filterItemVariants,
  // Re-export individual filter components for custom use
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
  BalanceFilter,
}
