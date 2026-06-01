'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Store, MapPin, Box, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/types'
import { useUIStore } from '@/store/ui.store'
import ProductStatusBadge from './product-status-badge'
import PriceDisplay from './price-display'
import { cn, formatNumber } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  style?: React.CSSProperties
}

export default function ProductCard({ product, className, style }: ProductCardProps) {
  const { setActiveProductId } = useUIStore()
  const [isHovered, setIsHovered] = useState(false)

  // Default fallback image
  const imageUrl = product.thumbnail || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop'

  return (
    <motion.div
      layoutId={`product-${product.id}`}
      style={style}
      className={cn('group cursor-pointer', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setActiveProductId(product.id)}
    >
      <div className="glass-card p-0 overflow-hidden h-full flex flex-col">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-[var(--color-bg-elevated)]">
          <img
            src={imageUrl}
            alt={product.title}
            className={cn(
              "object-cover w-full h-full transition-transform duration-700 ease-out",
              isHovered ? "scale-110" : "scale-100"
            )}
            loading="lazy"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
            <ProductStatusBadge product={product} />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-white/90 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium w-fit">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span>{product.rating || '0.0'}</span>
              </div>
            </div>
            
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="bg-white/10 backdrop-blur-md p-1.5 rounded-full text-white"
                >
                  <ChevronRight size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          {/* Title & Shop */}
          <div className="space-y-1.5">
            <h3 className="font-medium text-text-primary text-sm line-clamp-2 leading-snug group-hover:text-boba transition-colors">
              {product.title}
            </h3>
            {product.shopName && (
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Store size={12} />
                <span className="truncate">{product.shopName}</span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3">
            {/* Price */}
            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              discountPercent={product.discountPercent}
              size="md"
            />

            {/* Stats & Tags */}
            <div className="flex items-center justify-between border-t border-[var(--color-glass-border)] pt-3">
              <div className="flex gap-3 text-[11px] text-text-muted">
                {product.soldCount !== undefined && (
                  <span className="flex items-center gap-1">
                    <Box size={10} />
                    {formatNumber(product.soldCount)} terjual
                  </span>
                )}
              </div>

              {/* Tag circles */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex -space-x-1.5">
                  {product.tags.slice(0, 3).map((pt, i) => (
                    <div
                      key={pt.tagId}
                      className="w-4 h-4 rounded-full border border-[var(--color-bg-surface)]"
                      style={{ backgroundColor: pt.tag.color || '#8a8a9e', zIndex: 3 - i }}
                      title={pt.tag.name}
                    />
                  ))}
                  {product.tags.length > 3 && (
                    <div className="w-4 h-4 rounded-full border border-[var(--color-bg-surface)] bg-[var(--color-glass-bg-hover)] flex items-center justify-center text-[8px] text-text-secondary z-0">
                      +
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
