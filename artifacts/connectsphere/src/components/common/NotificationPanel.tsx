import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Star, Calendar, Megaphone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GradientAvatar } from './GradientAvatar';

interface Notification {
  id: string;
  type: 'recognition' | 'mention' | 'event' | 'announcement';
  title: string;
  body: string;
  time: string;
  read: boolean;
  avatarColor?: string;
  initials?: string;
}

const mockNotifications: Notification[] = [
  { id: 'n1', type: 'recognition', title: 'You received a recognition', body: 'Priya Nair appreciated your work on the data pipeline refactor.', time: '2h ago', read: false, avatarColor: '#ec4899', initials: 'PN' },
  { id: 'n2', type: 'announcement', title: 'New announcement from Sarah Chen', body: 'ConnectSphere Closes $120M Series C Funding Round', time: '3h ago', read: false, avatarColor: '#6366f1', initials: 'SC' },
  { id: 'n3', type: 'event', title: 'Event reminder: Q2 All-Hands', body: 'Starting in 2 days — May 28th at 2PM PT. You have RSVP\'d.', time: '5h ago', read: true, avatarColor: '#f59e0b', initials: 'EV' },
  { id: 'n4', type: 'mention', title: 'You were mentioned in a thread', body: 'Alex Rivera mentioned you in "Database migration best practices"', time: '1d ago', read: true, avatarColor: '#06b6d4', initials: 'AR' },
  { id: 'n5', type: 'recognition', title: 'New badge earned', body: 'You\'ve earned the Innovator badge! You have 3 badges total.', time: '2d ago', read: true, avatarColor: '#6366f1', initials: 'CS' },
];

const typeIcon = {
  recognition: <Star size={14} className="text-amber-500" />,
  mention: <MessageSquare size={14} className="text-blue-500" />,
  event: <Calendar size={14} className="text-purple-500" />,
  announcement: <Megaphone size={14} className="text-red-500" />,
};

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const unread = mockNotifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-foreground" />
                <h2 className="font-semibold text-foreground">Notifications</h2>
                {unread > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-notifications">
                <X size={16} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {mockNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 px-4 py-3.5 border-b border-border hover:bg-muted/40 transition-colors cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}
                  data-testid={`notification-${notif.id}`}
                >
                  <div className="relative flex-shrink-0">
                    <GradientAvatar name={notif.initials ?? 'N'} initials={notif.initials} color={notif.avatarColor} size="sm" />
                    <span className="absolute -bottom-0.5 -right-0.5 bg-card border border-border rounded-full p-0.5">
                      {typeIcon[notif.type]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-tight">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.body}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                  </div>
                  {!notif.read && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <Button variant="outline" className="w-full text-sm" data-testid="button-mark-all-read">
                Mark all as read
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
