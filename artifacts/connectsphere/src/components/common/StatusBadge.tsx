import type { EmployeeStatus } from '@/data/employees';

interface StatusBadgeProps {
  status: EmployeeStatus;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const statusConfig = {
  online: { dot: 'bg-emerald-400', label: 'Online', text: 'text-emerald-600 dark:text-emerald-400' },
  away: { dot: 'bg-amber-400', label: 'Away', text: 'text-amber-600 dark:text-amber-400' },
  busy: { dot: 'bg-red-400', label: 'Busy', text: 'text-red-600 dark:text-red-400' },
  offline: { dot: 'bg-muted-foreground', label: 'Offline', text: 'text-muted-foreground' },
};

export function StatusBadge({ status, showLabel, size = 'sm' }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <span className="flex items-center gap-1.5">
      <span className={`${dotSize} rounded-full ${cfg.dot} flex-shrink-0`} />
      {showLabel && <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>}
    </span>
  );
}
