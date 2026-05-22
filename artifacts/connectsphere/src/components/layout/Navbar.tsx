import { useState } from 'react';
import { Bell, Sun, Moon, Search, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NotificationPanel } from '@/components/common/NotificationPanel';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'wouter';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  employee: { label: 'Employee', className: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25' },
  admin:    { label: 'Admin',    className: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/25' },
  ceo:      { label: 'CEO',      className: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25' },
};

const AVATAR_COLOR: Record<string, string> = {
  ceo:      '#6366f1',
  admin:    '#8b5cf6',
  employee: '#06b6d4',
};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const badge = user ? (ROLE_BADGE[user.systemRole] ?? ROLE_BADGE.employee) : null;
  const avatarColor = user ? (AVATAR_COLOR[user.systemRole] ?? '#06b6d4') : '#06b6d4';

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border h-14 flex items-center px-4 gap-4">
        {/* Global search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search employees, posts, events..."
              className="pl-9 h-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
              data-testid="input-global-search"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            data-testid="button-toggle-theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative"
            onClick={() => setNotifOpen(true)}
            data-testid="button-notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-background" />
          </Button>

          {/* Role badge — visible on sm+ screens */}
          {badge && (
            <span
              className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${badge.className}`}
              data-testid="role-badge"
            >
              {badge.label}
            </span>
          )}

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors ml-1"
                data-testid="button-user-menu"
              >
                <GradientAvatar
                  name={user?.name ?? 'U'}
                  initials={user?.avatar}
                  color={avatarColor}
                  size="sm"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-tight">{user?.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{user?.department}</p>
                </div>
                <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {/* User info header */}
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-semibold text-foreground">{user?.name}</p>
                <p className="text-[11px] text-muted-foreground">{user?.email}</p>
                {badge && (
                  <span className={`inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${badge.className}`}>
                    {badge.label}
                  </span>
                )}
              </div>
              <Link href="/profile">
                <DropdownMenuItem data-testid="menu-profile">My Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
                data-testid="menu-logout"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
}
