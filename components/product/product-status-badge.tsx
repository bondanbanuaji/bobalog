'use client'

import type { Product } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  product: Product
  className?: string
}

export default function ProductStatusBadge({ product, className }: StatusBadgeProps) {
  if (product.status === 'UNAVAILABLE') {
    return (
      <span className={cn('badge bg-amber-500/10 text-amber-400', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Tidak Tersedia
      </span>
    )
  }

  if (product.discountPercent && product.discountPercent > 0) {
    return (
      <span className={cn('badge bg-taro/10 text-taro-light', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-taro animate-pulse-glow" />
        Diskon
      </span>
    )
  }

  return null
}
