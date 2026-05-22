import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Users, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { GradientAvatar } from '@/components/common/GradientAvatar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { employees, type Employee } from '@/data/employees';

// Build the tree structure from flat employee list
interface TreeNode {
  employee: Employee;
  children: TreeNode[];
  depth: number;
}

function buildTree(rootId: string, allEmployees: Employee[], depth = 0): TreeNode {
  const emp = allEmployees.find(e => e.id === rootId)!;
  const children = allEmployees
    .filter(e => e.reportsTo === rootId)
    .sort((a, b) => b.points - a.points)
    .map(child => buildTree(child.id, allEmployees, depth + 1));
  return { employee: emp, children, depth };
}

interface OrgNodeProps {
  node: TreeNode;
  onSelect: (emp: Employee) => void;
  selectedId: string | null;
  isLast: boolean;
}

function OrgNode({ node, onSelect, selectedId, isLast }: OrgNodeProps) {
  const [expanded, setExpanded] = useState(node.depth < 2);
  const emp = node.employee;
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === emp.id;

  return (
    <div className="flex flex-col items-center" data-testid={`org-node-${emp.id}`}>
      {/* Vertical connector from parent */}
      {node.depth > 0 && (
        <div className="w-px h-5 bg-border flex-shrink-0" />
      )}

      {/* Node card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: node.depth * 0.05 }}
        className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 px-3 py-2.5 flex items-center gap-2.5 min-w-[168px] max-w-[192px] shadow-sm hover:shadow-md
          ${isSelected
            ? 'border-primary bg-primary/10 shadow-primary/20'
            : 'border-card-border bg-card hover:border-primary/50'
          }`}
        style={{ minWidth: 168 }}
        onClick={() => onSelect(emp)}
        whileHover={{ y: -1 }}
        data-testid={`org-card-${emp.id}`}
      >
        {/* Left color accent based on depth */}
        <div
          className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full"
          style={{ backgroundColor: emp.avatarColor }}
        />
        <div className="pl-1 flex-shrink-0">
          <GradientAvatar name={emp.name} color={emp.avatarColor} initials={emp.initials} size="sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground leading-tight truncate">{emp.name}</p>
          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">{emp.role}</p>
          <div className="flex items-center gap-1 mt-1">
            <StatusBadge status={emp.status} size="sm" />
            {hasChildren && (
              <span className="text-[10px] text-muted-foreground">{node.children.length} direct</span>
            )}
          </div>
        </div>
        {hasChildren && (
          <button
            className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={e => { e.stopPropagation(); setExpanded(v => !v); }}
            data-testid={`expand-${emp.id}`}
          >
            {expanded
              ? <ChevronDown size={11} />
              : <ChevronRight size={11} />
            }
          </button>
        )}
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-visible"
          >
            {/* Connector line down */}
            <div className="w-px h-4 bg-border mx-auto" />

            {/* Horizontal connector bar across children */}
            {node.children.length > 1 && (
              <div className="relative flex justify-center">
                <div
                  className="absolute top-0 h-px bg-border"
                  style={{
                    left: `calc(50% - ${(node.children.length - 1) * 100}px)`,
                    right: `calc(50% - ${(node.children.length - 1) * 100}px)`,
                    width: `${(node.children.length - 1) * 200}px`,
                    maxWidth: '100%',
                  }}
                />
              </div>
            )}

            <div className="flex gap-4 items-start">
              {node.children.map((child, idx) => (
                <OrgNode
                  key={child.employee.id}
                  node={child}
                  onSelect={onSelect}
                  selectedId={selectedId}
                  isLast={idx === node.children.length - 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface OrgChartProps {
  onSelectEmployee: (emp: Employee) => void;
}

export function OrgChart({ onSelectEmployee }: OrgChartProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const ceo = employees.find(e => !e.reportsTo)!;
  const tree = buildTree(ceo.id, employees);

  // Count nodes by depth for summary
  const deptCounts = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleSelect = useCallback((emp: Employee) => {
    setSelectedId(emp.id);
    onSelectEmployee(emp);
  }, [onSelectEmployee]);

  const totalWithReports = employees.filter(e => employees.some(r => r.reportsTo === e.id)).length;

  return (
    <div className="space-y-4">
      {/* Legend / stats bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users size={13} className="text-primary" />
            <span><strong className="text-foreground">{employees.length}</strong> employees</span>
          </span>
          <span>
            <strong className="text-foreground">{totalWithReports}</strong> managers
          </span>
          <span>
            <strong className="text-foreground">{Object.keys(deptCounts).length}</strong> departments
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-1">Zoom</span>
          <Button
            variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            disabled={zoom <= 0.5}
            data-testid="button-zoom-out"
          >
            <ZoomOut size={13} />
          </Button>
          <span className="text-xs font-medium text-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
            disabled={zoom >= 1.5}
            data-testid="button-zoom-in"
          >
            <ZoomIn size={13} />
          </Button>
          <Button
            variant="outline" size="icon" className="h-7 w-7"
            onClick={() => setZoom(1)}
            data-testid="button-zoom-reset"
          >
            <Maximize2 size={13} />
          </Button>
        </div>
      </div>

      {/* Department color legend */}
      <div className="flex flex-wrap gap-2">
        {employees
          .filter((e, _, arr) => arr.findIndex(x => x.department === e.department) === arr.indexOf(e))
          .slice(0, 8)
          .map(e => (
            <span key={e.department} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: e.avatarColor }} />
              {e.department}
            </span>
          ))
        }
      </div>

      {/* Chart canvas */}
      <div
        className="w-full overflow-auto rounded-xl border border-card-border bg-muted/30 p-6 min-h-[400px]"
        data-testid="org-chart-canvas"
      >
        <div
          className="inline-block transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          <OrgNode
            node={tree}
            onSelect={handleSelect}
            selectedId={selectedId}
            isLast
          />
        </div>
      </div>

      {/* Selected employee hint */}
      <AnimatePresence>
        {selectedId && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground text-center"
          >
            Click a node to view the full profile — or use the expand button to reveal their team
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
