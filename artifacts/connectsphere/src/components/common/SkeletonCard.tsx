import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  lines?: number;
  hasAvatar?: boolean;
}

export function SkeletonCard({ lines = 3, hasAvatar = false }: SkeletonCardProps) {
  return (
    <div className="bg-card border border-card-border rounded-xl p-5 space-y-3">
      {hasAvatar && (
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}
