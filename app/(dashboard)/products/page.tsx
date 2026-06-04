'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Package, Search, Filter, SlidersHorizontal } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import ProductGrid from '@/components/product/product-grid'
import { Priority, ProductStatus } from '@/types'
import SplitText from '@/components/reactbits/SplitText'
import BlurText from '@/components/reactbits/BlurText'
import Magnet from '@/components/reactbits/Magnet'

export default function ProductsPage() {
  const { products, setQuickAddModalOpen } = useUIStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'ALL'>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL')

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.notes || '').toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchStatus = statusFilter === 'ALL' || p.status === statusFilter
      const matchPriority = priorityFilter === 'ALL' || p.priority === priorityFilter

      return matchSearch && matchStatus && matchPriority
    })
  }, [products, searchQuery, statusFilter, priorityFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="text-boba" size={28} />
            <SplitText
              text="Kelola Produk"
              tag="h1"
              className="text-2xl font-bold tracking-tight text-text-primary"
              delay={0.04}
              splitBy="chars"
            />
          </div>
          <BlurText
            text="Lihat, cari, dan kelola semua barang incaranmu."
            className="text-text-muted mt-1"
            delay={0.03}
          />
        </div>
        <Magnet padding={30}>
          <button 
            onClick={() => setQuickAddModalOpen(true)}
            className="btn btn-primary"
          >
            <Package size={16} /> Tambah Produk
          </button>
        </Magnet>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cari nama produk atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 h-11 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm text-text-primary focus:outline-none focus:border-boba transition-colors placeholder:text-text-muted"
          />
        </div>
        
        <div className="flex flex-col xs:flex-row sm:flex-row gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto h-11 px-3 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm text-text-primary focus:outline-none focus:border-boba appearance-none [&>option]:bg-bg-surface [&>option]:text-text-primary"
          >
            <option value="ALL">Semua Status</option>
            <option value="ACTIVE">Aktif</option>
            <option value="BOUGHT">Dibeli</option>
            <option value="UNAVAILABLE">Habis</option>
            <option value="ARCHIVED">Diarsipkan</option>
          </select>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="w-full sm:w-auto h-11 px-3 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-sm text-text-primary focus:outline-none focus:border-boba appearance-none [&>option]:bg-bg-surface [&>option]:text-text-primary"
          >
            <option value="ALL">Semua Prioritas</option>
            <option value="MUST_BUY">Wajib Beli</option>
            <option value="HIGH">Tinggi</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Rendah</option>
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProductGrid 
          products={filteredProducts} 
          emptyMessage={searchQuery ? "Tidak ada produk yang cocok dengan filter pencarian" : "Belum ada produk di daftarmu."}
        />
      </motion.div>
    </div>
  )
}
