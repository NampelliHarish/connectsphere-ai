import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  Users, Star, Trophy, Calendar, TrendingUp, MessageSquare,
  Crown, Megaphone, ArrowRight, Flame, Target
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { AppLayout } from '@/layouts/AppLayout';
import { StatCard } from '@/components/common/StatCard';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { useAuth } from '@/context/AuthContext';
import { announcements } from '@/data/announcements';
import { events } from '@/data/events';
import { recognitions } from '@/data/recognition';
import { engagementTrend, sentimentData, kpis, platformMetrics } from '@/data/analytics';
import { leadershipMessages } from '@/data/leadership';
import { weeklyLeaderboard } from '@/data/leaderboard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  celebration: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
};

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pollVoted, setPollVoted] = useState<string | null>(null);
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const topAnnouncements = announcements.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const recentRecognitions = recognitions.slice(0, 4);
  const topLeaders = weeklyLeaderboard.slice(0, 5);
  const ceoMessage = leadershipMessages[0];

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <SkeletonCard lines={2} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} hasAvatar lines={2} />)}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={3} />)}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">

        {/* Greeting Banner */}
        <motion.div variants={item} className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-10">
            <svg viewBox="0 0 200 200" className="w-full h-full"><circle cx="150" cy="50" r="80" fill="white"/><circle cx="50" cy="150" r="60" fill="white"/></svg>
          </div>
          <div className="relative">
            <p className="text-indigo-200 text-sm font-medium">{greeting},</p>
            <h1 className="text-2xl font-bold mt-0.5">{user?.name} 👋</h1>
            <p className="text-indigo-200 text-sm mt-1">{user?.role} · {user?.department}</p>
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
                <Flame size={14} className="text-amber-300" />
                <span className="text-sm font-semibold">9 day streak</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
                <Trophy size={14} className="text-yellow-300" />
                <span className="text-sm font-semibold">Rank #7 this week</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1.5">
                <Star size={14} className="text-yellow-300" />
                <span className="text-sm font-semibold">3 badges earned</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Engagement Score" value={91} suffix="%" trend={3} icon={<TrendingUp size={16} />} />
          <StatCard label="Active Employees" value={platformMetrics.activeThisWeek} description={`of ${platformMetrics.totalEmployees} total`} icon={<Users size={16} />} />
          <StatCard label="Recognitions This Month" value={platformMetrics.recognitionsThisMonth} trend={12} icon={<Star size={16} />} />
          <StatCard label="Events This Month" value={platformMetrics.eventsThisMonth} icon={<Calendar size={16} />} />
        </motion.div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Engagement chart */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Engagement Trend</h2>
                <span className="text-xs text-muted-foreground">Last 12 months</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={engagementTrend}>
                  <defs>
                    <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#engGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Announcements */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Megaphone size={16} className="text-primary" />
                  Latest Announcements
                </h2>
                <Link href="/announcements">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">View all <ArrowRight size={12} /></Button>
                </Link>
              </div>
              <div className="divide-y divide-border">
                {topAnnouncements.map((a) => (
                  <div key={a.id} className="px-5 py-4 hover:bg-muted/30 transition-colors cursor-pointer" data-testid={`announcement-${a.id}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {a.pinned && <span className="text-xs font-semibold text-amber-500 uppercase tracking-wide block mb-1">Pinned</span>}
                        <p className="text-sm font-semibold text-foreground leading-tight">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground">{a.authorName}</span>
                          <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0 capitalize ${priorityColors[a.priority]}`}>
                        {a.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recognition Feed */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Star size={16} className="text-primary" />
                  Recognition Wall
                </h2>
                <Link href="/recognition">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">View all <ArrowRight size={12} /></Button>
                </Link>
              </div>
              <div className="divide-y divide-border">
                {recentRecognitions.map((r) => (
                  <div key={r.id} className="px-5 py-4 hover:bg-muted/30 transition-colors" data-testid={`recognition-${r.id}`}>
                    <div className="flex gap-3">
                      <GradientAvatar name={r.receiverName} color={r.avatarColor} initials={r.receiverName.split(' ').map(n => n[0]).join('')} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          <span className="font-semibold">{r.giverName}</span>
                          <span className="text-muted-foreground mx-1">appreciated</span>
                          <span className="font-semibold">{r.receiverName}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{r.message}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">{r.badge}</span>
                          <span className="text-xs text-muted-foreground">{r.likes} likes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-5">

            {/* Sentiment Pulse */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target size={15} className="text-primary" />
                Sentiment Pulse
              </h3>
              <div className="flex items-center gap-4">
                <PieChart width={90} height={90}>
                  <Pie data={sentimentData} cx={40} cy={40} innerRadius={28} outerRadius={42} paddingAngle={2} dataKey="value" strokeWidth={0}>
                    {sentimentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-1.5 flex-1">
                  {sentimentData.map(s => (
                    <div key={s.name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-xs text-foreground flex-1">{s.name}</span>
                      <span className="text-xs font-semibold text-foreground">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* KPIs */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">Company KPIs</h3>
              <div className="space-y-4">
                {kpis.map(kpi => (
                  <div key={kpi.label} data-testid={`kpi-${kpi.label.replace(/\s+/g, '-').toLowerCase()}`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-foreground">{kpi.label}</span>
                      <span className="text-xs font-bold text-foreground">{kpi.value}{kpi.unit}</span>
                    </div>
                    <Progress value={kpi.value} className="h-1.5" />
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">Target: {kpi.target}{kpi.unit}</span>
                      <span className="text-[10px] text-emerald-500 font-medium">+{kpi.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar size={15} className="text-primary" />
                  Upcoming Events
                </h3>
                <Link href="/events">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">All <ArrowRight size={12} /></Button>
                </Link>
              </div>
              <div className="divide-y divide-border">
                {upcomingEvents.map((ev) => {
                  const d = new Date(ev.date);
                  return (
                    <div key={ev.id} className="px-5 py-3 flex items-center gap-3 hover:bg-muted/30 cursor-pointer" data-testid={`event-${ev.id}`}>
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${ev.coverColor} flex flex-col items-center justify-center flex-shrink-0`}>
                        <span className="text-[10px] text-white font-medium">{d.toLocaleString('en', { month: 'short' })}</span>
                        <span className="text-sm text-white font-bold leading-none">{d.getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{ev.title}</p>
                        <p className="text-xs text-muted-foreground">{ev.time}</p>
                      </div>
                      {ev.isRsvped && <span className="text-xs text-emerald-500 font-medium flex-shrink-0">RSVP'd</span>}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Trophy size={15} className="text-amber-500" />
                  Top Performers
                </h3>
                <Link href="/leaderboard">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">All <ArrowRight size={12} /></Button>
                </Link>
              </div>
              <div className="divide-y divide-border">
                {topLeaders.map((l, idx) => (
                  <div key={l.employeeId} className="px-5 py-3 flex items-center gap-3" data-testid={`leaderboard-${l.employeeId}`}>
                    <span className={`text-sm font-bold w-5 flex-shrink-0 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                      {idx + 1}
                    </span>
                    <GradientAvatar name={l.name} color={l.avatarColor} initials={l.initials} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{l.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{l.department}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary flex-shrink-0">{l.points.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CEO Message */}
            <motion.div variants={item} className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Crown size={15} className="text-indigo-500" />
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">From Leadership</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-2 line-clamp-2">{ceoMessage.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-3">{ceoMessage.body}</p>
              <div className="flex items-center gap-2 mt-3">
                <GradientAvatar name="Sarah Chen" initials="SC" color="#6366f1" size="xs" />
                <span className="text-xs font-medium text-foreground">{ceoMessage.authorName}</span>
                <span className="text-xs text-muted-foreground">· {ceoMessage.authorRole}</span>
              </div>
              <Link href="/leadership">
                <Button variant="ghost" size="sm" className="mt-2 w-full gap-1 text-xs h-7 text-indigo-600 dark:text-indigo-400">Read more <ArrowRight size={12} /></Button>
              </Link>
            </motion.div>

            {/* Poll Widget */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-1">Quick Poll</h3>
              <p className="text-sm text-muted-foreground mb-4">What's your top priority this week?</p>
              <div className="space-y-2">
                {['Shipping features', 'Code quality', 'Team alignment', 'Customer feedback'].map((opt, i) => {
                  const pct = [38, 27, 21, 14][i];
                  return (
                    <button
                      key={opt}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition-all ${
                        pollVoted === opt
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                      onClick={() => setPollVoted(opt)}
                      data-testid={`poll-option-${i}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-foreground">{opt}</span>
                        {pollVoted && <span className="text-xs text-muted-foreground">{pct}%</span>}
                      </div>
                      {pollVoted && (
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
