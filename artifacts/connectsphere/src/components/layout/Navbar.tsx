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

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b border-border h-14 flex items-center px-4 gap-4">
        {/* Search */}
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

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors" data-testid="button-user-menu">
                <GradientAvatar
                  name={user?.name ?? 'U'}
                  initials={user?.avatar}
                  color={user?.systemRole === 'ceo' ? '#6366f1' : user?.systemRole === 'admin' ? '#8b5cf6' : '#06b6d4'}
                  size="sm"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-foreground leading-tight">{user?.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{user?.department}</p>
                </div>
                <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Link href="/profile">
                <DropdownMenuItem data-testid="menu-profile">My Profile</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive" data-testid="menu-logout">
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
