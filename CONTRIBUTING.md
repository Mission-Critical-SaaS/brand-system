# Contributing to @mission-critical-saas/brand-system

## Development Setup

```bash
# Clone the repo
git clone https://github.com/Mission-Critical-SaaS/brand-system.git
cd brand-system

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run dev

# Type check
npm run typecheck
```

## Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run `npm run build` to verify the build works
4. Commit with a descriptive message
5. Push and create a Pull Request

## Pull Request Labels

Use these labels on PRs to categorize changes for release notes:

| Label | Version Bump | Description |
|-------|--------------|-------------|
| `breaking` | Major | Breaking changes |
| `feature` | Minor | New features |
| `enhancement` | Minor | Improvements to existing features |
| `fix` | Patch | Bug fixes |
| `chore` | Patch | Maintenance tasks |
| `dependencies` | Patch | Dependency updates |
| `documentation` | Patch | Documentation changes |

## Release Process

Releases are managed via GitHub:

### 1. Draft Release
- Release Drafter automatically creates/updates a draft release as PRs are merged
- Review the draft at: https://github.com/Mission-Critical-SaaS/brand-system/releases

### 2. Publish Release
```bash
# Update version in package.json
npm version patch  # or minor, major

# Push the tag
git push --tags

# The publish workflow will automatically:
# 1. Build the package
# 2. Publish to GitHub Packages
```

### 3. Update CHANGELOG
After releasing, update CHANGELOG.md with the release notes.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes to API or CSS classes
- **MINOR** (1.0.0 → 1.1.0): New features, components, or tokens
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, documentation, dependency updates

## Project Structure

```
src/
├── tokens/
│   ├── colors.ts          # TypeScript color constants
│   ├── brand-tokens.css   # CSS custom properties
│   └── index.ts           # Token exports
├── components/
│   ├── BrandProvider.tsx  # React context provider
│   ├── TrustBadges.tsx    # Trust badge component
│   └── index.ts           # Component exports
├── icons/
│   ├── hour/              # Hour Timesheet icons
│   ├── minute7/           # Minute7 icons
│   ├── lmntl/             # LMNTL.AI icons
│   └── mcs/               # MCS corporate icons
└── tailwind-preset.ts     # Tailwind CSS preset
```

## Questions?

Open an issue or reach out to the MCS team.
