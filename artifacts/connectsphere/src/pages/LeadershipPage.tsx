import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Target, TrendingUp, Eye, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { leadershipMessages, strategicGoals } from '@/data/leadership';
import { employees } from '@/data/employees';
import { Progress } from '@/components/ui/progress';

const typeLabel: Record<string, string> = {
  'ceo-message': 'CEO Message',
  update: 'Leadership Update',
  vision: 'Vision',
  townhall: 'Townhall',
};
const typeBadge: Record<string, string> = {
  'ceo-message': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  update: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  vision: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  townhall: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};
const statusConfig = {
  'on-track': { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: <CheckCircle size={13} /> },
  'at-risk': { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <AlertCircle size={13} /> },
  'completed': { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: <CheckCircle size={13} /> },
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function LeadershipPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  if (loading) return <AppLayout><div className="space-y-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} hasAvatar lines={4} />)}</div></AppLayout>;

  const featured = leadershipMessages[0];
  const rest = leadershipMessages.slice(1);

  return (
    <AppLayout>
      <PageHeader title="Leadership" subtitle="Messages, updates, and strategic direction" icon={<Crown size={18} />} />

      {/* Featured CEO Message */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
        data-testid="featured-message"
      >
        <div className="absolute right-0 top-0 bottom-0 w-48 opacity-10">
          <svg viewBox="0 0 200 200"><circle cx="160" cy="40" r="100" fill="white"/></svg>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wide">{typeLabel[featured.type]}</span>
            <Eye size={13} className="text-white/70" />
            <span className="text-xs text-white/70">{featured.views} views</span>
          </div>
          <h2 className="text-xl font-bold leading-tight mb-3">{featured.title}</h2>
          <p className="text-white/80 text-sm leading-relaxed line-clamp-4">{featured.body}</p>
          <div className="flex items-center gap-3 mt-5">
            <GradientAvatar name={featured.authorName} initials="SC" color="#ffffff33" size="md" />
            <div>
              <p className="text-sm font-semibold">{featured.authorName}</p>
              <p className="text-xs text-white/70">{featured.authorRole} · {new Date(featured.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-semibold text-foreground">Recent Updates</h2>
          <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
            {rest.map(msg => {
              const auth = employees.find(e => e.id === msg.authorId);
              return (
                <motion.article key={msg.id} variants={item}
                  className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group"
                  data-testid={`leadership-message-${msg.id}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeBadge[msg.type]}`}>{typeLabel[msg.type]}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Eye size={12} />{msg.views}</div>
                  </div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">{msg.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-3">{msg.body}</p>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                    <GradientAvatar name={msg.authorName} color={auth?.avatarColor ?? '#6366f1'} initials={msg.authorName.split(' ').map(n => n[0]).join('')} size="sm" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">{msg.authorName}</p>
                      <p className="text-xs text-muted-foreground">{msg.authorRole} · {new Date(msg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>

        {/* Strategic Goals */}
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground flex items-center gap-2"><Target size={16} className="text-primary" />Strategic Goals 2026</h2>
          <div className="space-y-3">
            {strategicGoals.map((goal, idx) => {
              const status = statusConfig[goal.status];
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-card border border-card-border rounded-xl p-4"
                  data-testid={`goal-${goal.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground leading-tight">{goal.title}</h4>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${status.bg} ${status.color}`}>
                      {status.icon}{goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{goal.description}</p>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-bold text-foreground">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-1.5" />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">Owner: {goal.owner.split(' ')[0]}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={10} />{goal.dueDate}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
