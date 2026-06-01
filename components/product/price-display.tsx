'use client'

import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  discountPercent?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function PriceDisplay({
  price,
  originalPrice,
  discountPercent,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  }

  const originalSizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  }

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('font-semibold text-text-primary', sizeClasses[size])}>
        Rp {formatPrice(price)}
      </span>
      {originalPrice && originalPrice > price && (
        <span
          className={cn(
            'line-through text-text-muted',
            originalSizeClasses[size]
          )}
        >
          Rp {formatPrice(originalPrice)}
        </span>
      )}
      {discountPercent && discountPercent > 0 && (
        <span className="badge bg-red-500/15 text-red-400">
          -{discountPercent}%
        </span>
      )}
    </div>
  )
}
