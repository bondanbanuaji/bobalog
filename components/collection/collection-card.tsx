'use client'

import Link from 'next/link'
import { MoreVertical } from 'lucide-react'
import type { Collection } from '@/types'

interface CollectionCardProps {
  collection: Collection
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  // Get up to 3 thumbnails from the products
  const thumbnails = collection.products
    ?.slice(0, 3)
    .map(p => p.thumbnail || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop') || []
    
  const hasProducts = thumbnails.length > 0

  return (
    <Link href={`/collections/${collection.id}`} className="group block h-full">
      <div 
        className="glass-card p-5 h-full flex flex-col transition-all duration-300"
        style={{
          '--hover-border': collection.color ? `${collection.color}50` : 'rgba(196, 168, 130, 0.3)',
          '--hover-shadow': collection.color ? `${collection.color}15` : 'rgba(196, 168, 130, 0.1)',
        } as React.CSSProperties}
      >
        <style jsx>{`
          div:hover {
            border-color: var(--hover-border);
            box-shadow: 0 8px 32px var(--hover-shadow);
          }
        `}</style>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-[var(--color-glass-border)]"
            style={{ backgroundColor: `${collection.color || '#c4a882'}15` }}
          >
            {collection.emoji || '📁'}
          </div>
          <button 
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-[var(--color-glass-bg-hover)] transition-colors"
            onClick={(e) => {
              e.preventDefault()
              // Handle menu open
            }}
          >
            <MoreVertical size={16} />
          </button>
        </div>

        {/* Info */}
        <div className="mb-6 flex-1">
          <h3 className="font-medium text-lg text-text-primary mb-1 group-hover:text-boba transition-colors">
            {collection.name}
          </h3>
          {collection.description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>

        {/* Footer & Thumbnails */}
        <div className="flex items-end justify-between mt-auto">
          <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
            {collection.productCount} Produk
          </div>
          
          {hasProducts && (
            <div className="flex -space-x-2">
              {thumbnails.map((thumb, i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 rounded-full border-2 border-bg-surface overflow-hidden bg-[var(--color-bg-elevated)]"
                  style={{ zIndex: 3 - i }}
                >
                  <img src={thumb} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {collection.productCount > 3 && (
                <div 
                  className="w-8 h-8 rounded-full border-2 border-bg-surface bg-[var(--color-glass-bg-hover)] flex items-center justify-center text-[10px] text-text-secondary font-medium backdrop-blur-sm"
                  style={{ zIndex: 0 }}
                >
                  +{collection.productCount - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
