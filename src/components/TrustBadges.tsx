

export type TrustBadgeType =
  | 'dcaa'
  | 'quickbooks'
  | 'secure'
  | 'support'
  | 'audit'
  | 'compliance'
  | 'mobile'
  | 'sync';

export interface TrustBadgesProps {
  badges: TrustBadgeType[];
  layout?: 'horizontal' | 'vertical' | 'compact';
  showLabels?: boolean;
  className?: string;
}

const badgeConfig: Record<TrustBadgeType, { label: string; icon: string }> = {
  dcaa: { label: 'DCAA Compliant', icon: '✓' },
  quickbooks: { label: 'QuickBooks Sync', icon: '⟲' },
  secure: { label: 'Bank-Level Security', icon: '🔒' },
  support: { label: '24/7 Support', icon: '💬' },
  audit: { label: 'Audit Ready', icon: '📋' },
  compliance: { label: 'Full Compliance', icon: '✓' },
  mobile: { label: 'Mobile Ready', icon: '📱' },
  sync: { label: 'Real-time Sync', icon: '⟳' },
};

/**
 * TrustBadges displays a collection of trust indicators for the brand.
 * Uses brand CSS variables for consistent styling.
 */
export function TrustBadges({
  badges,
  layout = 'horizontal',
  showLabels = true,
  className = '',
}: TrustBadgesProps) {
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'flex flex-col gap-2',
    compact: 'flex flex-wrap gap-2',
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {badges.map((badge) => {
        const config = badgeConfig[badge];
        return (
          <div
            key={badge}
            className={`
              inline-flex items-center gap-2
              ${layout === 'compact' ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-sm'}
              bg-[var(--brand-primary-50)]
              text-[var(--brand-primary-700)]
              rounded-full font-medium
            `}
          >
            <span>{config.icon}</span>
            {showLabels && <span>{config.label}</span>}
          </div>
        );
      })}
    </div>
  );
}
