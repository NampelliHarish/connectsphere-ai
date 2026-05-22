export type Badge = 'Innovator' | 'Team Player' | 'Leader' | 'Mentor' | 'Visionary' | 'Culture Champion' | 'Top Performer' | 'Problem Solver' | 'Rising Star' | 'Game Changer';

export interface Recognition {
  id: string;
  giverId: string;
  giverName: string;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  receiverDept: string;
  message: string;
  badge: Badge;
  date: string;
  likes: number;
  liked: boolean;
  avatarColor: string;
}

export const recognitions: Recognition[] = [
  { id: 'r1', giverId: '4', giverName: 'Priya Nair', receiverId: '3', receiverName: 'Alex Rivera', receiverRole: 'Senior Engineer', receiverDept: 'Engineering', message: 'Alex single-handedly refactored our entire data pipeline in a weekend sprint. The performance improvements are already saving us 30% in cloud costs. Absolute hero.', badge: 'Innovator', date: '2026-05-20', likes: 42, liked: false, avatarColor: '#06b6d4' },
  { id: 'r2', giverId: '5', giverName: 'James Wilson', receiverId: '14', receiverName: 'Yuki Tanaka', receiverRole: 'Backend Engineer', receiverDept: 'Engineering', message: 'Yuki shipped 4 critical bug fixes last week with zero downtime and crystal clear communication throughout. The team is lucky to have you.', badge: 'Team Player', date: '2026-05-19', likes: 28, liked: true, avatarColor: '#14b8a6' },
  { id: 'r3', giverId: '1', giverName: 'Sarah Chen', receiverId: '10', receiverName: 'Olivia Grant', receiverRole: 'Sales Director', receiverDept: 'Sales', message: 'Olivia closed our largest enterprise deal to date after 6 months of brilliant relationship-building. This win changes our trajectory. Thank you for your relentless dedication.', badge: 'Top Performer', date: '2026-05-18', likes: 89, liked: false, avatarColor: '#f97316' },
  { id: 'r4', giverId: '6', giverName: 'Emma Larsson', receiverId: '18', receiverName: 'Andre Dubois', receiverRole: 'Brand Designer', receiverDept: 'Design', message: 'Andre redesigned our entire brand identity in record time and every single stakeholder loved it. Your eye for detail and creative courage are unmatched.', badge: 'Game Changer', date: '2026-05-17', likes: 56, liked: false, avatarColor: '#f59e0b' },
  { id: 'r5', giverId: '2', giverName: 'Michael Torres', receiverId: '17', receiverName: 'Nina Walsh', receiverRole: 'HR Business Partner', receiverDept: 'HR', message: 'Nina handled a very difficult employee situation with extraordinary empathy and professionalism this week. Your commitment to doing the right thing is what makes our culture great.', badge: 'Culture Champion', date: '2026-05-16', likes: 34, liked: true, avatarColor: '#ec4899' },
  { id: 'r6', giverId: '3', giverName: 'Alex Rivera', receiverId: '7', receiverName: 'Daniel Kim', receiverRole: 'Data Scientist', receiverDept: 'Engineering', message: 'Daniel built our churn prediction model in 3 days that the business had been asking for 6 months. Already influencing strategy. Brilliant work.', badge: 'Innovator', date: '2026-05-15', likes: 47, liked: false, avatarColor: '#3b82f6' },
  { id: 'r7', giverId: '8', giverName: 'Lisa Park', receiverId: '12', receiverName: 'Aisha Johnson', receiverRole: 'Content Strategist', receiverDept: 'Marketing', message: 'Aisha rewrote our entire email nurture sequence and open rates jumped 40%. The quality of her writing consistently elevates everything we publish.', badge: 'Problem Solver', date: '2026-05-14', likes: 31, liked: false, avatarColor: '#a78bfa' },
  { id: 'r8', giverId: '10', giverName: 'Olivia Grant', receiverId: '13', receiverName: 'Tom Henderson', receiverRole: 'Solutions Engineer', receiverDept: 'Sales', message: 'Tom ran the most polished enterprise demo I have ever seen last week. His technical depth and ability to translate complexity into business value is a genuine competitive advantage.', badge: 'Game Changer', date: '2026-05-13', likes: 52, liked: true, avatarColor: '#0ea5e9' },
  { id: 'r9', giverId: '9', giverName: 'Raj Patel', receiverId: '19', receiverName: 'Sandra Liu', receiverRole: 'CFO', receiverDept: 'Finance', message: 'Sandra guided us through a complex fundraising process with calm, clarity, and exceptional strategic thinking. The entire finance team learned so much from watching her work.', badge: 'Leader', date: '2026-05-12', likes: 64, liked: false, avatarColor: '#10b981' },
  { id: 'r10', giverId: '15', giverName: 'Rachel Moore', receiverId: '21', receiverName: 'Fatima Al-Hassan', receiverRole: 'Customer Success Lead', receiverDept: 'Operations', message: 'Fatima single-handedly saved our largest at-risk account last quarter through weeks of relentless problem-solving and genuine care for the customer. She is the gold standard for CSM work.', badge: 'Top Performer', date: '2026-05-11', likes: 78, liked: false, avatarColor: '#a78bfa' },
  { id: 'r11', giverId: '11', giverName: 'Carlos Mendez', receiverId: '20', receiverName: 'Marcus Webb', receiverRole: 'Security Engineer', receiverDept: 'Engineering', message: 'Marcus identified a critical vulnerability in our auth flow before it could be exploited. His proactive security mindset and quick action prevented what could have been a major incident.', badge: 'Problem Solver', date: '2026-05-10', likes: 43, liked: true, avatarColor: '#6366f1' },
  { id: 'r12', giverId: '5', giverName: 'James Wilson', receiverId: '16', receiverName: 'Ben Carter', receiverRole: 'iOS Developer', receiverDept: 'Engineering', message: 'Ben shipped v2.0 of our iOS app two weeks ahead of schedule and the app store reviews have never been better. Rising star and an absolute joy to work with.', badge: 'Rising Star', date: '2026-05-09', likes: 39, liked: false, avatarColor: '#8b5cf6' },
  { id: 'r13', giverId: '1', giverName: 'Sarah Chen', receiverId: '2', receiverName: 'Michael Torres', receiverRole: 'HR Director', receiverDept: 'HR', message: 'Michael has completely transformed how we think about employee experience. The engagement scores this quarter are the highest we have ever seen, and it is largely due to his programs and genuine care for every person on the team.', badge: 'Culture Champion', date: '2026-05-08', likes: 103, liked: false, avatarColor: '#8b5cf6' },
  { id: 'r14', giverId: '24', giverName: 'Ivan Kozlov', receiverId: '3', receiverName: 'Alex Rivera', receiverRole: 'Senior Engineer', receiverDept: 'Engineering', message: 'Alex mentored me through my first major architecture decision and helped me think through trade-offs I would have missed entirely. Incredible mentor.', badge: 'Mentor', date: '2026-05-07', likes: 27, liked: true, avatarColor: '#06b6d4' },
  { id: 'r15', giverId: '4', giverName: 'Priya Nair', receiverId: '6', receiverName: 'Emma Larsson', receiverRole: 'UX Designer', receiverDept: 'Design', message: 'Emma ran user research sessions that completely changed how we approached the new onboarding flow. Her ability to turn user insights into clear design direction saved us months of rework.', badge: 'Innovator', date: '2026-05-06', likes: 45, liked: false, avatarColor: '#10b981' },
];

export const birthdays = [
  { id: '3', name: 'Alex Rivera', date: 'May 22' },
  { id: '12', name: 'Aisha Johnson', date: 'May 25' },
  { id: '19', name: 'Sandra Liu', date: 'May 29' },
];

export const workAnniversaries = [
  { id: '2', name: 'Michael Torres', years: 7, date: 'June 1' },
  { id: '8', name: 'Lisa Park', years: 6, date: 'June 3' },
  { id: '14', name: 'Yuki Tanaka', years: 4, date: 'June 5' },
];
