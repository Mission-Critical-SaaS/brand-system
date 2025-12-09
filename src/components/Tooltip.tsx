/**
 * Tooltip Component
 *
 * A cursor-following tooltip component that displays additional information
 * on hover. Uses brand tokens for consistent styling across MCS products.
 *
 * Features:
 * - Follows cursor position
 * - Auto-flips to avoid viewport overflow
 * - Uses brand tokens for styling
 * - Supports custom content via children
 *
 * @example
 * ```tsx
 * <Tooltip content={<TooltipContent />}>
 *   <div className="has-tooltip">Hover me</div>
 * </Tooltip>
 * ```
 */

import React, { useState, useRef, useCallback, ReactNode } from 'react';

interface TooltipProps {
  /** The content to display inside the tooltip */
  content: ReactNode;
  /** The element that triggers the tooltip on hover */
  children: ReactNode;
  /** Optional CSS class name for the tooltip container */
  className?: string;
  /** Offset in pixels from the cursor (default: 12) */
  offset?: number;
}

interface TooltipDetailProps {
  label: string;
  value: string;
}

/**
 * TooltipDetail - A single label:value row inside a tooltip
 */
export const TooltipDetail: React.FC<TooltipDetailProps> = ({ label, value }) => (
  <div className="tooltip-detail">
    <span className="tooltip-label">{label}:</span> {value}
  </div>
);

interface TooltipHeaderProps {
  children: ReactNode;
}

/**
 * TooltipHeader - The header/title of the tooltip
 */
export const TooltipHeader: React.FC<TooltipHeaderProps> = ({ children }) => (
  <div className="tooltip-header">{children}</div>
);

/**
 * Tooltip - Main tooltip component with cursor-following behavior
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
  offset = 12,
}) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = tooltipRef.current?.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let x = e.clientX + offset;
      let y = e.clientY + offset;

      // Flip to left if would overflow right edge
      if (rect && x + rect.width > viewportWidth) {
        x = e.clientX - rect.width - offset;
      }

      // Flip to top if would overflow bottom edge
      if (rect && y + rect.height > viewportHeight) {
        y = e.clientY - rect.height - offset;
      }

      setPosition({ x, y });
    },
    [offset]
  );

  return (
    <div
      className={`tooltip-trigger ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
      style={{ position: 'relative' }}
    >
      {children}
      <div
        ref={tooltipRef}
        className={`brand-tooltip ${visible ? 'visible' : ''}`}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 1000,
          display: visible ? 'flex' : 'none',
          flexDirection: 'column',
          gap: '4px',
          background: 'white',
          border: '1px solid var(--brand-neutral-200)',
          borderRadius: 'var(--brand-radius-lg)',
          boxShadow: 'var(--brand-shadow-lg)',
          padding: 'var(--brand-space-3)',
          minWidth: '200px',
          maxWidth: '300px',
          pointerEvents: 'none',
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default Tooltip;

/**
 * CSS for tooltips (add to your stylesheet or use brand-tokens.css)
 *
 * .brand-tooltip {
 *   display: none;
 *   position: fixed;
 *   z-index: 1000;
 *   background: white;
 *   border: 1px solid var(--brand-neutral-200);
 *   border-radius: var(--brand-radius-lg);
 *   box-shadow: var(--brand-shadow-lg);
 *   padding: var(--brand-space-3);
 *   min-width: 200px;
 *   max-width: 300px;
 *   pointer-events: none;
 * }
 *
 * .brand-tooltip.visible {
 *   display: flex;
 *   flex-direction: column;
 *   gap: 4px;
 * }
 *
 * .tooltip-header {
 *   font-size: var(--brand-text-sm);
 *   font-weight: var(--brand-font-semibold);
 *   color: var(--brand-neutral-900);
 *   padding-bottom: var(--brand-space-2);
 *   border-bottom: 1px solid var(--brand-neutral-100);
 *   margin-bottom: var(--brand-space-1);
 * }
 *
 * .tooltip-detail {
 *   font-size: var(--brand-text-xs);
 *   color: var(--brand-neutral-600);
 *   display: flex;
 *   gap: var(--brand-space-1);
 * }
 *
 * .tooltip-label {
 *   font-weight: var(--brand-font-medium);
 *   color: var(--brand-neutral-500);
 *   min-width: 60px;
 * }
 */
