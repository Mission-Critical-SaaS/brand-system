import type { SVGProps } from 'react';

interface WordmarkProps extends SVGProps<SVGSVGElement> {
  height?: number | string;
  variant?: 'default' | 'white';
}

export function HourTimesheetWordmark({
  height = 24,
  variant = 'default',
  ...props
}: WordmarkProps) {
  const hourColor = variant === 'white' ? '#FB923C' : '#EA580C';
  const timesheetColor = variant === 'white' ? 'white' : '#1e293b';

  return (
    <svg
      viewBox="0 0 186 24"
      fill="none"
      height={height}
      style={{ width: 'auto' }}
      {...props}
    >
      {/* "Hour" in brand orange */}
      <text
        x="0"
        y="18"
        fontFamily="'Geist Sans', 'Inter', system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="700"
        fill={hourColor}
      >
        Hour
      </text>

      {/* "Timesheet" */}
      <text
        x="48"
        y="18"
        fontFamily="'Geist Sans', 'Inter', system-ui, -apple-system, sans-serif"
        fontSize="22"
        fontWeight="600"
        letterSpacing="-0.02em"
        fill={timesheetColor}
      >
        Timesheet
      </text>
    </svg>
  );
}
