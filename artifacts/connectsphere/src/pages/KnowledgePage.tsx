import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, FileText, Shield, Heart, Cpu, DollarSign, Users } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: number;
  bookmarked: boolean;
  lastUpdated: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  HR: <Users size={14} />,
  IT: <Cpu size={14} />,
  Legal: <Shield size={14} />,
  Culture: <Heart size={14} />,
  Benefits: <DollarSign size={14} />,
};

const articles: Article[] = [
  { id: 'ka1', title: 'Employee Handbook 2026', summary: 'The complete guide to ConnectSphere policies, values, and how we work. Covers everything from work hours to code of conduct.', category: 'HR', readTime: 15, bookmarked: true, lastUpdated: '2026-01-15' },
  { id: 'ka2', title: 'Remote Work & Hybrid Guidelines', summary: 'Updated June 2026 hybrid policy covering in-office expectations, home office stipends, and remote work best practices.', category: 'HR', readTime: 5, bookmarked: false, lastUpdated: '2026-05-01' },
  { id: 'ka3', title: 'IT Security & Access Policy', summary: 'Zero-trust security guidelines, VPN setup, approved software list, and how to report security incidents.', category: 'IT', readTime: 8, bookmarked: false, lastUpdated: '2026-03-10' },
  { id: 'ka4', title: 'Benefits Guide: Health, Dental & Vision', summary: 'Complete overview of our benefits package including provider networks, deductibles, mental health coverage, and FSA/HSA options.', category: 'Benefits', readTime: 10, bookmarked: true, lastUpdated: '2026-04-01' },
  { id: 'ka5', title: 'Performance Review Process', summary: 'Step-by-step guide to our annual and semi-annual performance cycles, self-review templates, and calibration process.', category: 'HR', readTime: 7, bookmarked: false, lastUpdated: '2026-02-20' },
  { id: 'ka6', title: 'Engineering Onboarding Guide', summary: 'Everything a new engineer needs to get set up: dev environment, code standards, PR process, and first-week checklist.', category: 'IT', readTime: 20, bookmarked: false, lastUpdated: '2026-04-15' },
  { id: 'ka7', title: 'Data Privacy & GDPR Compliance', summary: 'Our data handling standards, employee rights under GDPR/CCPA, and how we protect customer and employee data.', category: 'Legal', readTime: 12, bookmarked: false, lastUpdated: '2026-01-01' },
  { id: 'ka8', title: 'Our Culture & Values', summary: 'What we believe in, how we make decisions, what great leadership looks like here, and how our culture shows up day to day.', category: 'Culture', readTime: 6, bookmarked: true, lastUpdated: '2025-12-01' },
  { id: 'ka9', title: 'Expense Reimbursement Policy', summary: 'Approved expense categories, reimbursement limits, how to submit expenses, and the approval workflow.', category: 'Benefits', readTime: 4, bookmarked: false, lastUpdated: '2026-03-01' },
];

const faqs: FAQ[] = [
  { id: 'f1', question: 'How do I submit a PTO request?', answer: 'Log in to the HR portal, navigate to Time Off, and submit a request at least 3 business days in advance. Your manager will receive an approval notification.', category: 'HR' },
  { id: 'f2', question: 'What is the home office stipend and how do I claim it?', answer: 'All employees receive $500/year for home office equipment. Submit receipts through the Expense portal under "Home Office" category. Reimbursements process within 5 business days.', category: 'Benefits' },
  { id: 'f3', question: 'How do I get access to a new tool or system?', answer: 'Submit an IT access request in the IT Help portal. Most access is provisioned within 1 business day. For enterprise tools, manager approval is required.', category: 'IT' },
  { id: 'f4', question: 'How does the performance review cycle work?', answer: 'We run semi-annual reviews in January and July. Self-reviews are due 2 weeks before the cycle closes. Calibration happens with your manager\'s manager present. Results are communicated within 2 weeks.', category: 'HR' },
  { id: 'f5', question: 'Can I work from a different country temporarily?', answer: 'Yes, with manager approval for up to 30 days per year. For stays longer than 30 days, HR and Legal review is required for tax and compliance considerations. Submit via HR portal.', category: 'Legal' },
  { id: 'f6', question: 'What mental health resources are available?', answer: 'Our health plan includes 20 therapy sessions per year. We also offer Headspace premium for all employees, and access to a confidential Employee Assistance Program (EAP) for crisis support.', category: 'Benefits' },
];

const CATS = ['All', 'HR', 'IT', 'Legal', 'Culture', 'Benefits'];
const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function KnowledgePage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [items, setItems] = useState<Article[]>(articles);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => { setTimeout(() => setLoading(false), 500); }, []);

  const filtered = items.filter(a => {
    const matchCat = cat === 'All' || a.category === cat;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredFaqs = faqs.filter(f => cat === 'All' || f.category === cat);

  const toggleBookmark = (id: string) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, bookmarked: !a.bookmarked } : a));
    const art = items.find(a => a.id === id);
    toast({ title: art?.bookmarked ? 'Removed bookmark' : 'Bookmarked!' });
  };

  if (loading) return <AppLayout><div className="space-y-4">{[...Array(6)].map((_, i) => <SkeletonCard key={i} lines={3} />)}</div></AppLayout>;

  return (
    <AppLayout>
      <PageHeader title="Knowledge Hub" subtitle="Policies, guides, and company resources" icon={<BookOpen size={18} />} />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" data-testid="input-search-knowledge" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATS.map(c => (
            <Button key={c} variant={cat === c ? 'default' : 'outline'} size="sm" className="h-9 text-xs gap-1.5"
              onClick={() => setCat(c)} data-testid={`filter-cat-${c.toLowerCase()}`}>
              {categoryIcons[c]}{c}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Articles ({filtered.length})</h2>
          <motion.div className="space-y-3" variants={container} initial="hidden" animate="show">
            {filtered.map(a => (
              <motion.div key={a.id} variants={item}
                className="bg-card border border-card-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                data-testid={`article-${a.id}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mr-2 ${categoryIcons[a.category] ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {a.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{a.readTime} min read</span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); toggleBookmark(a.id); }}
                        className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" data-testid={`bookmark-article-${a.id}`}>
                        {a.bookmarked ? <BookmarkCheck size={15} className="text-primary" /> : <Bookmark size={15} />}
                      </button>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{a.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.summary}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">Updated {new Date(a.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Frequently Asked</h2>
          <div className="bg-card border border-card-border rounded-xl overflow-hidden divide-y divide-border">
            {filteredFaqs.map(f => (
              <div key={f.id} data-testid={`faq-${f.id}`}>
                <button
                  className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                  data-testid={`faq-toggle-${f.id}`}
                >
                  <p className="text-sm font-medium text-foreground leading-tight flex-1">{f.question}</p>
                  {openFaq === f.id ? <ChevronUp size={15} className="flex-shrink-0 mt-0.5 text-primary" /> : <ChevronDown size={15} className="flex-shrink-0 mt-0.5 text-muted-foreground" />}
                </button>
                {openFaq === f.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
