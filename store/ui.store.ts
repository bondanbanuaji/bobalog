import { create } from 'zustand'
import type { UIState } from '@/types'

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  searchOpen: false,
  pasteBarFocused: false,
  quickAddModalOpen: false,
  theme: 'dark',
  activeProductId: null,
  activeCollectionId: null,
  pastedUrl: null,
  products: [],
  collections: [],
  tags: [],

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSearchOpen: (open) => set({ searchOpen: open }),
  setPasteBarFocused: (focused) => set({ pasteBarFocused: focused }),
  setQuickAddModalOpen: (open) => set({ quickAddModalOpen: open }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bobalog-theme', theme)
    }
    set({ theme })
  },
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        localStorage.setItem('bobalog-theme', next)
      }
      return { theme: next }
    }),
  setActiveProductId: (id) => set({ activeProductId: id }),
  setActiveCollectionId: (id) => set({ activeCollectionId: id }),
  setPastedUrl: (url) => set({ pastedUrl: url }),
  setProducts: (products) => set({ products }),
  setCollections: (collections) => set({ collections }),
  setTags: (tags) => set({ tags }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),

  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  updateProduct: (id, data) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
  })),
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
}))
