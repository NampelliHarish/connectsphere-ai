export interface LeaderboardEntry {
  rank: number;
  employeeId: string;
  name: string;
  role: string;
  department: string;
  avatarColor: string;
  initials: string;
  points: number;
  badges: number;
  streak: number;
  trend: 'up' | 'down' | 'same';
  rankChange: number;
}

export interface DepartmentRank {
  rank: number;
  department: string;
  score: number;
  members: number;
  trend: 'up' | 'down' | 'same';
}

export const weeklyLeaderboard: LeaderboardEntry[] = [
  { rank: 1, employeeId: '1', name: 'Sarah Chen', role: 'CEO', department: 'Leadership', avatarColor: '#6366f1', initials: 'SC', points: 9800, badges: 8, streak: 24, trend: 'same', rankChange: 0 },
  { rank: 2, employeeId: '19', name: 'Sandra Liu', role: 'CFO', department: 'Finance', avatarColor: '#10b981', initials: 'SL', points: 8600, badges: 6, streak: 18, trend: 'up', rankChange: 1 },
  { rank: 3, employeeId: '5', name: 'James Wilson', role: 'VP Engineering', department: 'Engineering', avatarColor: '#f59e0b', initials: 'JW', points: 8100, badges: 7, streak: 21, trend: 'down', rankChange: -1 },
  { rank: 4, employeeId: '10', name: 'Olivia Grant', role: 'Sales Director', department: 'Sales', avatarColor: '#f97316', initials: 'OG', points: 7200, badges: 5, streak: 16, trend: 'up', rankChange: 2 },
  { rank: 5, employeeId: '2', name: 'Michael Torres', role: 'HR Director', department: 'HR', avatarColor: '#8b5cf6', initials: 'MT', points: 7400, badges: 6, streak: 30, trend: 'down', rankChange: -1 },
  { rank: 6, employeeId: '4', name: 'Priya Nair', role: 'Product Manager', department: 'Product', avatarColor: '#ec4899', initials: 'PN', points: 6200, badges: 4, streak: 12, trend: 'up', rankChange: 1 },
  { rank: 7, employeeId: '3', name: 'Alex Rivera', role: 'Senior Engineer', department: 'Engineering', avatarColor: '#06b6d4', initials: 'AR', points: 5600, badges: 3, streak: 9, trend: 'same', rankChange: 0 },
  { rank: 8, employeeId: '8', name: 'Lisa Park', role: 'Marketing Lead', department: 'Marketing', avatarColor: '#ef4444', initials: 'LP', points: 5500, badges: 4, streak: 7, trend: 'up', rankChange: 2 },
  { rank: 9, employeeId: '21', name: 'Fatima Al-Hassan', role: 'Customer Success Lead', department: 'Operations', avatarColor: '#a78bfa', initials: 'FA', points: 5300, badges: 3, streak: 14, trend: 'down', rankChange: -1 },
  { rank: 10, employeeId: '13', name: 'Tom Henderson', role: 'Solutions Engineer', department: 'Sales', avatarColor: '#0ea5e9', initials: 'TH', points: 5100, badges: 3, streak: 11, trend: 'same', rankChange: 0 },
];

export const departmentRankings: DepartmentRank[] = [
  { rank: 1, department: 'HR', score: 96, members: 3, trend: 'up' },
  { rank: 2, department: 'Leadership', score: 97, members: 2, trend: 'same' },
  { rank: 3, department: 'Sales', score: 94, members: 3, trend: 'up' },
  { rank: 4, department: 'Product', score: 92, members: 4, trend: 'up' },
  { rank: 5, department: 'Engineering', score: 88, members: 10, trend: 'down' },
  { rank: 6, department: 'Design', score: 89, members: 2, trend: 'same' },
  { rank: 7, department: 'Operations', score: 83, members: 3, trend: 'up' },
  { rank: 8, department: 'Marketing', score: 85, members: 3, trend: 'down' },
  { rank: 9, department: 'Finance', score: 78, members: 2, trend: 'same' },
];

export const badgeTypes = [
  { name: 'Innovator', count: 8, color: '#6366f1', description: 'Brought creative solutions to complex problems' },
  { name: 'Team Player', count: 12, color: '#10b981', description: 'Consistently supported colleagues and team goals' },
  { name: 'Leader', count: 6, color: '#f59e0b', description: 'Demonstrated leadership beyond their role' },
  { name: 'Mentor', count: 4, color: '#8b5cf6', description: 'Invested time in developing others' },
  { name: 'Top Performer', count: 5, color: '#ef4444', description: 'Exceeded targets and delivered exceptional results' },
  { name: 'Culture Champion', count: 7, color: '#ec4899', description: 'Actively built and strengthened our culture' },
  { name: 'Rising Star', count: 3, color: '#0ea5e9', description: 'Showed remarkable growth and potential' },
  { name: 'Game Changer', count: 4, color: '#f97316', description: 'Made an outsized impact on the business' },
];
