import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 h-[400px]">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-full w-full" />
        </div>
        <div className="glass rounded-xl p-6 h-[400px]">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
