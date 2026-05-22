import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, CheckCircle, Circle, Video } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { events, type CompanyEvent } from '@/data/events';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const typeColors: Record<string, string> = {
  townhall: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  social: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  training: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  celebration: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  hackathon: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  offsite: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function EventsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<CompanyEvent[]>(events);
  const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming');

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const toggleRsvp = (id: string) => {
    setItems(prev => prev.map(e => e.id === id ? { ...e, isRsvped: !e.isRsvped, rsvpCount: e.isRsvped ? e.rsvpCount - 1 : e.rsvpCount + 1 } : e));
    const ev = items.find(e => e.id === id);
    toast({ title: ev?.isRsvped ? 'RSVP removed' : 'RSVP confirmed!', description: ev?.title });
  };

  if (loading) return <AppLayout><div className="grid sm:grid-cols-2 gap-4">{[...Array(6)].map((_, i) => <SkeletonCard key={i} lines={4} />)}</div></AppLayout>;

  const displayed = filter === 'upcoming' ? items.slice(0, 6) : items;

  return (
    <AppLayout>
      <PageHeader title="Events" subtitle="Company events, townhalls, and socials" icon={<Calendar size={18} />}
        actions={
          <div className="flex gap-1.5">
            <Button variant={filter === 'upcoming' ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => setFilter('upcoming')}>Upcoming</Button>
            <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => setFilter('all')}>All Events</Button>
          </div>
        }
      />

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={container} initial="hidden" animate="show">
        {displayed.map(ev => {
          const d = new Date(ev.date);
          const full = ev.maxCapacity && ev.rsvpCount >= ev.maxCapacity;
          return (
            <motion.div key={ev.id} variants={item}
              className="bg-card border border-card-border rounded-xl overflow-hidden hover:shadow-md transition-all group"
              data-testid={`event-card-${ev.id}`}
            >
              {/* Banner */}
              <div className={`h-28 bg-gradient-to-br ${ev.coverColor} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full capitalize">
                    {ev.type}
                  </span>
                  {ev.isVirtual && (
                    <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Video size={10} />Virtual
                    </span>
                  )}
                </div>
                {ev.isRsvped && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                )}
                {/* Date badge */}
                <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-sm rounded-xl p-2 text-center text-white min-w-[44px]">
                  <p className="text-[10px] font-medium leading-none">{d.toLocaleString('en', { month: 'short' }).toUpperCase()}</p>
                  <p className="text-xl font-black leading-tight">{d.getDate()}</p>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-foreground leading-tight line-clamp-2">{ev.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{ev.description}</p>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} className="flex-shrink-0" />{ev.time}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin size={12} className="flex-shrink-0" /><span className="truncate">{ev.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users size={12} className="flex-shrink-0" />
                    {ev.rsvpCount} RSVP'd{ev.maxCapacity ? ` · ${ev.maxCapacity - ev.rsvpCount} spots left` : ''}
                  </div>
                </div>

                {ev.maxCapacity && (
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${full ? 'bg-red-400' : 'bg-primary'}`}
                      style={{ width: `${Math.min(100, (ev.rsvpCount / ev.maxCapacity) * 100)}%` }}
                    />
                  </div>
                )}

                <Button
                  className={`w-full mt-4 h-8 text-xs gap-2 ${ev.isRsvped ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  disabled={full && !ev.isRsvped}
                  onClick={() => toggleRsvp(ev.id)}
                  data-testid={`rsvp-${ev.id}`}
                >
                  {ev.isRsvped ? <><CheckCircle size={13} />RSVP'd — Cancel</> : full ? 'Event Full' : <><Circle size={13} />RSVP</>}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </AppLayout>
  );
}
