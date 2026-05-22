import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Grid3x3, List, Mail, MapPin, Briefcase, GitBranch } from 'lucide-react';
import { AppLayout } from '@/layouts/AppLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { OrgChart } from '@/components/directory/OrgChart';
import { employees, type Employee } from '@/data/employees';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const DEPTS = ['All', 'Engineering', 'Marketing', 'HR', 'Sales', 'Design', 'Finance', 'Operations', 'Product', 'Leadership'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const itemAnim = { hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } };

type ViewMode = 'grid' | 'list' | 'org';

function EmployeeCard({ emp, onClick }: { emp: Employee; onClick: () => void }) {
  return (
    <motion.div
      variants={itemAnim}
      className="bg-card border border-card-border rounded-xl p-4 cursor-pointer hover:shadow-md hover:border-primary/40 transition-all group"
      whileHover={{ y: -2 }}
      onClick={onClick}
      data-testid={`employee-card-${emp.id}`}
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-3">
          <GradientAvatar name={emp.name} color={emp.avatarColor} initials={emp.initials} size="lg" />
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card"
            style={{ backgroundColor: emp.status === 'online' ? '#34d399' : emp.status === 'away' ? '#fbbf24' : emp.status === 'busy' ? '#f87171' : '#94a3b8' }}
          />
        </div>
        <p className="text-sm font-semibold text-foreground leading-tight">{emp.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{emp.role}</p>
        <span className="mt-2 text-xs bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full">{emp.department}</span>
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <MapPin size={10} />
          <span className="truncate max-w-[120px]">{emp.location}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-3 justify-center">
          {emp.skills.slice(0, 2).map(s => (
            <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {emp.skills.length > 2 && (
            <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">+{emp.skills.length - 2}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function EmployeeRow({ emp, onClick }: { emp: Employee; onClick: () => void }) {
  return (
    <motion.div
      variants={itemAnim}
      className="flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={onClick}
      data-testid={`employee-row-${emp.id}`}
    >
      <GradientAvatar name={emp.name} color={emp.avatarColor} initials={emp.initials} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{emp.name}</p>
          <StatusBadge status={emp.status} />
        </div>
        <p className="text-xs text-muted-foreground">{emp.role} · {emp.department}</p>
      </div>
      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin size={11} />{emp.location}
      </div>
      <div className="hidden lg:flex gap-1">
        {emp.skills.slice(0, 3).map(s => (
          <span key={s} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{s}</span>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="h-8 text-xs gap-1 flex-shrink-0" onClick={e => { e.stopPropagation(); window.open(`mailto:${emp.email}`); }}>
        <Mail size={12} />Contact
      </Button>
    </motion.div>
  );
}

function EmployeeProfileDialog({ employee, onClose }: { employee: Employee | null; onClose: () => void }) {
  const manager = employee?.reportsTo ? employees.find(e => e.id === employee.reportsTo) : null;
  const directReports = employee ? employees.filter(e => e.reportsTo === employee.id) : [];

  return (
    <Dialog open={!!employee} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="employee-profile-desc">
        <DialogHeader>
          <DialogTitle className="sr-only">Employee Profile</DialogTitle>
        </DialogHeader>
        {employee && (
          <div className="pt-2">
            <div className="flex items-start gap-4">
              <GradientAvatar name={employee.name} color={employee.avatarColor} initials={employee.initials} size="xl" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{employee.name}</h3>
                  <StatusBadge status={employee.status} showLabel />
                </div>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Briefcase size={11} />{employee.department}</span>
                  <span className="flex items-center gap-1"><MapPin size={11} />{employee.location}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-4 leading-relaxed" id="employee-profile-desc">{employee.bio}</p>

            {/* Reporting chain */}
            {(manager || directReports.length > 0) && (
              <div className="mt-4 space-y-2">
                {manager && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground w-20 flex-shrink-0">Reports to</span>
                    <div className="flex items-center gap-1.5 bg-muted rounded-lg px-2 py-1">
                      <GradientAvatar name={manager.name} color={manager.avatarColor} initials={manager.initials} size="xs" />
                      <span className="text-foreground font-medium">{manager.name}</span>
                      <span className="text-muted-foreground">· {manager.role}</span>
                    </div>
                  </div>
                )}
                {directReports.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <span className="text-muted-foreground w-20 flex-shrink-0 pt-1">Manages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {directReports.slice(0, 4).map(r => (
                        <div key={r.id} className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1">
                          <GradientAvatar name={r.name} color={r.avatarColor} initials={r.initials} size="xs" />
                          <span className="text-foreground font-medium">{r.name}</span>
                        </div>
                      ))}
                      {directReports.length > 4 && (
                        <span className="text-muted-foreground px-2 py-1">+{directReports.length - 4} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {employee.skills.map(s => (
                  <span key={s} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">{employee.points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Engagement Points</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-foreground">{employee.badges.length}</p>
                <p className="text-xs text-muted-foreground">Badges Earned</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1 gap-2" size="sm" onClick={() => window.open(`mailto:${employee.email}`)}>
                <Mail size={14} />Send Email
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function DirectoryPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selected, setSelected] = useState<Employee | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = employees.filter(e => {
    const matchDept = dept === 'All' || e.department === dept;
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    return matchDept && matchSearch;
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <SkeletonCard key={i} hasAvatar lines={3} />)}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageHeader
        title="Employee Directory"
        subtitle={`${employees.length} people across ${DEPTS.length - 1} departments`}
        icon={<Users size={18} />}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <AnimatePresence>
          {viewMode !== 'org' && (
            <motion.div
              className="relative flex-1"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9"
                data-testid="input-search-directory"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {viewMode !== 'org' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Select value={dept} onValueChange={setDept}>
                <SelectTrigger className="w-44 h-9" data-testid="select-department">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View toggle — always visible */}
        <div className="flex gap-1.5">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon" className="h-9 w-9"
            onClick={() => setViewMode('grid')}
            data-testid="button-grid-view"
            title="Grid view"
          >
            <Grid3x3 size={15} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon" className="h-9 w-9"
            onClick={() => setViewMode('list')}
            data-testid="button-list-view"
            title="List view"
          >
            <List size={15} />
          </Button>
          <Button
            variant={viewMode === 'org' ? 'default' : 'outline'}
            size="icon" className="h-9 w-9"
            onClick={() => setViewMode('org')}
            data-testid="button-org-view"
            title="Org chart"
          >
            <GitBranch size={15} />
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'org' ? (
          <motion.div
            key="org"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <OrgChart onSelectEmployee={emp => setSelected(emp)} />
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} {filtered.length === 1 ? 'person' : 'people'} found
            </p>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              variants={container} initial="hidden" animate="show"
            >
              {filtered.map(emp => (
                <EmployeeCard key={emp.id} emp={emp} onClick={() => setSelected(emp)} />
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              {filtered.length} {filtered.length === 1 ? 'person' : 'people'} found
            </p>
            <div className="bg-card border border-card-border rounded-xl overflow-hidden">
              <motion.div variants={container} initial="hidden" animate="show">
                {filtered.map(emp => (
                  <EmployeeRow key={emp.id} emp={emp} onClick={() => setSelected(emp)} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <EmployeeProfileDialog employee={selected} onClose={() => setSelected(null)} />
    </AppLayout>
  );
}
