export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  initials: string;
  avatarColor: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  skills: string[];
  location: string;
  email: string;
  joinDate: string;
  points: number;
}

export interface Announcement {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'normal';
  date: string;
  author: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  reactions: number;
  pinned: boolean;
}

export interface Recognition {
  id: string;
  from: string;
  fromInitials: string;
  fromColor: string;
  to: string;
  toInitials: string;
  toColor: string;
  badge: string;
  badgeColor: string;
  message: string;
  date: string;
  likes: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  initials: string;
  color: string;
  points: number;
  department: string;
}

export const EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Chen', role: 'CEO', department: 'Leadership', initials: 'SC', avatarColor: '#6366f1', status: 'online', skills: ['Strategy', 'Leadership', 'Product Vision'], location: 'San Francisco, CA', email: 'sarah.chen@connectsphere.io', joinDate: '2018-03-15', points: 9800 },
  { id: '2', name: 'Michael Torres', role: 'HR Director', department: 'HR', initials: 'MT', avatarColor: '#8b5cf6', status: 'online', skills: ['Recruiting', 'Culture Building', 'L&D'], location: 'New York, NY', email: 'm.torres@connectsphere.io', joinDate: '2019-06-01', points: 7400 },
  { id: '3', name: 'Alex Rivera', role: 'Senior Engineer', department: 'Engineering', initials: 'AR', avatarColor: '#06b6d4', status: 'online', skills: ['React', 'TypeScript', 'Node.js'], location: 'Austin, TX', email: 'a.rivera@connectsphere.io', joinDate: '2021-01-10', points: 5600 },
  { id: '4', name: 'Priya Nair', role: 'Product Manager', department: 'Product', initials: 'PN', avatarColor: '#ec4899', status: 'busy', skills: ['Product Strategy', 'Roadmapping', 'Analytics'], location: 'Seattle, WA', email: 'p.nair@connectsphere.io', joinDate: '2020-09-15', points: 6200 },
  { id: '5', name: 'James Wilson', role: 'VP Engineering', department: 'Engineering', initials: 'JW', avatarColor: '#f59e0b', status: 'away', skills: ['Engineering Management', 'Architecture'], location: 'San Francisco, CA', email: 'j.wilson@connectsphere.io', joinDate: '2019-02-20', points: 8100 },
  { id: '6', name: 'Emma Larsson', role: 'UX Designer', department: 'Design', initials: 'EL', avatarColor: '#10b981', status: 'online', skills: ['Figma', 'User Research', 'Prototyping'], location: 'London, UK', email: 'e.larsson@connectsphere.io', joinDate: '2021-07-05', points: 4900 },
  { id: '7', name: 'Daniel Kim', role: 'Data Scientist', department: 'Engineering', initials: 'DK', avatarColor: '#3b82f6', status: 'online', skills: ['Python', 'ML', 'Data Visualization'], location: 'Austin, TX', email: 'd.kim@connectsphere.io', joinDate: '2022-03-01', points: 3800 },
  { id: '8', name: 'Lisa Park', role: 'Marketing Lead', department: 'Marketing', initials: 'LP', avatarColor: '#ef4444', status: 'busy', skills: ['Brand Strategy', 'Content', 'Growth'], location: 'Chicago, IL', email: 'l.park@connectsphere.io', joinDate: '2020-11-08', points: 5500 },
  { id: '9', name: 'Raj Patel', role: 'Finance Manager', department: 'Finance', initials: 'RP', avatarColor: '#84cc16', status: 'offline', skills: ['Financial Modeling', 'FP&A', 'Excel'], location: 'New York, NY', email: 'r.patel@connectsphere.io', joinDate: '2020-05-12', points: 4200 },
  { id: '10', name: 'Olivia Grant', role: 'Sales Director', department: 'Sales', initials: 'OG', avatarColor: '#f97316', status: 'online', skills: ['Enterprise Sales', 'CRM', 'Negotiation'], location: 'Chicago, IL', email: 'o.grant@connectsphere.io', joinDate: '2019-08-20', points: 7200 },
  { id: '11', name: 'Carlos Mendez', role: 'DevOps Engineer', department: 'Engineering', initials: 'CM', status: 'online', avatarColor: '#6366f1', skills: ['Kubernetes', 'Terraform', 'CI/CD'], location: 'Austin, TX', email: 'c.mendez@connectsphere.io', joinDate: '2021-09-15', points: 4500 },
  { id: '12', name: 'Sandra Liu', role: 'CFO', department: 'Finance', initials: 'SL', avatarColor: '#10b981', status: 'online', skills: ['Financial Strategy', 'Fundraising', 'M&A'], location: 'San Francisco, CA', email: 's.liu@connectsphere.io', joinDate: '2018-07-01', points: 8600 },
];

export const ANNOUNCEMENTS: Announcement[] = [
  { id: '1', title: 'Q3 Results Exceed Targets by 34%', category: 'Company', priority: 'high', date: 'May 20', author: 'Sarah Chen', authorInitials: 'SC', authorColor: '#6366f1', content: 'Proud to share our Q3 revenue grew 34% YoY. Engineering velocity and sales execution both hit record highs. This is a collective win for every one of us.', reactions: 89, pinned: true },
  { id: '2', title: 'Annual Culture Survey Now Open', category: 'HR', priority: 'normal', date: 'May 18', author: 'Michael Torres', authorInitials: 'MT', authorColor: '#8b5cf6', content: 'Your voice matters. Fill out the 5-minute culture survey by May 31st to shape our next chapter. Your responses are anonymous and directly influence company decisions.', reactions: 47, pinned: true },
  { id: '3', title: 'Product Roadmap H2 2026 Preview', category: 'Product', priority: 'high', date: 'May 16', author: 'Priya Nair', authorInitials: 'PN', authorColor: '#ec4899', content: 'Sharing H2 product priorities — AI-first features, enterprise workflows, and international expansion. All-hands session on May 28th at 2 PM PST.', reactions: 62, pinned: false },
  { id: '4', title: 'New Engineering Hiring Wave', category: 'Engineering', priority: 'normal', date: 'May 14', author: 'James Wilson', authorInitials: 'JW', authorColor: '#f59e0b', content: 'We are opening 12 new engineering positions across backend, frontend, and ML. Employee referrals get a $3,000 bonus if the hire stays 6+ months.', reactions: 38, pinned: false },
  { id: '5', title: 'Sales Crosses $10M ARR Milestone', category: 'Company', priority: 'high', date: 'May 12', author: 'Olivia Grant', authorInitials: 'OG', authorColor: '#f97316', content: 'ConnectSphere crossed $10M ARR this week. This is a team achievement and we celebrate every member who contributed to this milestone.', reactions: 102, pinned: false },
  { id: '6', title: 'Brand Refresh Launches Next Week', category: 'Marketing', priority: 'normal', date: 'May 10', author: 'Lisa Park', authorInitials: 'LP', authorColor: '#ef4444', content: 'Our new brand identity goes live May 20th — refreshed logo, color palette, and design system across all customer touchpoints.', reactions: 33, pinned: false },
  { id: '7', title: 'New L&D Budget: $2,500 per Employee', category: 'HR', priority: 'normal', date: 'May 8', author: 'Michael Torres', authorInitials: 'MT', authorColor: '#8b5cf6', content: '$2,500 annual Learning & Development budget now available per employee for courses, conferences, books, and certifications. Submit requests via the Knowledge Hub.', reactions: 71, pinned: false },
  { id: '8', title: 'Office Move to New HQ on July 1', category: 'Company', priority: 'high', date: 'May 6', author: 'Sarah Chen', authorInitials: 'SC', authorColor: '#6366f1', content: 'We are relocating to our new 5-floor headquarters in downtown SF on July 1st. Details and moving assistance in the FAQ document.', reactions: 55, pinned: false },
];

export const RECOGNITION: Recognition[] = [
  { id: '1', from: 'James Wilson', fromInitials: 'JW', fromColor: '#f59e0b', to: 'Alex Rivera', toInitials: 'AR', toColor: '#06b6d4', badge: 'Innovator', badgeColor: '#6366f1', message: 'Alex shipped our new observability platform 2 weeks ahead of schedule with zero production incidents. Absolutely outstanding work!', date: 'May 21', likes: 24 },
  { id: '2', from: 'Priya Nair', fromInitials: 'PN', fromColor: '#ec4899', to: 'Emma Larsson', toInitials: 'EL', toColor: '#10b981', badge: 'Team Player', badgeColor: '#3b82f6', message: 'Emma redesigned our onboarding flow from scratch and user satisfaction jumped 40% in the first week. Pure design excellence.', date: 'May 20', likes: 18 },
  { id: '3', from: 'Sarah Chen', fromInitials: 'SC', fromColor: '#6366f1', to: 'Olivia Grant', toInitials: 'OG', toColor: '#f97316', badge: 'Top Performer', badgeColor: '#f59e0b', message: 'Olivia closed our biggest enterprise deal ever and pushed us over the $10M ARR milestone. A true champion for the entire team.', date: 'May 19', likes: 43 },
  { id: '4', from: 'Michael Torres', fromInitials: 'MT', fromColor: '#8b5cf6', to: 'Sarah Chen', toInitials: 'SC', toColor: '#6366f1', badge: 'Leader', badgeColor: '#8b5cf6', message: 'Sarah ran the most transparent and energizing all-hands we have ever had. The culture she has built is what makes this place special.', date: 'May 18', likes: 67 },
  { id: '5', from: 'Alex Rivera', fromInitials: 'AR', fromColor: '#06b6d4', to: 'Daniel Kim', toInitials: 'DK', toColor: '#3b82f6', badge: 'Innovator', badgeColor: '#6366f1', message: 'Daniel built a churn prediction model that is already saving us 15% revenue monthly. Data science at its best.', date: 'May 17', likes: 31 },
  { id: '6', from: 'Emma Larsson', fromInitials: 'EL', fromColor: '#10b981', to: 'Carlos Mendez', toInitials: 'CM', toColor: '#6366f1', badge: 'Team Player', badgeColor: '#3b82f6', message: 'Carlos stayed late multiple nights to migrate our infrastructure with zero downtime. The backbone of our engineering reliability.', date: 'May 16', likes: 22 },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Sarah Chen', initials: 'SC', color: '#6366f1', points: 9800, department: 'Leadership' },
  { rank: 2, name: 'Sandra Liu', initials: 'SL', color: '#10b981', points: 8600, department: 'Finance' },
  { rank: 3, name: 'James Wilson', initials: 'JW', color: '#f59e0b', points: 8100, department: 'Engineering' },
  { rank: 4, name: 'Olivia Grant', initials: 'OG', color: '#f97316', points: 7200, department: 'Sales' },
  { rank: 5, name: 'Michael Torres', initials: 'MT', color: '#8b5cf6', points: 7400, department: 'HR' },
];

export const CEO_MESSAGE = {
  quote: "Our culture of collaboration and relentless execution is what sets us apart. Every person in this company contributes to something larger than themselves — and that is what makes ConnectSphere extraordinary.",
  name: 'Sarah Chen',
  role: 'Chief Executive Officer',
  initials: 'SC',
  color: '#6366f1',
};

export const STATS = {
  employees: 245,
  announcements: 47,
  eventsThisMonth: 8,
  recognitionPosts: 312,
};

export const CATEGORY_COLORS: Record<string, string> = {
  Company: '#6366f1',
  HR: '#8b5cf6',
  Engineering: '#06b6d4',
  Product: '#ec4899',
  Marketing: '#ef4444',
  Sales: '#f97316',
  Finance: '#84cc16',
  Design: '#10b981',
};
