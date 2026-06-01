'use client'

import CollectionGrid from '@/components/collection/collection-grid'
import { useUIStore } from '@/store/ui.store'

export default function CollectionsPage() {
  const { collections } = useUIStore()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-text-primary tracking-tight">
            Koleksi
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {collections.length > 0
              ? `${collections.length} koleksi tersimpan`
              : 'Organisir produk ke dalam koleksi'}
          </p>
        </div>
      </div>

      <CollectionGrid collections={collections} />
    </div>
  )
}
