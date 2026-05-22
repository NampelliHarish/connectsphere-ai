import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Search, Bookmark, BookmarkCheck, ThumbsUp, MessageSquare, Pin, Filter } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { announcements, type Announcement } from '@/data/announcements';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DEPTS = ['All', 'Engineering', 'Marketing', 'HR', 'Sales', 'Design', 'Finance', 'Operations'];
const priorityBadge: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
  high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  celebration: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dept, setDept] = useState('All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<Announcement[]>(announcements);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = items.filter(a => {
    const matchDept = dept === 'All' || a.department === dept || a.department === 'All';
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const pinned = filtered.filter(a => a.pinned);
  const regular = filtered.filter(a => !a.pinned);

  const toggleBookmark = (id: string) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, bookmarked: !a.bookmarked } : a));
    const ann = items.find(a => a.id === id);
    toast({ title: ann?.bookmarked ? 'Removed bookmark' : 'Bookmarked', description: ann?.title });
  };

  const handleReact = (id: string, reaction: string) => {
    setItems(prev => prev.map(a => a.id === id ? {
      ...a,
      reactions: { ...a.reactions, [reaction]: (a.reactions[reaction] ?? 0) + 1 }
    } : a));
  };

  if (loading) {
    return <AppLayout><div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonCard key={i} hasAvatar lines={3} />)}</div></AppLayout>;
  }

  const AnnouncementCard = ({ a }: { a: Announcement }) => (
    <motion.article
      variants={item}
      className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md transition-all"
      data-testid={`announcement-${a.id}`}
    >
      <div className="flex items-start gap-4">
        <GradientAvatar
          name={a.authorName}
          initials={a.authorName.split(' ').map(n => n[0]).join('')}
          color="#6366f1"
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {a.pinned && (
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <Pin size={11} />Pinned
                </span>
              )}
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${priorityBadge[a.priority]}`}>
                {a.priority}
              </span>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{a.department}</span>
            </div>
            <button
              onClick={() => toggleBookmark(a.id)}
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              data-testid={`bookmark-${a.id}`}
            >
              {a.bookmarked ? <BookmarkCheck size={16} className="text-primary" /> : <Bookmark size={16} />}
            </button>
          </div>

          <h2 className="text-base font-semibold text-foreground mt-2 leading-tight">{a.title}</h2>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{a.body}</p>

          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {a.tags.map(tag => (
              <span key={tag} className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">#{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground font-medium">{a.authorName}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleReact(a.id, 'thumbsup')}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                data-testid={`react-${a.id}`}
              >
                <ThumbsUp size={13} />
                <span>{Object.values(a.reactions).reduce((s, v) => s + v, 0)}</span>
              </button>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MessageSquare size={13} />
                <span>{a.commentCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );

  return (
    <AppLayout>
      <PageHeader
        title="Announcements"
        subtitle="Stay informed with the latest company news"
        icon={<Megaphone size={18} />}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
            data-testid="input-search-announcements"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {DEPTS.slice(0, 5).map(d => (
            <Button
              key={d}
              variant={dept === d ? 'default' : 'outline'}
              size="sm"
              className="h-9 text-xs"
              onClick={() => setDept(d)}
              data-testid={`filter-dept-${d.toLowerCase()}`}
            >
              {d}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="h-9 text-xs gap-1">
            <Filter size={12} />More
          </Button>
        </div>
      </div>

      <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
        {pinned.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Pin size={12} />Pinned</p>
            <div className="space-y-3">{pinned.map(a => <AnnouncementCard key={a.id} a={a} />)}</div>
          </div>
        )}
        {regular.length > 0 && (
          <div>
            {pinned.length > 0 && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5">Recent</p>}
            <div className="space-y-3">{regular.map(a => <AnnouncementCard key={a.id} a={a} />)}</div>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Megaphone size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No announcements found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter</p>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
