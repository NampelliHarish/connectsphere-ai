import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, TrendingUp, MessageSquare, Star, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { useAuth } from '@/context/AuthContext';
import { engagementTrend, departmentActivity, platformMetrics } from '@/data/analytics';
import { announcements } from '@/data/announcements';
import { employees } from '@/data/employees';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 600); }, []);

  if (user?.systemRole !== 'admin' && user?.systemRole !== 'ceo') {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Shield size={40} className="text-muted-foreground mb-4 opacity-40" />
          <h2 className="text-lg font-semibold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-1">This area is only available to HR Admins and Executives.</p>
        </div>
      </AppLayout>
    );
  }

  if (loading) {
    return <AppLayout><div className="space-y-4">{[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={4} />)}</div></AppLayout>;
  }

  const moderationItems = [
    { id: 'm1', type: 'Thread', content: 'Potentially sensitive thread in Random group', severity: 'low', date: '2h ago' },
    { id: 'm2', type: 'Announcement', content: 'Announcement pending approval from Lisa Park', severity: 'medium', date: '4h ago' },
    { id: 'm3', type: 'Recognition', content: 'Recognition flagged for review — inappropriate language?', severity: 'low', date: '1d ago' },
  ];

  return (
    <AppLayout>
      <PageHeader title="Admin Command Center" subtitle="Platform analytics, moderation, and management" icon={<Shield size={18} />} />

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Employees" value={platformMetrics.totalEmployees} icon={<Users size={16} />} />
          <StatCard label="Active This Week" value={platformMetrics.activeThisWeek} trend={8} description={`${Math.round(platformMetrics.activeThisWeek / platformMetrics.totalEmployees * 100)}% of total`} icon={<Activity size={16} />} />
          <StatCard label="Engagement Score" value={platformMetrics.engagementScore} suffix="%" trend={3} icon={<TrendingUp size={16} />} />
          <StatCard label="Avg Session" value={platformMetrics.avgSessionMinutes} suffix=" min" trend={2} icon={<Activity size={16} />} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Chart */}
          <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Engagement Trend</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={engagementTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} domain={[60, 100]} width={30} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} dot={false} name="Engagement" />
                <Line type="monotone" dataKey="recognitions" stroke="#10b981" strokeWidth={2} dot={false} name="Recognitions" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Dept Activity */}
          <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Department Activity</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={departmentActivity} layout="vertical" margin={{ left: 0, right: 10 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: 'var(--color-muted-foreground)' }} width={70} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Moderation Queue + Announcement Mgmt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item} className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500" />Moderation Queue
              </h2>
              <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">{moderationItems.length} items</span>
            </div>
            <div className="divide-y divide-border">
              {moderationItems.map(m => (
                <div key={m.id} className="px-5 py-3.5 flex items-start gap-3" data-testid={`moderation-${m.id}`}>
                  <AlertTriangle size={15} className={m.severity === 'medium' ? 'text-amber-500 mt-0.5' : 'text-muted-foreground mt-0.5'} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">{m.type}</p>
                    <p className="text-sm text-foreground mt-0.5">{m.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{m.date}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast({ title: 'Dismissed' })} data-testid={`dismiss-${m.id}`}>Dismiss</Button>
                    <Button size="sm" className="h-7 text-xs gap-1" onClick={() => toast({ title: 'Resolved' })} data-testid={`resolve-${m.id}`}><CheckCircle size={11} />Resolve</Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User Roles */}
          <motion.div variants={item} className="bg-card border border-card-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2"><Shield size={15} className="text-primary" />User Role Management</h2>
            </div>
            <div className="divide-y divide-border max-h-64 overflow-y-auto">
              {employees.slice(0, 8).map(emp => (
                <div key={emp.id} className="px-5 py-3 flex items-center gap-3" data-testid={`user-role-${emp.id}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: emp.avatarColor }}>
                    {emp.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{emp.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{emp.department}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    emp.id === '1' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                    emp.id === '2' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {emp.id === '1' ? 'CEO' : emp.id === '2' ? 'Admin' : 'Employee'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Dept participation */}
        <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Star size={15} className="text-primary" />Department Participation Scores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentActivity.map(d => (
              <div key={d.department} className="space-y-1.5" data-testid={`dept-participation-${d.department.toLowerCase()}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{d.department}</span>
                  <span className="text-sm font-bold text-foreground">{d.score}%</span>
                </div>
                <Progress value={d.score} className="h-2" />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{d.members} members</span>
                  <span>{d.posts} posts</span>
                  <span>{d.recognitions} kudos</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
