import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown, Minus, Flame, Award, Medal } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { weeklyLeaderboard, departmentRankings, badgeTypes } from '@/data/leaderboard';
import { Button } from '@/components/ui/button';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  if (loading) return <AppLayout><div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonCard key={i} hasAvatar />)}</div></AppLayout>;

  const top3 = weeklyLeaderboard.slice(0, 3);
  const rest = weeklyLeaderboard.slice(3);

  return (
    <AppLayout>
      <PageHeader title="Leaderboard" subtitle="Top contributors this week" icon={<Trophy size={18} />}
        actions={
          <div className="flex gap-1.5">
            <Button variant={period === 'weekly' ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => setPeriod('weekly')}>Weekly</Button>
            <Button variant={period === 'monthly' ? 'default' : 'outline'} size="sm" className="h-8 text-xs" onClick={() => setPeriod('monthly')}>Monthly</Button>
          </div>
        }
      />

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[top3[1], top3[0], top3[2]].map((l, idx) => {
          const actualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
          const heights = ['h-28', 'h-36', 'h-24'];
          const medals = ['🥈', '🥇', '🥉'];
          return (
            <motion.div
              key={l.employeeId}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              data-testid={`podium-${actualRank}`}
            >
              <div className="relative mb-2">
                <GradientAvatar name={l.name} color={l.avatarColor} initials={l.initials} size={actualRank === 1 ? 'xl' : 'lg'} showRing />
                <span className="absolute -top-1 -right-1 text-lg leading-none">{medals[idx]}</span>
              </div>
              <p className="text-xs font-bold text-foreground text-center leading-tight">{l.name.split(' ')[0]}</p>
              <p className="text-[10px] text-muted-foreground text-center">{l.department}</p>
              <p className="text-sm font-bold text-primary mt-1">{l.points.toLocaleString()}</p>
              <div className={`w-full ${heights[idx]} bg-gradient-to-t from-primary/20 to-primary/5 border border-primary/20 rounded-t-lg mt-2 flex items-end justify-center pb-2`}>
                <span className="text-2xl font-black text-primary/40">{actualRank}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Full Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Full Rankings</h2>
            </div>
            <motion.div variants={container} initial="hidden" animate="show">
              {weeklyLeaderboard.map((l) => (
                <motion.div key={l.employeeId} variants={item}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                  data-testid={`leaderboard-row-${l.employeeId}`}
                >
                  <span className={`text-sm font-bold w-6 text-center flex-shrink-0 ${l.rank <= 3 ? 'text-amber-500' : 'text-muted-foreground'}`}>{l.rank}</span>
                  <GradientAvatar name={l.name} color={l.avatarColor} initials={l.initials} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.role} · {l.department}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Award size={12} />{l.badges}</span>
                    <span className="flex items-center gap-1"><Flame size={12} className="text-orange-400" />{l.streak}d</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{l.points.toLocaleString()}</p>
                    <div className={`flex items-center gap-0.5 justify-end text-[10px] font-medium ${l.trend === 'up' ? 'text-emerald-500' : l.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {l.trend === 'up' ? <TrendingUp size={10} /> : l.trend === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                      {l.rankChange !== 0 ? Math.abs(l.rankChange) : '-'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Department Rankings */}
          <div className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Medal size={15} className="text-amber-500" />Department Rankings</h3>
            </div>
            <div className="divide-y divide-border">
              {departmentRankings.map(d => (
                <div key={d.department} className="px-5 py-3 flex items-center gap-3" data-testid={`dept-rank-${d.rank}`}>
                  <span className={`text-sm font-bold w-5 flex-shrink-0 ${d.rank <= 3 ? 'text-amber-500' : 'text-muted-foreground'}`}>{d.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{d.department}</p>
                    <p className="text-xs text-muted-foreground">{d.members} members</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{d.score}</p>
                    <span className={`text-[10px] ${d.trend === 'up' ? 'text-emerald-500' : d.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '—'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Award size={15} className="text-primary" />Badge Distribution</h3>
            <div className="space-y-3">
              {badgeTypes.map(b => (
                <div key={b.name} data-testid={`badge-dist-${b.name.replace(/\s+/g, '-').toLowerCase()}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{b.name}</span>
                    <span className="text-xs font-bold text-foreground">{b.count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: b.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(b.count / 15) * 100}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
