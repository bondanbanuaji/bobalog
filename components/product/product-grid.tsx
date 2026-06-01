'use client'

import { motion, type Variants } from 'framer-motion'
import type { Product } from '@/types'
import ProductCard from './product-card'
import ProductSkeleton from './product-skeleton'
import { ShoppingBag } from 'lucide-react'

interface ProductGridProps {
  products: Product[]
  isLoading?: boolean
  emptyMessage?: string
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function ProductGrid({ 
  products, 
  isLoading, 
  emptyMessage = "Belum ada produk yang disimpan." 
}: ProductGridProps) {
  if (isLoading) {
    return <ProductSkeleton count={8} />
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] flex items-center justify-center mb-4 text-text-muted">
          <ShoppingBag size={24} />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">Keranjang Kosong</h3>
        <p className="text-text-secondary text-sm max-w-sm">
          {emptyMessage} Paste link Shopee di atas untuk mulai menyimpan produk.
        </p>
      </div>
    )
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={item}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
