'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X, Link2, Info, Loader2, Package } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { extractShopeeProductId, isShopeeUrl } from '@/lib/utils'
import { saveProduct } from '@/actions/product.actions'
import { toast } from 'sonner'

export default function QuickAddModal() {
  const { quickAddModalOpen, setQuickAddModalOpen, pastedUrl, setPastedUrl, addProduct } = useUIStore()

  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [resolvedUrl, setResolvedUrl] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingMeta, setIsLoadingMeta] = useState(false)

  useEffect(() => {
    if (quickAddModalOpen) {
      setUrlInput(pastedUrl || '')
    }
  }, [quickAddModalOpen, pastedUrl])

  useEffect(() => {
    const fetchMeta = async () => {
      if (!urlInput || !isShopeeUrl(urlInput)) return
      
      // Jika title sudah diisi manual, jangan overwrite (kecuali kosong)
      // Tapi kita selalu ambil meta-nya untuk cari gambar
      setIsLoadingMeta(true)
      try {
        const res = await fetch('/api/scrape/shopee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlInput })
        })
        const data = await res.json()
        if (data.success) {
          if (data.title && !title) setTitle(data.title)
          if (data.image) setThumbnail(data.image)
          if (data.description && !notes) setNotes(data.description)
          if (data.resolvedUrl) setResolvedUrl(data.resolvedUrl)
        }
      } catch (e) {
        console.error('Failed to fetch shopee meta', e)
      } finally {
        setIsLoadingMeta(false)
      }
    }

    const timer = setTimeout(fetchMeta, 800)
    return () => clearTimeout(timer)
  }, [urlInput])

  // Use resolved URL (from redirect) if available, otherwise use input
  const finalUrl = resolvedUrl || urlInput
  const productId = finalUrl ? extractShopeeProductId(finalUrl) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await saveProduct({
        title,
        notes,
        shopeeUrl: finalUrl || urlInput || '',
        shopeeProductId: productId || undefined,
        thumbnail: thumbnail || undefined
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
      setUrlInput('')
      setResolvedUrl('')
      setTitle('')
      setNotes('')
      setThumbnail('')
    }, 300)
  }

  const fieldVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
    })
  }

  return (
    <AnimatePresence>
      {quickAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          />

          {/* Modal — putih solid di light, hitam solid di dark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg mx-4 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden
              bg-bg-surface border border-[var(--color-glass-border)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-[var(--color-glass-border)]">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg
                  bg-boba/10 dark:bg-boba/20">
                  <Package size={14} className="text-boba" />
                </div>
                <h2 className="text-base font-semibold tracking-tight
                  text-text-primary">
                  Tambahkan Produk
                </h2>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full
                  bg-boba/10 dark:bg-boba/20 text-boba">
                  Manual
                </span>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-xl transition-colors duration-200
                  text-text-muted hover:text-text-primary
                  hover:bg-[var(--color-glass-bg-hover)]"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-5 pt-4 pb-5 space-y-4">
                {/* Info Box */}
                <motion.div
                  custom={0}
                  variants={fieldVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex gap-2.5 p-3 rounded-xl
                    bg-boba/8 dark:bg-boba/10
                    border border-boba/20 dark:border-boba/25"
                >
                  {isLoadingMeta ? (
                    <Loader2 size={15} className="text-boba flex-shrink-0 mt-0.5 animate-spin" />
                  ) : (
                    <Info size={15} className="text-boba flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-xs leading-relaxed text-text-muted">
                    {isLoadingMeta ? (
                      'Mendeteksi data produk secara otomatis...'
                    ) : (
                      <>
                        Paste link produk Shopee untuk mendeteksi gambar otomatis, atau isi data secara manual jika produk dari luar Shopee.
                      </>
                    )}
                  </p>
                </motion.div>

                {/* URL Input */}
                <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider ml-0.5
                    text-text-muted">
                    URL Shopee
                  </label>
                  <div className="relative group">
                    <Link2 size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150
                      text-text-muted
                      group-focus-within:text-boba" />
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://shopee.co.id/..."
                      className="w-full pl-9 pr-3.5 h-10 rounded-xl text-sm outline-none transition-all duration-150
                        bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)]
                        text-text-primary placeholder:text-text-muted
                        focus:border-boba focus:ring-2 focus:ring-boba/15"
                    />
                  </div>
                  {productId && (
                    <p className="text-[10px] ml-1 font-mono
                      text-text-muted">
                      ID: <span className="text-boba">{productId}</span>
                    </p>
                  )}
                </motion.div>

                {/* Title Input */}
                <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider ml-0.5
                    text-text-muted">
                    Nama Produk <span className="text-red-500 dark:text-red-400 normal-case">*</span>
                  </label>
                  <div className="flex gap-2">
                    {thumbnail && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-black/10 dark:border-white/10 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Copas dari Shopee..."
                      autoFocus
                      className="w-full px-3.5 h-10 rounded-xl text-sm outline-none transition-all duration-150
                        bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)]
                        text-text-primary placeholder:text-text-muted
                        focus:border-boba focus:ring-2 focus:ring-boba/15"
                    />
                  </div>
                </motion.div>

                {/* Notes */}
                <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible" className="space-y-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider ml-0.5
                    text-text-muted">
                    Catatan{' '}
                    <span className="normal-case font-normal text-text-muted">
                      — opsional
                    </span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Alasan beli, tunggu gajian, dll..."
                    className="w-full px-3.5 py-2.5 h-[76px] rounded-xl text-sm outline-none resize-none transition-all duration-150
                      bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)]
                      text-text-primary placeholder:text-text-muted
                      focus:border-boba focus:ring-2 focus:ring-boba/15"
                  />
                </motion.div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2.5 px-5 py-3.5
                border-t border-[var(--color-glass-border)]
                bg-[var(--color-glass-bg)]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-ghost h-9 px-4 rounded-xl text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title}
                  className="btn btn-primary px-5 h-9 text-sm min-w-[140px] flex items-center justify-center gap-2
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Menyimpan…</span>
                    </>
                  ) : (
                    'Simpan ke Katalog'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
