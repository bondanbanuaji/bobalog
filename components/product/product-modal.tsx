'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Archive, MoreVertical, Store, Star, Box, ChevronLeft } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import PriceDisplay from './price-display'
import ProductStatusBadge from './product-status-badge'
import { cn, formatNumber, getTimeAgo } from '@/lib/utils'

export default function ProductModal() {
  const { activeProductId, setActiveProductId, products } = useUIStore()
  
  const product = products.find(p => p.id === activeProductId)

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeProductId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [activeProductId])

  if (!product) return null

  const imageUrl = product.thumbnail || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop'

  return (
    <AnimatePresence>
      {activeProductId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProductId(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-bg-base border-l border-[var(--color-glass-border)] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--color-glass-border)] bg-bg-surface/50 backdrop-blur-md">
              <button
                onClick={() => setActiveProductId(null)}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <ChevronLeft size={16} />
                Kembali
              </button>
              
              <div className="flex items-center gap-2">
                <a
                  href={product.shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-3 py-1.5 text-xs rounded-lg"
                >
                  Buka Shopee <ExternalLink size={12} className="ml-1" />
                </a>
                <button className="p-1.5 rounded-lg hover:bg-[var(--color-glass-bg-hover)] text-text-muted transition-colors">
                  <Archive size={16} />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[var(--color-glass-bg-hover)] text-text-muted transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto">
              {/* Image Hero */}
              <div className="relative aspect-square bg-black">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4">
                  <ProductStatusBadge product={product} />
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Title & Price */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium leading-snug">{product.title}</h2>
                  
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    {product.shopName && (
                      <a href={product.shopUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-boba transition-colors">
                        <Store size={14} />
                        {product.shopName}
                      </a>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      {product.rating || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Box size={14} />
                      {product.soldCount !== undefined ? `${formatNumber(product.soldCount)} terjual` : 'N/A'}
                    </span>
                  </div>

                  <div className="pt-2">
                    <PriceDisplay
                      price={product.price}
                      originalPrice={product.originalPrice}
                      discountPercent={product.discountPercent}
                      size="lg"
                    />
                  </div>
                </div>

                {/* Variations */}
                {product.variations && product.variations.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-[var(--color-glass-border)]">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Variasi</h3>
                    <div className="space-y-4">
                      {product.variations.map((v) => (
                        <div key={v.name} className="space-y-2">
                          <p className="text-sm text-text-primary">{v.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {v.options.map((opt) => (
                              <span key={opt} className="px-3 py-1 rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] text-xs text-text-secondary">
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div className="space-y-4 pt-6 border-t border-[var(--color-glass-border)]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Catatan Pribadi</h3>
                  </div>
                  <textarea
                    defaultValue={product.notes}
                    placeholder="Tambahkan catatan untuk produk ini..."
                    className="w-full h-24 p-3 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-boba/50 transition-colors resize-none"
                  />
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="space-y-3 pt-6 border-t border-[var(--color-glass-border)]">
                    <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map(pt => (
                        <span
                          key={pt.tagId}
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{ 
                            backgroundColor: pt.tag.color ? `${pt.tag.color}15` : undefined,
                            color: pt.tag.color ?? undefined,
                            border: pt.tag.color ? `1px solid ${pt.tag.color}30` : undefined
                          }}
                        >
                          {pt.tag.name}
                        </span>
                      ))}
                      <button className="px-2.5 py-1 rounded-md border border-dashed border-[var(--color-glass-border-hover)] text-xs text-text-muted hover:text-text-primary hover:border-boba/40 transition-colors">
                        + Tambah Tag
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Meta */}
                <div className="pt-6 border-t border-[var(--color-glass-border)] flex items-center justify-between text-[11px] text-text-muted">
                  <p>Ditambahkan: {product.createdAt.toLocaleDateString('id-ID')}</p>
                  <p>Update info: {product.lastScraped ? getTimeAgo(product.lastScraped) : '-'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
