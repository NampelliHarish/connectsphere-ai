import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, ThumbsUp, Plus, Hash, Search } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { forumGroups, forumThreads, type ForumThread } from '@/data/forum';
import { employees } from '@/data/employees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function ForumPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [threads, setThreads] = useState<ForumThread[]>(forumThreads);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const filtered = threads.filter(t => {
    const matchGroup = !activeGroup || t.groupId === activeGroup;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  const pinned = filtered.filter(t => t.pinned);
  const trending = filtered.filter(t => t.trending && !t.pinned);
  const regular = filtered.filter(t => !t.pinned && !t.trending);

  const handleLike = (id: string) => {
    setThreads(prev => prev.map(t => t.id === id ? { ...t, liked: !t.liked, likeCount: t.liked ? t.likeCount - 1 : t.likeCount + 1 } : t));
  };

  const ThreadCard = ({ t }: { t: ForumThread }) => {
    const author = employees.find(e => e.id === t.authorId);
    return (
      <motion.article variants={item}
        className="bg-card border border-card-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
        data-testid={`thread-${t.id}`}
      >
        <div className="flex gap-3">
          <GradientAvatar name={t.authorName} color={author?.avatarColor ?? '#6366f1'} initials={t.authorName.split(' ').map(n => n[0]).join('')} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                {t.trending && <span className="text-[10px] font-semibold text-orange-500 uppercase tracking-wide flex items-center gap-1 mb-0.5"><TrendingUp size={9} />Trending</span>}
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{t.title}</h3>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.body}</p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {t.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Hash size={9} />{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-medium">{t.authorName}</span>
                <span>·</span>
                <span>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={e => { e.stopPropagation(); handleLike(t.id); }}
                  className={`flex items-center gap-1 text-xs transition-colors ${t.liked ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                  data-testid={`like-thread-${t.id}`}
                >
                  <ThumbsUp size={12} className={t.liked ? 'fill-current' : ''} />{t.likeCount}
                </button>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MessageSquare size={12} />{t.replyCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  };

  if (loading) return <AppLayout><div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonCard key={i} hasAvatar lines={3} />)}</div></AppLayout>;

  return (
    <AppLayout>
      <PageHeader title="Forum" subtitle="Community discussions and department channels" icon={<MessageSquare size={18} />}
        actions={
          <Button size="sm" className="gap-2 h-8 text-xs"
            onClick={() => toast({ title: 'New thread', description: 'Thread creation coming soon!' })}
            data-testid="button-new-thread">
            <Plus size={13} />New Thread
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Groups Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-3">Groups</h3>
          <button
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${!activeGroup ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
            onClick={() => setActiveGroup(null)}
            data-testid="filter-group-all"
          >
            All Channels
          </button>
          {forumGroups.map(g => (
            <button key={g.id}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${activeGroup === g.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'}`}
              onClick={() => setActiveGroup(g.id)}
              data-testid={`filter-group-${g.id}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{g.name}</span>
                <span className="text-xs opacity-70">{g.memberCount}</span>
              </div>
              {activeGroup !== g.id && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{g.description}</p>}
            </button>
          ))}
        </div>

        {/* Threads */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search discussions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" data-testid="input-search-forum" />
          </div>

          <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
            {pinned.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Pinned</p>
                {pinned.map(t => <ThreadCard key={t.id} t={t} />)}
              </div>
            )}
            {trending.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2 flex items-center gap-1"><TrendingUp size={10} />Trending</p>
                {trending.map(t => <ThreadCard key={t.id} t={t} />)}
              </div>
            )}
            {regular.length > 0 && (
              <div>
                {(pinned.length > 0 || trending.length > 0) && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">Recent</p>}
                {regular.map(t => <ThreadCard key={t.id} t={t} />)}
              </div>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No discussions found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
