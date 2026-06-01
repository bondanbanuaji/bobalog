'use client'

import { ShoppingBag, Link2 } from 'lucide-react'
import ProductGrid from '@/components/product/product-grid'
import { useUIStore } from '@/store/ui.store'

export default function HomePage() {
  const { products } = useUIStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-text-primary tracking-tight">
            Semua Produk
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {products.length > 0
              ? `${products.length} produk tersimpan di katalog`
              : 'Katalog kamu masih kosong'}
          </p>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
          <div className="w-20 h-20 rounded-3xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] flex items-center justify-center mb-6 text-text-muted">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-xl font-display font-semibold text-text-primary mb-2">
            Belum ada produk
          </h2>
          <p className="text-text-secondary text-sm max-w-md mb-8 leading-relaxed">
            Mulai dengan menempelkan (paste) link produk Shopee di kolom input di atas. 
            Bobalog akan menyimpannya ke katalog pribadimu.
          </p>
          <div className="flex items-center gap-2 text-sm text-boba font-medium">
            <Link2 size={16} />
            <span>Paste link Shopee untuk memulai</span>
          </div>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
