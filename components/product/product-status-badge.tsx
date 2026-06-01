'use client'

import type { Product } from '@/types'
import { cn } from '@/lib/utils'

interface PriceChangeInfo {
  label: string
  dotColor: string
  bgColor: string
  textColor: string
}

const priceChangeMap: Record<string, PriceChangeInfo> = {
  dropped: {
    label: 'Turun Harga',
    dotColor: 'bg-emerald-400',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
  },
  increased: {
    label: 'Naik Harga',
    dotColor: 'bg-red-400',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
  },
  stable: {
    label: 'Harga Tetap',
    dotColor: 'bg-gray-400',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400',
  },
}

interface StatusBadgeProps {
  product: Product
  className?: string
}

export default function ProductStatusBadge({ product, className }: StatusBadgeProps) {
  // Determine badge type
  if (product.stock === 0) {
    return (
      <span className={cn('badge bg-gray-500/15 text-gray-400', className)}>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse-glow" />
        Habis
      </span>
    )
  }

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

  if (product.priceChange && product.priceChange !== 'unknown') {
    const info = priceChangeMap[product.priceChange]
    if (info) {
      return (
        <span className={cn('badge', info.bgColor, info.textColor, className)}>
          <span className={cn('w-1.5 h-1.5 rounded-full', info.dotColor)} />
          {info.label}
        </span>
      )
    }
  }

  return null
}
