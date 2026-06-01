'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Link2, Info, Loader2 } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { extractShopeeProductId } from '@/lib/utils'
import { saveProduct } from '@/actions/product.actions'
import { toast } from 'sonner'

export default function QuickAddModal() {
  const { quickAddModalOpen, setQuickAddModalOpen, pastedUrl, setPastedUrl, addProduct } = useUIStore()
  
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)



  // Extract ID
  const productId = pastedUrl ? extractShopeeProductId(pastedUrl) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const result = await saveProduct({
        title,
        price: Number(price),
        notes,
        shopeeUrl: pastedUrl || '',
        shopeeProductId: productId || undefined
      })
      
      if (result.success && result.product) {
        addProduct(result.product)
        toast.success('Produk berhasil ditambahkan ke katalog')
        closeModal()
      } else {
        throw new Error(result.error || 'Gagal menambahkan produk')
      }
    } catch (error) {
      console.error(error)
      toast.error('Gagal menambahkan produk')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setQuickAddModalOpen(false)
    setTimeout(() => {
      setPastedUrl(null)
      setTitle('')
      setPrice('')
      setNotes('')
    }, 300) // Clear after exit animation
  }

  if (!quickAddModalOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-md glass-card bg-bg-surface overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-glass-border)]">
            <h2 className="text-lg font-medium text-text-primary flex items-center gap-2">
              <span>Tambahkan Produk</span>
              <span className="badge bg-boba/10 text-boba ml-1">Manual</span>
            </h2>
            <button 
              onClick={closeModal}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-[var(--color-glass-bg-hover)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-5">
            {/* Info Box */}
            <div className="flex gap-3 p-3 rounded-xl bg-boba/10 border border-boba/20 text-sm text-text-primary">
              <Info size={18} className="text-boba flex-shrink-0 mt-0.5" />
              <p>Shopee melarang scraping otomatis. Silakan isi Nama & Harga secara manual untuk menyimpannya ke Bobalog.</p>
            </div>

            {/* URL Display */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary ml-1">URL Shopee</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm text-text-muted">
                <Link2 size={14} className="flex-shrink-0" />
                <span className="truncate">{pastedUrl || 'Tidak ada URL'}</span>
              </div>
              {productId && (
                <p className="text-[10px] text-text-muted ml-1">Product ID: {productId}</p>
              )}
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary ml-1">Nama Produk <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Copas dari Shopee..."
                className="input-glass w-full"
                autoFocus
              />
            </div>

            {/* Price Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary ml-1">Harga (Rp) <span className="text-red-400">*</span></label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-sm">Rp</span>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="input-glass w-full pl-9"
                />
              </div>
            </div>

            {/* Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary ml-1">Catatan (Opsional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Alasan beli, tunggu gajian, dll..."
                className="input-glass w-full h-20 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-glass-border)]">
              <button 
                type="button" 
                onClick={closeModal}
                className="btn-ghost px-4"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !title || !price}
                className="btn-primary px-6"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Simpan ke Katalog'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
