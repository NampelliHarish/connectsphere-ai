export interface ForumGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  color: string;
}

export interface ForumThread {
  id: string;
  groupId: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  date: string;
  replyCount: number;
  likeCount: number;
  liked: boolean;
  tags: string[];
  pinned: boolean;
  trending: boolean;
}

export const forumGroups: ForumGroup[] = [
  { id: 'g1', name: 'Engineering', description: 'Technical discussions, architecture, and dev best practices', memberCount: 52, icon: 'Code', color: '#06b6d4' },
  { id: 'g2', name: 'Product & Design', description: 'Product thinking, UX feedback, and design critique', memberCount: 38, icon: 'Layers', color: '#8b5cf6' },
  { id: 'g3', name: 'Random', description: 'Off-topic conversations, fun, and water cooler chat', memberCount: 198, icon: 'MessageCircle', color: '#f59e0b' },
  { id: 'g4', name: 'HR & Culture', description: 'Company culture, policies, and people programs', memberCount: 87, icon: 'Users', color: '#10b981' },
  { id: 'g5', name: 'Sales & Growth', description: 'Sales strategies, wins, and market insights', memberCount: 44, icon: 'TrendingUp', color: '#ef4444' },
  { id: 'g6', name: 'Learning & Development', description: 'Courses, books, conferences, and skill-sharing', memberCount: 123, icon: 'BookOpen', color: '#6366f1' },
];

export const forumThreads: ForumThread[] = [
  {
    id: 't1', groupId: 'g1',
    title: 'What\'s your approach to handling database migrations in production?',
    body: 'We\'ve been debating whether to use expand-contract pattern or feature flags for zero-downtime migrations. What has worked for your teams?',
    authorId: '3', authorName: 'Alex Rivera', authorRole: 'Senior Engineer', date: '2026-05-21',
    replyCount: 18, likeCount: 34, liked: true, tags: ['Database', 'Best Practices', 'DevOps'], pinned: false, trending: true,
  },
  {
    id: 't2', groupId: 'g2',
    title: 'Async or sync design reviews — what\'s the right balance?',
    body: 'Our team has been trying to move more design review work to async Loom/Figma comments but we miss the energy of live sessions. Has anyone found a good hybrid approach?',
    authorId: '6', authorName: 'Emma Larsson', authorRole: 'UX Designer', date: '2026-05-20',
    replyCount: 12, likeCount: 28, liked: false, tags: ['Design Process', 'Collaboration', 'Async'], pinned: false, trending: true,
  },
  {
    id: 't3', groupId: 'g3',
    title: 'Best standing desk setups? Share your home office photos',
    body: 'I\'ve been looking to upgrade my WFH setup and would love to see what everyone is working with. Drop your desk photos and gear lists!',
    authorId: '24', authorName: 'Ivan Kozlov', authorRole: 'ML Engineer', date: '2026-05-19',
    replyCount: 47, likeCount: 89, liked: true, tags: ['WFH', 'Setup', 'Productivity'], pinned: false, trending: true,
  },
  {
    id: 't4', groupId: 'g4',
    title: 'Ideas for improving our onboarding program — input requested',
    body: 'HR is redesigning the 30/60/90 day onboarding experience. We want input from people who recently joined and from managers. What was missing? What was great?',
    authorId: '2', authorName: 'Michael Torres', authorRole: 'HR Director', date: '2026-05-18',
    replyCount: 31, likeCount: 56, liked: false, tags: ['Onboarding', 'Culture', 'HR'], pinned: true, trending: false,
  },
  {
    id: 't5', groupId: 'g5',
    title: 'How are we positioning ConnectSphere vs. competitors in mid-market deals?',
    body: 'We\'ve been seeing more Slack + Notion combos in competitive deals. Would love to align on messaging and how we\'re differentiating on AI features.',
    authorId: '10', authorName: 'Olivia Grant', authorRole: 'Sales Director', date: '2026-05-17',
    replyCount: 14, likeCount: 22, liked: false, tags: ['Competitive', 'Positioning', 'Mid-Market'], pinned: false, trending: false,
  },
  {
    id: 't6', groupId: 'g6',
    title: 'Conference recs for Q3 — who\'s going to where?',
    body: 'Sharing what I\'m planning to attend: Strange Loop, SREcon, and AWS re:Invent. Would love to coordinate with colleagues who might be at the same events.',
    authorId: '11', authorName: 'Carlos Mendez', authorRole: 'DevOps Engineer', date: '2026-05-16',
    replyCount: 22, likeCount: 41, liked: true, tags: ['Conferences', 'Learning', 'Networking'], pinned: false, trending: false,
  },
  {
    id: 't7', groupId: 'g1',
    title: 'Structured logging best practices — what format do you use?',
    body: 'We\'re standardizing our logging across services. Currently debating JSON structured logs with Pino vs. a custom format. Also debating log levels and what belongs where.',
    authorId: '14', authorName: 'Yuki Tanaka', authorRole: 'Backend Engineer', date: '2026-05-15',
    replyCount: 9, likeCount: 19, liked: false, tags: ['Engineering', 'Logging', 'Observability'], pinned: false, trending: false,
  },
  {
    id: 't8', groupId: 'g3',
    title: 'Book club: reading list for this quarter?',
    body: 'The informal book club group is picking its Q2 reads. Suggestions welcome! Last quarter we did "Working Backwards" and "The Staff Engineer\'s Path". What\'s next?',
    authorId: '17', authorName: 'Nina Walsh', authorRole: 'HR Business Partner', date: '2026-05-14',
    replyCount: 38, likeCount: 67, liked: true, tags: ['Books', 'Learning', 'Culture'], pinned: false, trending: false,
  },
];
