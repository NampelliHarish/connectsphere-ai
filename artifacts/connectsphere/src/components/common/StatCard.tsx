import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  suffix?: string;
  icon?: ReactNode;
  color?: string;
  description?: string;
}

export function StatCard({ label, value, trend, suffix, icon, color = 'text-primary', description }: StatCardProps) {
  return (
    <motion.div
      className="bg-card border border-card-border rounded-xl p-5 flex flex-col gap-3"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.15 }}
      data-testid={`stat-card-${label.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && <div className={`${color} opacity-80`}>{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-foreground">{value}</span>
          {suffix && <span className="text-sm text-muted-foreground ml-1">{suffix}</span>}
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
            trend < 0 ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400' :
            'bg-muted text-muted-foreground'
          }`}>
            {trend > 0 ? <TrendingUp size={12} /> : trend < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
            {Math.abs(trend)}{suffix === '%' ? 'pp' : ''}
          </div>
        )}
      </div>
    </motion.div>
  );
}
