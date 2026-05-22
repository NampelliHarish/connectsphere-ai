interface GradientAvatarProps {
  name: string;
  color?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showRing?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function GradientAvatar({ name, color, initials, size = 'md', className = '', showRing }: GradientAvatarProps) {
  const computedInitials = initials ?? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const bg = color ?? '#6366f1';

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 ${showRing ? 'ring-2 ring-white dark:ring-sidebar' : ''} ${className}`}
      style={{ backgroundColor: bg }}
      data-testid={`avatar-${name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      {computedInitials}
    </div>
  );
}
