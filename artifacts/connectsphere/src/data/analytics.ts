export interface MonthlyEngagement {
  month: string;
  score: number;
  activeUsers: number;
  posts: number;
  recognitions: number;
}

export interface DepartmentActivity {
  department: string;
  score: number;
  members: number;
  posts: number;
  recognitions: number;
}

export const engagementTrend: MonthlyEngagement[] = [
  { month: 'Jun', score: 68, activeUsers: 142, posts: 89, recognitions: 23 },
  { month: 'Jul', score: 72, activeUsers: 156, posts: 94, recognitions: 28 },
  { month: 'Aug', score: 71, activeUsers: 151, posts: 91, recognitions: 25 },
  { month: 'Sep', score: 75, activeUsers: 163, posts: 108, recognitions: 32 },
  { month: 'Oct', score: 78, activeUsers: 171, posts: 115, recognitions: 41 },
  { month: 'Nov', score: 76, activeUsers: 168, posts: 112, recognitions: 38 },
  { month: 'Dec', score: 82, activeUsers: 178, posts: 124, recognitions: 47 },
  { month: 'Jan', score: 79, activeUsers: 172, posts: 118, recognitions: 44 },
  { month: 'Feb', score: 84, activeUsers: 188, posts: 131, recognitions: 52 },
  { month: 'Mar', score: 86, activeUsers: 193, posts: 137, recognitions: 58 },
  { month: 'Apr', score: 83, activeUsers: 186, posts: 128, recognitions: 54 },
  { month: 'May', score: 91, activeUsers: 208, posts: 156, recognitions: 67 },
];

export const departmentActivity: DepartmentActivity[] = [
  { department: 'Engineering', score: 88, members: 10, posts: 42, recognitions: 18 },
  { department: 'Product', score: 92, members: 4, posts: 28, recognitions: 14 },
  { department: 'Marketing', score: 85, members: 3, posts: 56, recognitions: 12 },
  { department: 'Sales', score: 94, members: 3, posts: 38, recognitions: 22 },
  { department: 'HR', score: 96, members: 3, posts: 44, recognitions: 31 },
  { department: 'Design', score: 89, members: 2, posts: 31, recognitions: 9 },
  { department: 'Finance', score: 78, members: 2, posts: 18, recognitions: 7 },
  { department: 'Operations', score: 83, members: 3, posts: 24, recognitions: 11 },
  { department: 'Leadership', score: 97, members: 2, posts: 15, recognitions: 6 },
];

export const platformMetrics = {
  totalEmployees: 245,
  activeThisWeek: 208,
  engagementScore: 91,
  recognitionsThisMonth: 67,
  eventsThisMonth: 10,
  announcementsThisMonth: 12,
  forumPosts: 156,
  avgSessionMinutes: 14.2,
};

export const sentimentData = [
  { name: 'Positive', value: 68, color: '#10b981' },
  { name: 'Neutral', value: 22, color: '#6366f1' },
  { name: 'Needs Attention', value: 10, color: '#f59e0b' },
];

export const kpis = [
  { label: 'Employee Engagement', value: 91, target: 90, unit: '%', trend: +3 },
  { label: 'Retention Rate', value: 94, target: 92, unit: '%', trend: +1 },
  { label: 'eNPS Score', value: 67, target: 60, unit: '', trend: +8 },
  { label: 'Internal Promotions', value: 34, target: 30, unit: '%', trend: +4 },
];
