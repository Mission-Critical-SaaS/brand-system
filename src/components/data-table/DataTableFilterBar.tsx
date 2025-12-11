"use client"

import * as React from "react"
import {
  SearchIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CalendarIcon,
  CheckIcon,
} from "lucide-react"

import { cn } from "../../lib/utils"
import type { FilterOption } from "./DataTable"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

// Re-export FilterOption for convenience
export type { FilterOption }

export interface FilterChipConfig {
  key: string
  label: string
  onRemove: () => void
}

export interface FilterDropdownConfig {
  key: string
  label: string
  options: FilterOption[]
  value?: string | string[]
  onChange: (value: string | string[]) => void
  multiSelect?: boolean
}

export interface DateRangeConfig {
  from: Date | null
  to: Date | null
  onPrevious: () => void
  onNext: () => void
  onChange?: (range: { from: Date | null; to: Date | null }) => void
  formatRange?: (from: Date | null, to: Date | null) => string
}

export interface DataTableFilterBarProps {
  /** Search input value */
  searchValue?: string
  /** Callback when search changes */
  onSearchChange?: (value: string) => void
  /** Search placeholder */
  searchPlaceholder?: string
  /** Date range configuration */
  dateRange?: DateRangeConfig
  /** Active filter chips (removable pills) */
  chips?: FilterChipConfig[]
  /** Dropdown filter configurations */
  filters?: FilterDropdownConfig[]
  /** Total number of items */
  totalItems?: number
  /** Number of items currently shown */
  shownItems?: number
  /** Number of active filters */
  activeFilterCount?: number
  /** Callback to clear all filters */
  onClearAll?: () => void
  /** Additional className */
  className?: string
}

// -----------------------------------------------------------------------------
// Helper: Format date range
// -----------------------------------------------------------------------------

function defaultFormatRange(from: Date | null, to: Date | null): string {
  if (!from && !to) return "Select dates"
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  const fromStr = from ? from.toLocaleDateString("en-US", options) : ""
  const toStr = to ? to.toLocaleDateString("en-US", options) : ""
  if (fromStr && toStr) return `${fromStr} - ${toStr}`
  if (fromStr) return `From ${fromStr}`
  if (toStr) return `Until ${toStr}`
  return "Select dates"
}

// -----------------------------------------------------------------------------
// Sub-components
// -----------------------------------------------------------------------------

function DateRangePicker({ config }: { config: DateRangeConfig }) {
  const formatFn = config.formatRange || defaultFormatRange
  const displayText = formatFn(config.from, config.to)

  return (
    <div className="ts-date-picker">
      <button
        type="button"
        className="ts-date-nav-btn"
        onClick={config.onPrevious}
        aria-label="Previous period"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <button type="button" className="ts-date-range-btn">
        <CalendarIcon className="size-4" />
        <span>{displayText}</span>
      </button>
      <button
        type="button"
        className="ts-date-nav-btn"
        onClick={config.onNext}
        aria-label="Next period"
      >
        <ChevronRightIcon className="size-4" />
      </button>
    </div>
  )
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="ts-search-input">
      <SearchIcon className="size-4" aria-hidden="true" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search"
      />
    </div>
  )
}

function FilterChipComponent({ chip }: { chip: FilterChipConfig }) {
  return (
    <span className="ts-filter-chip">
      {chip.label}
      <button
        type="button"
        className="ts-filter-chip-remove"
        onClick={chip.onRemove}
        aria-label={`Remove ${chip.label} filter`}
      >
        <XIcon className="size-3" />
      </button>
    </span>
  )
}

function FilterDropdown({ config }: { config: FilterDropdownConfig }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isMultiSelect = config.multiSelect
  const selectedValues = Array.isArray(config.value)
    ? config.value
    : config.value
      ? [config.value]
      : []
  const hasSelection = selectedValues.length > 0

  const handleSelect = (optionValue: string) => {
    if (isMultiSelect) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue]
      config.onChange(newValues)
    } else {
      config.onChange(optionValue)
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={dropdownRef}
      className="ts-filter-dropdown"
      data-open={isOpen}
    >
      <button
        type="button"
        className={cn(
          "ts-filter-dropdown-btn",
          hasSelection && "ts-filter-dropdown-btn--active"
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {config.label}
        <ChevronDownIcon className="ts-filter-dropdown-chevron size-4" />
      </button>

      {isOpen && (
        <div className="ts-filter-dropdown-menu" role="listbox">
          {config.options.map((option) => {
            const isSelected = selectedValues.includes(option.value)
            return isMultiSelect ? (
              <label
                key={option.value}
                className="ts-filter-multi-item"
              >
                <input
                  type="checkbox"
                  className="ts-filter-multi-checkbox"
                  checked={isSelected}
                  onChange={() => handleSelect(option.value)}
                />
                {option.label}
              </label>
            ) : (
              <button
                key={option.value}
                type="button"
                className={cn(
                  "ts-filter-dropdown-item",
                  isSelected && "ts-filter-dropdown-item--selected"
                )}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={isSelected}
              >
                <span className="ts-filter-dropdown-item-check">
                  {isSelected && <CheckIcon className="size-4" />}
                </span>
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

/**
 * A horizontal inline filter bar component matching the brand system design.
 *
 * Features:
 * - Date range picker with prev/next navigation
 * - Search input with icon
 * - Removable filter chips
 * - Dropdown filters (single and multi-select)
 * - Filter summary with count
 * - Clear all filters link
 *
 * @example
 * ```tsx
 * <DataTableFilterBar
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   searchPlaceholder="Search..."
 *   dateRange={{
 *     from: startDate,
 *     to: endDate,
 *     onPrevious: () => shiftWeek(-1),
 *     onNext: () => shiftWeek(1),
 *   }}
 *   chips={[
 *     { key: 'user', label: 'Sam Sample', onRemove: () => clearUser() },
 *   ]}
 *   filters={[
 *     {
 *       key: 'customer',
 *       label: 'Customers',
 *       options: [{ value: 'all', label: 'All' }, ...],
 *       value: selectedCustomer,
 *       onChange: setSelectedCustomer,
 *     },
 *   ]}
 *   totalItems={156}
 *   shownItems={12}
 *   activeFilterCount={3}
 *   onClearAll={() => resetFilters()}
 * />
 * ```
 */
function DataTableFilterBar({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  dateRange,
  chips = [],
  filters = [],
  totalItems,
  shownItems,
  activeFilterCount,
  onClearAll,
  className,
}: DataTableFilterBarProps) {
  const showSummary = totalItems !== undefined || activeFilterCount !== undefined

  return (
    <div className={cn("space-y-2", className)}>
      {/* Filter Bar */}
      <div className="ts-filter-bar">
        {/* Date Range Picker */}
        {dateRange && <DateRangePicker config={dateRange} />}

        {/* Search Input */}
        {onSearchChange && (
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
          />
        )}

        {/* Filter Chips (removable) */}
        {chips.map((chip) => (
          <FilterChipComponent key={chip.key} chip={chip} />
        ))}

        {/* Dropdown Filters */}
        {filters.map((filter) => (
          <FilterDropdown key={filter.key} config={filter} />
        ))}
      </div>

      {/* Filter Summary */}
      {showSummary && (
        <div className="ts-filter-summary">
          <span className="ts-filter-summary-text">
            {shownItems !== undefined && totalItems !== undefined ? (
              <>
                Showing{" "}
                <span className="ts-filter-summary-count">{shownItems}</span> of{" "}
                <span className="ts-filter-summary-count">{totalItems}</span> entries
                {activeFilterCount !== undefined && activeFilterCount > 0 && (
                  <> ({activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} active)</>
                )}
              </>
            ) : activeFilterCount !== undefined && activeFilterCount > 0 ? (
              <>{activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} active</>
            ) : null}
          </span>

          {onClearAll && activeFilterCount !== undefined && activeFilterCount > 0 && (
            <button
              type="button"
              className="ts-filter-clear"
              onClick={onClearAll}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------

export {
  DataTableFilterBar,
  DateRangePicker,
  SearchInput,
  FilterChipComponent as FilterChip,
  FilterDropdown,
}
