import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Mail, Award, Star, Settings, Bell, Moon, Sun, Edit } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { useAuth } from '@/context/AuthContext';
import { employees } from '@/data/employees';
import { recognitions } from '@/data/recognition';
import { weeklyLeaderboard } from '@/data/leaderboard';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function ProfilePage() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const empData = employees.find(e => e.name === user?.name) ?? employees[2];
  const myRecognitions = recognitions.filter(r => r.receiverName === user?.name);
  const leaderboardEntry = weeklyLeaderboard.find(e => e.name === user?.name) ?? weeklyLeaderboard[6];

  if (loading) return <AppLayout><div className="space-y-4">{[...Array(3)].map((_, i) => <SkeletonCard key={i} hasAvatar lines={4} />)}</div></AppLayout>;

  return (
    <AppLayout>
      <motion.div className="space-y-6 max-w-4xl" variants={container} initial="hidden" animate="show">
        {/* Profile Header */}
        <motion.div variants={item} className="bg-card border border-card-border rounded-2xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-indigo-600 to-purple-600" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10">
              <div className="ring-4 ring-card rounded-full">
                <GradientAvatar name={user?.name ?? ''} initials={user?.avatar} color={user?.systemRole === 'ceo' ? '#6366f1' : user?.systemRole === 'admin' ? '#8b5cf6' : '#06b6d4'} size="xl" />
              </div>
              <div className="flex-1 pb-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
                  <StatusBadge status={empData.status} showLabel />
                </div>
                <p className="text-muted-foreground text-sm">{user?.role} · {user?.department}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs flex-shrink-0" onClick={() => toast({ title: 'Edit profile coming soon' })} data-testid="button-edit-profile">
                <Edit size={13} />Edit Profile
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xl">{empData.bio}</p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{empData.location}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} />{empData.email}</span>
              <span className="flex items-center gap-1.5"><User size={14} />Joined {new Date(empData.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {empData.skills.map(s => (
                <span key={s} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">{s}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="space-y-4">
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Star size={15} className="text-amber-500" />Engagement</h3>
              <div className="space-y-4">
                <div className="text-center py-3">
                  <p className="text-4xl font-black text-primary">{empData.points.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total Points</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{leaderboardEntry?.rank ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">Global Rank</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-foreground">{leaderboardEntry?.streak ?? 9}d</p>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Award size={15} className="text-primary" />Badges</h3>
              <div className="flex flex-wrap gap-2">
                {empData.badges.map(b => (
                  <span key={b} className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                    {b}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Progress to next badge</span>
                  <span className="text-xs font-medium text-foreground">68%</span>
                </div>
                <Progress value={68} className="h-1.5" />
              </div>
            </motion.div>
          </div>

          {/* Recognitions */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground">Recognitions Received</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{myRecognitions.length > 0 ? `${myRecognitions.length} recognitions` : 'No recognitions yet'}</p>
              </div>
              {myRecognitions.length > 0 ? (
                <div className="divide-y divide-border">
                  {myRecognitions.map(r => (
                    <div key={r.id} className="px-5 py-4" data-testid={`profile-recognition-${r.id}`}>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm font-medium text-muted-foreground">From <span className="text-foreground font-semibold">{r.giverName}</span></p>
                        <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full flex-shrink-0">{r.badge}</span>
                      </div>
                      <p className="text-sm text-foreground italic">"{r.message}"</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(r.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Star size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No recognitions yet — get involved and your peers will notice!</p>
                </div>
              )}
            </motion.div>

            {/* Settings */}
            <motion.div variants={item} className="bg-card border border-card-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Settings size={15} className="text-primary" />Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? <Moon size={16} className="text-muted-foreground" /> : <Sun size={16} className="text-muted-foreground" />}
                    <Label htmlFor="theme-toggle" className="text-sm font-medium cursor-pointer">Dark Mode</Label>
                  </div>
                  <Switch
                    id="theme-toggle"
                    checked={theme === 'dark'}
                    onCheckedChange={v => setTheme(v ? 'dark' : 'light')}
                    data-testid="switch-theme"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell size={16} className="text-muted-foreground" />
                    <Label htmlFor="notif-toggle" className="text-sm font-medium cursor-pointer">Push Notifications</Label>
                  </div>
                  <Switch id="notif-toggle" defaultChecked data-testid="switch-notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star size={16} className="text-muted-foreground" />
                    <Label htmlFor="rec-toggle" className="text-sm font-medium cursor-pointer">Recognition Alerts</Label>
                  </div>
                  <Switch id="rec-toggle" defaultChecked data-testid="switch-recognition-alerts" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
