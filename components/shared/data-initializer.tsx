'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useUIStore } from '@/store/ui.store'
import { getProducts } from '@/actions/product.actions'
import { getCollections } from '@/actions/collection.actions'
import { getTags } from '@/actions/tag.actions'
import { toast } from 'sonner'

export default function DataInitializer() {
  const { isSignedIn, isLoaded } = useAuth()
  const { setProducts, setCollections, setTags } = useUIStore()
  const initialized = useRef(false)

  useEffect(() => {
    // Only load if Clerk is loaded and user is signed in
    if (!isLoaded) return
    if (!isSignedIn) {
      // If signed out, clear the store
      setProducts([])
      setCollections([])
      setTags([])
      return
    }

    // Prevent double fetch in strict mode
    if (initialized.current) return
    initialized.current = true

    const loadData = async () => {
      try {
        const [productsData, collectionsData, tagsData] = await Promise.all([
          getProducts(),
          getCollections(),
          getTags(),
        ])

        setProducts(productsData)
        setCollections(collectionsData)
        setTags(tagsData)
      } catch (error) {
        console.error('Error loading data:', error)
        toast.error('Gagal memuat data dari server')
      }
    }

    loadData()
  }, [isLoaded, isSignedIn, setProducts, setCollections, setTags])

  return null
}
