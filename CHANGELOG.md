# Changelog

All notable changes to `@mission-critical-saas/brand-system` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-12-08

### Added

- **Timesheet Component CSS** (`/styles/timesheet`)
  - Reusable CSS components for timesheet interfaces
  - View tabs (Calendar/List/Timesheet segmented control)
  - Calendar view with day columns, time slots, entry blocks
  - List view with collapsible week groups and entry cards
  - Entry card component with status badges
  - Detail panel for time entry editing
  - Audit log table with pagination
  - All components use `ts-` prefix for namespacing
  - Full brand token integration via `var(--brand-*)` custom properties
  - Works with `data-brand` attribute for brand switching

## [1.0.0] - 2025-12-06

### Added

- **CSS Tokens** (`/tokens/css`)
  - Complete CSS custom properties for all 4 brands (MCS, Minute7, Hour, LMNTL)
  - Colors, typography, spacing, shadows, transitions
  - 119 component classes (`.brand-btn`, `.brand-card`, etc.)
  - Brand switching via `data-brand` attribute

- **TypeScript Constants** (`/tokens`)
  - `colors` object with all brand color palettes
  - `getBrandColors(brand)` helper function
  - Full TypeScript types for type-safe usage

- **React Components** (`/components`)
  - `BrandProvider` - Context provider for brand theming
  - `TrustBadges` - Configurable trust badge display
  - `useBrand()` hook for accessing current brand

- **Icon Components** (`/icons/*`)
  - `/icons/hour` - Hour Timesheet icons (TimeTracking, DcaaCompliance, Reporting, etc.)
  - `/icons/minute7` - Minute7 icons (QuickBooksSync, ExpenseTracking, etc.)
  - `/icons/lmntl` - LMNTL.AI icons (AiPlatform, Analytics, etc.)
  - `/icons/mcs` - MCS corporate icons

- **Tailwind Preset** (`/tailwind-preset`)
  - Drop-in preset with all brand colors
  - Classes like `bg-mcs-blue`, `text-minute7-green`, `border-hour-orange`

### Infrastructure

- GitHub Packages publishing via GitHub Actions
- Automated builds on version tags (`v*`)
- TypeScript compilation with tsup
- ESM module format

[Unreleased]: https://github.com/Mission-Critical-SaaS/brand-system/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/Mission-Critical-SaaS/brand-system/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Mission-Critical-SaaS/brand-system/releases/tag/v1.0.0
