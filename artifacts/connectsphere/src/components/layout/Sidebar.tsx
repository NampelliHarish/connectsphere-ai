import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Megaphone, Users, Star, Trophy, Calendar,
  BookOpen, MessageSquare, Crown, Shield, ChevronLeft, ChevronRight,
  Zap, LogOut, Settings, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/directory', label: 'Directory', icon: Users },
  { path: '/recognition', label: 'Recognition', icon: Star },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/events', label: 'Events', icon: Calendar },
  { path: '/knowledge', label: 'Knowledge Hub', icon: BookOpen },
  { path: '/forum', label: 'Forum', icon: MessageSquare },
  { path: '/leadership', label: 'Leadership', icon: Crown },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const adminItems = user?.systemRole === 'admin' || user?.systemRole === 'ceo'
    ? [{ path: '/admin', label: 'Admin Center', icon: Shield }]
    : [];

  const allItems = [...navItems, ...adminItems];

  return (
    <motion.aside
      className="hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex-shrink-0 overflow-hidden"
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-sidebar-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="text-base font-bold text-sidebar-foreground whitespace-nowrap">ConnectSphere</span>
              <span className="text-xs font-medium text-indigo-400 block -mt-0.5">AI</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {allItems.map(({ path, label, icon: Icon }) => {
          const active = path === '/' ? location === '/' : location.startsWith(path);
          const item = (
            <Link href={path}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors relative group ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                whileHover={{ x: collapsed ? 0 : 2 }}
                transition={{ duration: 0.1 }}
                data-testid={`nav-${label.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {active && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-400 rounded-r-full"
                    layoutId="activeIndicator"
                  />
                )}
                <Icon size={18} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={path}>
                <TooltipTrigger asChild>{item}</TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            );
          }
          return <div key={path}>{item}</div>;
        })}
      </nav>

      {/* User + collapse */}
      <div className="border-t border-sidebar-border p-2 space-y-1">
        <Link href="/profile">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors ${collapsed ? 'justify-center' : ''}`} data-testid="nav-profile">
            <GradientAvatar
              name={user?.name ?? 'U'}
              initials={user?.avatar}
              color={user?.systemRole === 'ceo' ? '#6366f1' : user?.systemRole === 'admin' ? '#8b5cf6' : '#06b6d4'}
              size="sm"
            />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-sidebar-foreground/50 truncate">{user?.role}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        <button
          onClick={() => setCollapsed(v => !v)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${collapsed ? 'justify-center' : ''}`}
          data-testid="button-toggle-sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="text-xs">Collapse</span></>}
        </button>

        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${collapsed ? 'justify-center' : ''}`}
          data-testid="button-logout"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
