// ============================================
// Bobalog — Type Definitions
// ============================================

// ---- Enums ----

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  MUST_BUY = 'MUST_BUY',
}

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  BOUGHT = 'BOUGHT',
  UNAVAILABLE = 'UNAVAILABLE',
}


export type Theme = 'dark' | 'light'

// ---- Core Models ----


export interface Tag {
  id: string
  userId: string
  name: string
  color?: string | null
}

export interface ProductTag {
  productId: string
  tagId: string
  tag: Tag
}

export interface Product {
  id: string
  userId: string

  // Source
  shopeeUrl: string
  shopeeProductId?: string

  // Core Data
  title: string
  thumbnail?: string
  gallery: string[]
  discountPercent?: number

  // Shop Info
  shopName?: string
  shopUrl?: string

  // Product Stats
  rating?: number
  soldCount?: number
  stock?: number
  variations?: ProductVariation[]

  // User Notes
  notes?: string
  priority: Priority
  status: ProductStatus


  // Relations
  tags: ProductTag[]

  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface ProductVariation {
  name: string
  options: string[]
}

export interface Collection {
  id: string
  userId: string
  name: string
  description?: string
  emoji?: string
  color?: string
  isPublic: boolean
  shareToken?: string
  sortOrder: number
  productCount: number
  products?: Product[]
  createdAt: Date
  updatedAt: Date
}

export interface CollectionProduct {
  id: string
  collectionId: string
  productId: string
  product: Product
  sortOrder: number
  addedAt: Date
}

// ---- Input/Filter Types ----

export interface ProductFilters {
  status?: ProductStatus
  priority?: Priority
  collectionId?: string
  tagId?: string
  search?: string
  sortBy?: 'newest' | 'oldest' | 'name'
}

export interface CreateCollectionInput {
  name: string
  description?: string
  emoji?: string
  color?: string
}

export interface UpdateProductInput {
  notes?: string
  priority?: Priority
  status?: ProductStatus
  tags?: string[]
}

// ---- UI State ----

export interface UIState {
  // UI State
  sidebarOpen: boolean
  searchOpen: boolean
  pasteBarFocused: boolean
  quickAddModalOpen: boolean
  theme: Theme

  // Data State
  activeProductId: string | null
  activeCollectionId: string | null
  pastedUrl: string | null

  // Real Data (replaces mock data)
  products: Product[]
  collections: Collection[]
  tags: Tag[]

  // Actions
  setSidebarOpen: (open: boolean) => void
  setSearchOpen: (open: boolean) => void
  setPasteBarFocused: (focused: boolean) => void
  setQuickAddModalOpen: (open: boolean) => void
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setActiveProductId: (id: string | null) => void
  setActiveCollectionId: (id: string | null) => void
  setPastedUrl: (url: string | null) => void
  setProducts: (products: Product[]) => void
  setCollections: (collections: Collection[]) => void
  setTags: (tags: Tag[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  removeProduct: (id: string) => void
  toggleSidebar: () => void
  toggleSearch: () => void
}
