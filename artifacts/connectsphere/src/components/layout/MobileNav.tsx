import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Megaphone, Users, Star, MessageSquare } from 'lucide-react';

const mobileNavItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/announcements', label: 'News', icon: Megaphone },
  { path: '/directory', label: 'People', icon: Users },
  { path: '/recognition', label: 'Kudos', icon: Star },
  { path: '/forum', label: 'Forum', icon: MessageSquare },
];


export function MobileNav() {
  const [location] = useLocation();
const active = mobileNavItems.some(({ path }) => path === '/' ? location === '/' : location.startsWith(path));
const label = active ? mobileNavItems.find(({ path }) => path === '/' ? location === '/' : location.startsWith(path))?.label : 'Menu';
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border safe-area-bottom">
      <div
  className={`flex flex-row items-center gap-0.5 py-2 px-1 rounded-xl transition-all duration-200 ${
    active
      ? 'bg-black text-white dark:bg-white dark:text-black'
      : 'bg-transparent text-muted-foreground'
  }`}
  data-testid={`mobile-nav-${label.toLowerCase()}`}
>
        {mobileNavItems.map(({ path, label, icon: Icon }) => {
          const active = path === '/' ? location === '/' : location.startsWith(path);
          return (
            <Link key={path} href={path} className="flex-1">
              <div
                className={`flex flex-col items-center gap-0.5 py-2 px-1 transition-colors ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
                data-testid={`mobile-nav-${label.toLowerCase()}`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium backdrop-blur-md bg-background/80">{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
