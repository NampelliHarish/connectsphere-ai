export interface LeadershipMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  title: string;
  body: string;
  date: string;
  type: 'ceo-message' | 'update' | 'vision' | 'townhall';
  views: number;
}

export interface StrategicGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  owner: string;
  dueDate: string;
  status: 'on-track' | 'at-risk' | 'completed';
}

export const leadershipMessages: LeadershipMessage[] = [
  {
    id: 'lm1',
    authorId: '1',
    authorName: 'Sarah Chen',
    authorRole: 'CEO',
    title: 'The Next Chapter: Building for a Billion Users',
    body: 'Five years ago, we started with a simple belief: that the way people work together deserved to be fundamentally reimagined. Not with incremental improvements, but with a platform that genuinely understood human connection at work. Today, with over 2,000 enterprise customers and 120M in new funding, we are just getting started.\n\nOur Series C marks the beginning of a new chapter. We will be accelerating our AI roadmap, expanding into APAC and EMEA, and doubling our engineering capacity. But as we scale, I want to be clear about one thing: our culture is not a nice-to-have. It is our most durable competitive advantage.\n\nThank you for choosing to build this with me.',
    date: '2026-05-20',
    type: 'ceo-message',
    views: 342,
  },
  {
    id: 'lm2',
    authorId: '5',
    authorName: 'James Wilson',
    authorRole: 'VP Engineering',
    title: 'Q2 Engineering Update: Reliability, Scale, and What is Next',
    body: 'Q2 was a quarter of building the foundation for 10x scale. We migrated to a fully event-driven architecture, reduced API latency by 42%, and achieved 99.99% uptime for the first time in company history. These numbers are the result of relentless work from every engineer on the team.\n\nIn Q3, we are focused on three bets: our AI inference pipeline, the new mobile SDK, and expanding our developer platform. Each of these is a multi-quarter investment with significant customer impact. More details to come at the Engineering All-Hands on June 4th.',
    date: '2026-05-15',
    type: 'update',
    views: 198,
  },
  {
    id: 'lm3',
    authorId: '19',
    authorName: 'Sandra Liu',
    authorRole: 'CFO',
    title: 'Q1 Financial Highlights: Healthy Growth, Strong Unit Economics',
    body: 'I am pleased to share that Q1 was another strong quarter for ConnectSphere. We grew ARR by 87% year-over-year, with net revenue retention at 123%. We are burning efficiently: our burn multiple has improved for 6 consecutive quarters. The Series C gives us a 36-month runway at current growth rates, which means we can invest with confidence.\n\nKey focus for H2: improving gross margin to 78% (from 74%) through infrastructure optimization, and achieving cash flow positivity by Q4 2027.',
    date: '2026-05-10',
    type: 'update',
    views: 156,
  },
  {
    id: 'lm4',
    authorId: '1',
    authorName: 'Sarah Chen',
    authorRole: 'CEO',
    title: 'Our 2026 Vision: The Intelligent Enterprise',
    body: 'We believe that in five years, every workplace interaction will be augmented by AI — not to replace human judgment, but to amplify it. ConnectSphere is uniquely positioned to lead this shift because we sit at the intersection of communication, knowledge, and culture.\n\nOur vision for 2026 is the Intelligent Enterprise: a platform that knows not just what you do, but who you are, who you work best with, and what you need to thrive. Every announcement more relevant, every connection more meaningful, every recognition more personal.\n\nWe are building something the world has not seen yet. And we are doing it together.',
    date: '2026-04-25',
    type: 'vision',
    views: 412,
  },
  {
    id: 'lm5',
    authorId: '2',
    authorName: 'Michael Torres',
    authorRole: 'HR Director',
    title: 'Q1 Engagement Report: Record Highs Across the Board',
    body: 'I am incredibly proud to share that our Q1 engagement survey results are the best in company history. Overall engagement reached 91%, up from 84% last year. Our eNPS score hit 67, which places us in the top decile for companies our size. Inclusion scores are up 12 points.\n\nThis is not accidental. It is the direct result of hundreds of small acts of care, recognition, and leadership across the organization. The data also shows clear areas to improve: career development clarity and cross-functional collaboration. We will be addressing both with new programs in Q3.',
    date: '2026-04-15',
    type: 'update',
    views: 287,
  },
];

export const strategicGoals: StrategicGoal[] = [
  {
    id: 'sg1',
    title: 'Reach $50M ARR',
    description: 'Grow annual recurring revenue to $50M through enterprise expansion and improved retention.',
    progress: 74,
    owner: 'Sandra Liu',
    dueDate: 'Q4 2026',
    status: 'on-track',
  },
  {
    id: 'sg2',
    title: 'Launch AI-Powered Features Suite',
    description: 'Ship 5 AI-powered features including smart recommendations, auto-summaries, and sentiment analysis.',
    progress: 55,
    owner: 'James Wilson',
    dueDate: 'Q3 2026',
    status: 'on-track',
  },
  {
    id: 'sg3',
    title: 'Expand to APAC & EMEA Markets',
    description: 'Open offices in Singapore and London, achieve 20% of revenue from international customers.',
    progress: 38,
    owner: 'Olivia Grant',
    dueDate: 'Q4 2026',
    status: 'at-risk',
  },
  {
    id: 'sg4',
    title: 'Achieve 95%+ Employee Engagement',
    description: 'Reach world-class engagement scores through programs, culture initiatives, and leadership development.',
    progress: 91,
    owner: 'Michael Torres',
    dueDate: 'Q4 2026',
    status: 'on-track',
  },
  {
    id: 'sg5',
    title: 'Double Engineering Team',
    description: 'Grow engineering headcount from 50 to 100 with a focus on AI/ML and mobile.',
    progress: 62,
    owner: 'James Wilson',
    dueDate: 'Q4 2026',
    status: 'on-track',
  },
];
