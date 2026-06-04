'use client'

import { cn } from '@/lib/utils'

interface ProductSkeletonProps {
  count?: number
  className?: string
}

export default function ProductSkeleton({ count = 6, className }: ProductSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card p-0 overflow-hidden"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          {/* Image skeleton */}
          <div className="aspect-square shimmer" />

          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded-lg shimmer" />
              <div className="h-3.5 w-3/4 rounded-lg shimmer" />
            </div>

            {/* Shop name */}
            <div className="h-3 w-1/2 rounded-lg shimmer" />



            {/* Rating & sold */}
            <div className="flex items-center gap-3">
              <div className="h-3 w-14 rounded-lg shimmer" />
              <div className="h-3 w-16 rounded-lg shimmer" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-5 w-14 rounded-full shimmer" />
              <div className="h-5 w-18 rounded-full shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
