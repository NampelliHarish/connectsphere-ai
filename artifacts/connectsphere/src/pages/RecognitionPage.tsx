import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Award, Gift, CalendarDays, Heart, Plus, Trophy } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { recognitions, birthdays, workAnniversaries, type Recognition, type Badge } from '@/data/recognition';
import { employees } from '@/data/employees';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const badgeColors: Record<Badge, string> = {
  Innovator: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800',
  'Team Player': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
  Leader: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
  Mentor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
  Visionary: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800',
  'Culture Champion': 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800',
  'Top Performer': 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800',
  'Problem Solver': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800',
  'Rising Star': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
  'Game Changer': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800',
};

const BADGES: Badge[] = ['Innovator', 'Team Player', 'Leader', 'Mentor', 'Top Performer', 'Culture Champion', 'Rising Star', 'Game Changer', 'Problem Solver', 'Visionary'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function RecognitionPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Recognition[]>(recognitions);
  const [showModal, setShowModal] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [badge, setBadge] = useState<Badge>('Team Player');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleLike = (id: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r));
  };

  const handleSubmit = () => {
    if (!recipientId || !message.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      const recipient = employees.find(e => e.id === recipientId);
      if (recipient) {
        const newRec: Recognition = {
          id: `r-new-${Date.now()}`, giverId: '3', giverName: 'Alex Rivera',
          receiverId: recipient.id, receiverName: recipient.name, receiverRole: recipient.role,
          receiverDept: recipient.department, message, badge, date: new Date().toISOString().split('T')[0],
          likes: 0, liked: false, avatarColor: recipient.avatarColor,
        };
        setItems(prev => [newRec, ...prev]);
      }
      setSubmitting(false);
      setShowModal(false);
      setMessage('');
      setRecipientId('');
      toast({ title: 'Recognition sent!', description: `Your appreciation has been shared with the team.` });
    }, 800);
  };

  if (loading) {
    return <AppLayout><div className="space-y-4">{[...Array(6)].map((_, i) => <SkeletonCard key={i} hasAvatar lines={3} />)}</div></AppLayout>;
  }

  return (
    <AppLayout>
      <PageHeader
        title="Recognition"
        subtitle="Celebrate achievements and appreciate your teammates"
        icon={<Star size={18} />}
        actions={
          <Button onClick={() => setShowModal(true)} size="sm" className="gap-2" data-testid="button-appreciate">
            <Plus size={15} />Appreciate Someone
          </Button>
        }
      />

      {/* Birthdays & Anniversaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Gift size={15} className="text-pink-500" />
            <h3 className="text-sm font-semibold text-foreground">Birthdays This Month</h3>
          </div>
          <div className="space-y-2">
            {birthdays.map(b => {
              const emp = employees.find(e => e.id === b.id);
              return (
                <div key={b.id} className="flex items-center gap-2">
                  <GradientAvatar name={b.name} color={emp?.avatarColor} initials={b.name.split(' ').map(n => n[0]).join('')} size="sm" />
                  <span className="text-sm font-medium text-foreground">{b.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{b.date}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={15} className="text-amber-500" />
            <h3 className="text-sm font-semibold text-foreground">Work Anniversaries</h3>
          </div>
          <div className="space-y-2">
            {workAnniversaries.map(a => {
              const emp = employees.find(e => e.id === a.id);
              return (
                <div key={a.id} className="flex items-center gap-2">
                  <GradientAvatar name={a.name} color={emp?.avatarColor} initials={a.name.split(' ').map(n => n[0]).join('')} size="sm" />
                  <span className="text-sm font-medium text-foreground">{a.name}</span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 ml-auto">{a.years} years · {a.date}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recognition Wall */}
      <motion.div className="space-y-4" variants={container} initial="hidden" animate="show">
        {items.map(r => (
          <motion.article key={r.id} variants={item} className="bg-card border border-card-border rounded-xl p-5 hover:shadow-md transition-all" data-testid={`recognition-card-${r.id}`}>
            <div className="flex gap-4">
              <GradientAvatar name={r.receiverName} color={r.avatarColor} initials={r.receiverName.split(' ').map(n => n[0]).join('')} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      <span className="text-muted-foreground font-normal">From </span>{r.giverName}
                      <span className="text-muted-foreground font-normal"> to </span>{r.receiverName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.receiverRole} · {r.receiverDept}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${badgeColors[r.badge]}`}>
                    <Award size={11} className="inline mr-1" />{r.badge}
                  </span>
                </div>
                <blockquote className="mt-3 text-sm text-foreground leading-relaxed border-l-2 border-primary/30 pl-3 italic">
                  "{r.message}"
                </blockquote>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  <button
                    onClick={() => handleLike(r.id)}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${r.liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                    data-testid={`like-recognition-${r.id}`}
                  >
                    <Heart size={13} className={r.liked ? 'fill-current' : ''} />
                    {r.likes}
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* Send Appreciation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md" aria-describedby="appreciate-form-desc">
          <DialogHeader>
            <DialogTitle>Appreciate a Colleague</DialogTitle>
          </DialogHeader>
          <div id="appreciate-form-desc" className="space-y-4 pt-2">
            <div>
              <Label className="text-xs font-semibold">Recipient</Label>
              <Select value={recipientId} onValueChange={setRecipientId}>
                <SelectTrigger className="mt-1.5" data-testid="select-recipient">
                  <SelectValue placeholder="Choose a teammate..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.filter(e => e.id !== '3').map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.name} · {e.department}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Badge</Label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                {BADGES.slice(0, 6).map(b => (
                  <button
                    key={b}
                    onClick={() => setBadge(b)}
                    className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all text-left ${badge === b ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
                    data-testid={`badge-option-${b.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Message</Label>
              <Textarea
                className="mt-1.5 text-sm resize-none"
                rows={4}
                placeholder="Tell them why you appreciate them..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                data-testid="textarea-recognition-message"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={submitting || !recipientId || !message.trim()} data-testid="button-submit-recognition">
                {submitting ? 'Sending...' : <><Star size={14} />Send Appreciation</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
