'use client'

import { motion, type Variants } from 'framer-motion'
import type { Collection } from '@/types'
import CollectionCard from './collection-card'
import { FolderPlus } from 'lucide-react'

interface CollectionGridProps {
  collections: Collection[]
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

export default function CollectionGrid({ collections }: CollectionGridProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {/* Create New Card */}
      <motion.div variants={item}>
        <button className="w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed border-[var(--color-glass-border)] hover:border-boba/50 hover:bg-boba/5 transition-all flex flex-col items-center justify-center gap-3 text-text-muted hover:text-boba group">
          <div className="w-12 h-12 rounded-full bg-[var(--color-glass-bg)] group-hover:bg-boba/10 flex items-center justify-center transition-colors">
            <FolderPlus size={24} />
          </div>
          <span className="font-medium">Collection Baru</span>
        </button>
      </motion.div>

      {/* Collection Cards */}
      {collections.map((collection) => (
        <motion.div key={collection.id} variants={item}>
          <CollectionCard collection={collection} />
        </motion.div>
      ))}
    </motion.div>
  )
}
