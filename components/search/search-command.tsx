'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, ShoppingBag, FolderOpen, Tag, Star, ArrowRight } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'


export default function SearchCommand() {
  const router = useRouter()
  const { searchOpen, setSearchOpen, setActiveProductId, products, collections, tags } = useUIStore()
  const [searchQuery, setSearchQuery] = useState('')

  // Handle Cmd+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [setSearchOpen])

  // Reset query when closed
  useEffect(() => {
    if (!searchOpen) {
      setTimeout(() => setSearchQuery(''), 200)
    }
  }, [searchOpen])

  // Simple client-side filtering
  const filteredProducts = products
    .filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5)

  const filteredCollections = collections
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 3)

  const filteredTags = tags
    .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 4)

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-backdrop"
        onClick={() => setSearchOpen(false)}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-bg-surface/90 backdrop-blur-xl border border-[var(--color-glass-border)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <Command label="Global Command Menu" shouldFilter={false}>
          <div className="flex items-center px-4 py-4 border-b border-[var(--color-glass-border)]">
            <Search className="w-5 h-5 text-text-muted mr-3" />
            <Command.Input 
              value={searchQuery}
              onValueChange={setSearchQuery}
              autoFocus
              placeholder="Cari produk, koleksi, atau tags..." 
              className="flex-1 bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-base sm:text-lg"
            />
            <button 
              onClick={() => setSearchOpen(false)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--color-glass-bg)] text-text-muted border border-[var(--color-glass-border)]"
            >
              ESC
            </button>
          </div>

          <Command.List className="max-h-[60vh] overflow-y-auto p-2 overscroll-contain">
            <Command.Empty className="py-12 text-center text-sm text-text-muted">
              Tidak ada hasil untuk "{searchQuery}"
            </Command.Empty>

            {/* Products */}
            {filteredProducts.length > 0 && (
              <Command.Group heading={<span className="text-[11px] font-semibold text-text-muted px-2 tracking-wider">PRODUK</span>}>
                {filteredProducts.map((product) => (
                  <Command.Item 
                    key={product.id}
                    value={`product-${product.id}`}
                    onSelect={() => {
                      setSearchOpen(false)
                      setActiveProductId(product.id)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl aria-selected:bg-[var(--color-glass-bg-hover)] aria-selected:text-[var(--color-text-primary)] cursor-pointer group transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-black/50 overflow-hidden flex-shrink-0">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <ShoppingBag size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{product.title}</p>
                      <p className="text-xs text-text-muted truncate">{product.shopName}</p>
                    </div>
                    <ArrowRight size={14} className="text-text-muted opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Collections */}
            {filteredCollections.length > 0 && (
              <Command.Group heading={<span className="text-[11px] font-semibold text-text-muted px-2 mt-4 tracking-wider">KOLEKSI</span>}>
                {filteredCollections.map((col) => (
                  <Command.Item 
                    key={col.id}
                    value={`col-${col.id}`}
                    onSelect={() => {
                      setSearchOpen(false)
                      router.push(`/collections/${col.id}`)
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl aria-selected:bg-[var(--color-glass-bg-hover)] aria-selected:text-[var(--color-text-primary)] cursor-pointer group transition-colors"
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${col.color || '#c4a882'}20` }}
                    >
                      <span className="text-sm">{col.emoji || '📁'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{col.name}</p>
                      <p className="text-[11px] text-text-muted truncate">{col.productCount} produk</p>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Tags */}
            {filteredTags.length > 0 && (
              <Command.Group heading={<span className="text-[11px] font-semibold text-text-muted px-2 mt-4 tracking-wider">TAGS</span>}>
                <div className="flex flex-wrap gap-2 px-2 pb-2">
                  {filteredTags.map((tag) => (
                    <Command.Item 
                      key={tag.id}
                      value={`tag-${tag.id}`}
                      onSelect={() => {
                        setSearchOpen(false)
                        router.push(`/?tag=${tag.id}`)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--color-glass-border)] aria-selected:bg-[var(--color-glass-bg-hover)] aria-selected:border-[var(--color-glass-border-hover)] aria-selected:text-[var(--color-text-primary)] cursor-pointer transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color || undefined }} />
                      <span className="text-sm">{tag.name}</span>
                    </Command.Item>
                  ))}
                </div>
              </Command.Group>
            )}

          </Command.List>
        </Command>
      </div>
    </div>
  )
}
