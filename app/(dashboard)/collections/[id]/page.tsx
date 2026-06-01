'use client'

import { use } from 'react'
import Link from 'next/link'
import { ChevronLeft, Share2, Edit2, MoreVertical, FolderOpen } from 'lucide-react'
import ProductGrid from '@/components/product/product-grid'
import { useUIStore } from '@/store/ui.store'

export default function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { collections } = useUIStore()

  const collection = collections.find(c => c.id === id)

  if (!collection) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] flex items-center justify-center mb-4 text-text-muted text-2xl">
          <FolderOpen size={28} />
        </div>
        <h2 className="text-xl font-medium text-text-primary mb-2">Koleksi Tidak Ditemukan</h2>
        <p className="text-text-secondary mb-6 text-sm">Koleksi ini mungkin sudah dihapus atau URL salah.</p>
        <Link href="/collections" className="btn-primary">
          Kembali ke Koleksi
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/collections"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ChevronLeft size={16} />
          Kembali ke Koleksi
        </Link>

        <div className="flex items-center gap-2">
          <button className="btn-glass px-3 py-1.5 text-xs">
            <Share2 size={14} />
            <span className="hidden sm:inline">Bagikan</span>
          </button>
          <button className="btn-glass px-3 py-1.5 text-xs">
            <Edit2 size={14} />
            <span className="hidden sm:inline">Ubah</span>
          </button>
          <button className="p-1.5 rounded-lg border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] hover:bg-[var(--color-glass-bg-hover)] text-text-muted transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl border border-[var(--color-glass-border)] bg-[var(--color-glass-bg)] backdrop-blur-sm relative overflow-hidden">
        {/* Decorative glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"
          style={{ backgroundColor: collection.color || '#c4a882' }}
        />

        <div
          className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl shadow-inner border border-[var(--color-glass-border)] relative z-10 flex-shrink-0"
          style={{ backgroundColor: `${collection.color || '#c4a882'}15` }}
        >
          {collection.emoji || '📁'}
        </div>

        <div className="relative z-10 flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="text-xl sm:text-3xl font-display font-semibold text-text-primary tracking-tight">
              {collection.name}
            </h1>
            {collection.isPublic ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PUBLIK
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--color-glass-bg-hover)] text-text-muted border border-[var(--color-glass-border)]">
                PRIVAT
              </span>
            )}
          </div>
          {collection.description && (
            <p className="text-sm text-text-secondary max-w-2xl mt-1">{collection.description}</p>
          )}
          <div className="flex items-center gap-4 mt-3 sm:mt-4 text-[11px] font-medium text-text-muted uppercase tracking-wider">
            <span>{collection.productCount} Produk</span>
            <span className="w-1 h-1 rounded-full bg-text-muted" />
            <span>Diperbarui {collection.updatedAt.toLocaleDateString('id-ID')}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="pt-2 sm:pt-4">
        <ProductGrid
          products={collection.products || []}
          emptyMessage="Koleksi ini masih kosong. Tambahkan produk dari halaman beranda."
        />
      </div>
    </div>
  )
}
