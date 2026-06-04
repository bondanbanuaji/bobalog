'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Archive, MoreVertical, Store, Star, Box, ChevronLeft, Edit2, Trash2, Check, Loader2 } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { updateProduct, deleteProduct, toggleArchive } from '@/actions/product.actions'
import { toast } from 'sonner'
import { Priority, ProductStatus } from '@/types'

import ProductStatusBadge from './product-status-badge'
import { cn, formatNumber } from '@/lib/utils'

export default function ProductModal() {
  const { activeProductId, setActiveProductId, products, updateProduct: updateStoreProduct, removeProduct } = useUIStore()
  
  const product = products.find(p => p.id === activeProductId)
  
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [editTitle, setEditTitle] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editPriority, setEditPriority] = useState<Priority>(Priority.NORMAL)
  const [editStatus, setEditStatus] = useState<ProductStatus>(ProductStatus.ACTIVE)
  
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeProductId) {
      document.body.style.overflow = 'hidden'
      if (product) {
        setEditTitle(product.title)
        setEditNotes(product.notes || '')
        setEditPriority(product.priority)
        setEditStatus(product.status)
        setIsEditing(false)
        setShowMenu(false)
        setIsDeleting(false)
      }
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [activeProductId, product])

  if (!product) return null

  const imageUrl = product.thumbnail || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop'

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const result = await updateProduct(product.id, {
        title: editTitle,
        notes: editNotes,
        priority: editPriority,
        status: editStatus
      })
      if (result.success && result.product) {
        updateStoreProduct(product.id, result.product as any)
        toast.success('Perubahan disimpan')
        setIsEditing(false)
      } else {
        throw new Error(result.error)
      }
    } catch (e: any) {
      toast.error(e.message || 'Gagal menyimpan')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      const result = await deleteProduct(product.id)
      if (result.success) {
        toast.success('Produk dihapus')
        removeProduct(product.id)
        setActiveProductId(null)
      } else {
        throw new Error(result.error)
      }
    } catch (e: any) {
      toast.error(e.message || 'Gagal menghapus')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleArchive = async () => {
    try {
      const result = await toggleArchive(product.id)
      if (result.success && result.product) {
        updateStoreProduct(product.id, result.product as any)
        toast.success(result.product.status === ProductStatus.ARCHIVED ? 'Diarsipkan' : 'Diaktifkan kembali')
      }
    } catch (e) {
      toast.error('Gagal mengubah status')
    }
  }

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
              
              <div className="flex items-center gap-2 relative">
                {product.shopeeUrl && (
                  <a
                    href={product.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary h-8 px-3 rounded-lg text-xs inline-flex items-center justify-center gap-1"
                  >
                    <span>Buka Shopee</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                
                {isEditing ? (
                  <button 
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="btn-primary h-8 px-3 rounded-lg text-xs inline-flex items-center justify-center gap-1 bg-boba hover:bg-boba-hover"
                  >
                    {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                    <span>Simpan</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="h-8 px-3 flex items-center justify-center gap-1 rounded-lg border border-[var(--color-glass-border)] hover:bg-[var(--color-glass-bg-hover)] text-text-muted transition-colors text-xs"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                )}

                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={() => setShowMenu(!showMenu)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[var(--color-glass-bg-hover)] text-text-muted transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>

                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-bg-surface border border-[var(--color-glass-border)] rounded-xl shadow-xl overflow-hidden py-1 z-50"
                      >
                        <button
                          onClick={() => {
                            handleToggleArchive()
                            setShowMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:bg-[var(--color-glass-bg-hover)] hover:text-text-primary flex items-center gap-2"
                        >
                          <Archive size={14} />
                          {product.status === ProductStatus.ARCHIVED ? 'Batal Arsipkan' : 'Arsipkan'}
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleting(true)
                            setShowMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Hapus Produk
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Content Scroll Area */}
            <div className="flex-1 overflow-y-auto">
              
              {isDeleting && (
                <div className="p-4 m-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <h4 className="text-red-500 font-medium mb-2">Hapus Produk?</h4>
                  <p className="text-sm text-red-400/80 mb-4">Tindakan ini tidak dapat dibatalkan.</p>
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => setIsDeleting(false)}
                      className="px-3 py-1.5 text-xs rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleDelete}
                      disabled={isSubmitting}
                      className="px-3 py-1.5 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting && <Loader2 size={12} className="animate-spin" />}
                      Ya, Hapus
                    </button>
                  </div>
                </div>
              )}

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
                  {isEditing ? (
                    <textarea 
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xl font-medium leading-snug bg-transparent border-b border-[var(--color-glass-border)] focus:border-boba outline-none resize-none overflow-hidden min-h-[60px]"
                    />
                  ) : (
                    <h2 className="text-xl font-medium leading-snug">{product.title}</h2>
                  )}
                  
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

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs text-text-muted">Prioritas</label>
                        <select 
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as Priority)}
                          className="w-full h-9 rounded-lg bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm px-3 outline-none focus:border-boba"
                        >
                          <option value="LOW">Low</option>
                          <option value="NORMAL">Normal</option>
                          <option value="HIGH">High</option>
                          <option value="MUST_BUY">Must Buy</option>
                        </select>
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="text-xs text-text-muted">Status</label>
                        <select 
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value as ProductStatus)}
                          className="w-full h-9 rounded-lg bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm px-3 outline-none focus:border-boba"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="BOUGHT">Bought</option>
                          <option value="UNAVAILABLE">Unavailable</option>
                          <option value="ARCHIVED">Archived</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Variations */}
                {product.variations && product.variations.length > 0 && !isEditing && (
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
                  {isEditing ? (
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Tambahkan catatan untuk produk ini..."
                      className="w-full h-32 p-3 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-boba transition-colors resize-none"
                    />
                  ) : (
                    <div className="w-full min-h-[60px] p-4 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm text-text-primary whitespace-pre-wrap">
                      {product.notes || <span className="text-text-muted italic">Belum ada catatan.</span>}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && !isEditing && (
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
                    </div>
                  </div>
                )}
                
                {/* Meta */}
                <div className="pt-6 border-t border-[var(--color-glass-border)] flex items-center justify-between text-[11px] text-text-muted">
                  <p>Ditambahkan: {new Date(product.createdAt).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
