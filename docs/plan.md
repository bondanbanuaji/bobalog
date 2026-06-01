# 🧋 Bobalog — Full Production Plan
> **Your personal Shopee brain.**
> *Save first. Buy later.*

---

## 📌 Overview

**Bobalog** adalah personal ecommerce catalog intelligence app yang dirancang untuk menyelesaikan satu pain point nyata: **keranjang Shopee penuh, wishlist berantakan, produk incaran hilang entah ke mana**.

Solusinya simpel: paste link Shopee → produk tersimpan otomatis di katalog pribadi lu yang rapi, searchable, dan bisa di-share.

---

## 🧠 Problem Statement

| Pain Point | Kondisi Sekarang | Solusi Bobalog |
|---|---|---|
| Keranjang Shopee penuh | Maksimal item, ga bisa tambah | Simpan di luar Shopee |
| Wishlist nggak ada fitur koleksi | Flat list, susah diorganisir | Collections dengan drag & drop |
| Harga produk berubah | Nggak ada notifikasi | Smart Status badge |
| Mau share ke temen | Screenshot manual | Share URL read-only |
| Cari produk lama | Scroll panjang | Fuzzy search |

---

## 🗂️ Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Scraping Strategy](#scraping-strategy)
4. [Database Schema](#database-schema)
5. [Project Structure](#project-structure)
6. [Core Features](#core-features)
7. [UI & Design System](#ui--design-system)
8. [API Routes & Server Actions](#api-routes--server-actions)
9. [Implementation Phases](#implementation-phases)
10. [Deployment Strategy](#deployment-strategy)
11. [Environment Variables](#environment-variables)
12. [Future Roadmap](#future-roadmap)

---

## ⚙️ Tech Stack

### Frontend
| Layer | Tech | Versi | Keterangan |
|---|---|---|---|
| Framework | Next.js | 15 (App Router) | Server Components, Server Actions |
| UI Library | React | 19 | Concurrent features |
| Language | TypeScript | 5.x | Type safety production-grade |
| Styling | TailwindCSS | v4 | Utility-first, lightning build |
| Component | shadcn/ui | latest | Accessible, customizable |
| Animation | Framer Motion | 12.x | Page transitions, card animations |
| Smooth Scroll | Lenis | latest | Buttery smooth scrolling |
| 3D | Three.js + React Three Fiber | latest | Hero background only |
| State | Zustand | 5.x | Global UI state |
| Form | React Hook Form + Zod | latest | Validation |
| Icons | Lucide React | latest | Consistent icon set |
| Font | Geist + Inter | latest | Vercel Geist primary |

> ⚠️ **Catatan:** Next.js 16 belum rilis saat ini. Next.js 15 dengan App Router adalah versi production-stable terbaru. Plan ini ditulis untuk Next.js 15 dan akan mudah diupgrade ke 16 saat rilis.

### Backend
| Layer | Tech | Keterangan |
|---|---|---|
| API | Next.js Server Actions | Inline server logic |
| API Routes | Next.js Route Handlers | REST endpoints untuk scraper |
| Background Jobs | Trigger.dev / Inngest | Async scrape jobs |
| ORM | Prisma | Type-safe DB queries |
| Validation | Zod | Schema validation |

### Database & Storage
| Layer | Tech | Keterangan |
|---|---|---|
| Database | PostgreSQL (Supabase) | Primary data store |
| Cache | Upstash Redis | Rate limiting, scrape cache |
| Image Storage | Cloudinary | Product image backup |
| File Storage | Supabase Storage | Fallback assets |

### Auth
| Tech | Keterangan |
|---|---|
| Clerk | Auth provider utama — Google OAuth, magic link, session management |

> Clerk dipilih karena: zero-config, UI components siap pakai, Next.js App Router native, free tier generous.

### Scraper (Microservice Terpisah)
| Tech | Platform | Keterangan |
|---|---|---|
| Playwright | Railway / Fly.io | Headless browser scraping |
| Cheerio | Sama | HTML parser fallback |
| OpenGraph | Fallback | Minimal metadata rescue |

### Deploy
| Komponen | Platform |
|---|---|
| Frontend + Backend | Vercel |
| Scraper Microservice | Railway |
| Database | Supabase |
| Cache | Upstash Redis |
| Images | Cloudinary |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      USER BROWSER                        │
│                   Next.js 15 Frontend                    │
│          (Vercel — App Router + Server Actions)          │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐    ┌─────────────────────────────┐
│   Supabase Postgres  │    │   Scraper Microservice       │
│   (Primary DB)       │    │   (Railway / Fly.io)         │
│   Prisma ORM         │    │   Playwright + Cheerio       │
└──────────────────────┘    └─────────────────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐    ┌─────────────────────────────┐
│   Upstash Redis      │    │   Cloudinary                 │
│   (Cache + Rate      │    │   (Image Backup)             │
│    Limiting)         │    │                              │
└──────────────────────┘    └─────────────────────────────┘
               │
               ▼
┌──────────────────────┐
│   Clerk Auth         │
│   (Session Mgmt)     │
└──────────────────────┘
```

### Flow: User Paste Link

```
User paste URL
     │
     ▼
Detect Shopee link (client)
     │
     ▼
Server Action: saveProduct(url)
     │
     ├──► Immediately: Save URL + status "pending" → DB
     │           │
     │           └──► Return to user (card muncul, state: loading)
     │
     └──► Trigger background job → Scraper Microservice
               │
               ├──► Playwright fetch Shopee page
               │
               ├──► Parse: title, price, images, rating, toko, dll
               │
               ├──► Upload thumbnail → Cloudinary
               │
               └──► Webhook → Update DB product (status: ready)
                         │
                         └──► Real-time update di client (Supabase Realtime)
```

---

## 🕷️ Scraping Strategy

### Pendekatan: Hybrid Scraping + Progressive Enhancement

Bobalog menggunakan 3-tier fallback untuk memastikan produk **selalu tersimpan** meski scraping gagal:

#### Tier 1 — OpenGraph Instant (< 1 detik)
```
Ambil: og:title, og:image, og:description
Langsung simpan → card muncul di katalog
Status: "preview"
```

#### Tier 2 — Cheerio HTML Parser (1–3 detik)
```
Fetch halaman Shopee → parse HTML statis
Ambil: title, harga, thumbnail, nama toko
Status: "basic"
```

#### Tier 3 — Playwright Headless (3–8 detik)
```
Render full JS → ambil data lengkap
Ambil: gallery lengkap, semua variasi, rating, sold, stok
Status: "full"
```

### Data yang Di-scrape

```typescript
interface ScrapedProduct {
  title: string
  thumbnail: string
  gallery: string[]
  price: number
  originalPrice?: number       // Harga sebelum diskon
  discountPercent?: number
  rating?: number
  soldCount?: number
  stock?: number
  shopName: string
  shopUrl: string
  variations?: ProductVariation[]
  description?: string
  shippingFrom?: string
  category?: string
  scrapeStatus: 'preview' | 'basic' | 'full'
  lastScraped: Date
}
```

### Anti-Detection Measures (Scraper Microservice)

```typescript
// Rotating user agents
// Random delay: 1500–4000ms
// Realistic viewport: 1920x1080
// Cookie persistence per session
// Residential proxy support (optional)
```

---

## 🗃️ Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String       @id @default(cuid())
  clerkId     String       @unique
  email       String       @unique
  username    String?      @unique
  avatarUrl   String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  products    Product[]
  collections Collection[]
  tags        Tag[]
}

model Product {
  id              String        @id @default(cuid())
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Source
  shopeeUrl       String
  shopeeProductId String?

  // Core Data
  title           String
  thumbnail       String?
  gallery         String[]
  price           Int           // dalam rupiah
  originalPrice   Int?
  discountPercent Int?

  // Shop Info
  shopName        String?
  shopUrl         String?

  // Product Stats
  rating          Float?
  soldCount       Int?
  stock           Int?
  variations      Json?

  // User Notes
  notes           String?
  priority        Priority      @default(NORMAL)
  status          ProductStatus @default(ACTIVE)

  // Scrape State
  scrapeStatus    ScrapeStatus  @default(PENDING)
  lastScraped     DateTime?

  // Price History
  priceHistory    PriceHistory[]

  // Relations
  collections     CollectionProduct[]
  tags            ProductTag[]

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([userId])
  @@index([shopeeUrl])
}

model PriceHistory {
  id        String   @id @default(cuid())
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  price     Int
  checkedAt DateTime @default(now())

  @@index([productId])
}

model Collection {
  id          String              @id @default(cuid())
  userId      String
  user        User                @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String?
  emoji       String?             // "🎮", "👟", "⌨️"
  color       String?             // Hex color untuk card
  isPublic    Boolean             @default(false)
  shareToken  String?             @unique @default(cuid())
  sortOrder   Int                 @default(0)

  products    CollectionProduct[]

  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@index([userId])
  @@index([shareToken])
}

model CollectionProduct {
  id           String     @id @default(cuid())
  collectionId String
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)
  productId    String
  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  sortOrder    Int        @default(0)
  addedAt      DateTime   @default(now())

  @@unique([collectionId, productId])
}

model Tag {
  id       String       @id @default(cuid())
  userId   String
  user     User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  name     String
  color    String?

  products ProductTag[]

  @@unique([userId, name])
}

model ProductTag {
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  tagId     String
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([productId, tagId])
}

enum Priority {
  LOW
  NORMAL
  HIGH
  MUST_BUY
}

enum ProductStatus {
  ACTIVE
  ARCHIVED
  BOUGHT
  UNAVAILABLE
}

enum ScrapeStatus {
  PENDING
  PREVIEW
  BASIC
  FULL
  FAILED
}
```

---

## 📁 Project Structure

```
bobalog/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   └── sign-up/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar + Navbar
│   │   ├── page.tsx                # Home — semua produk
│   │   ├── collections/
│   │   │   ├── page.tsx            # Semua collections
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Collection detail
│   │   ├── search/
│   │   │   └── page.tsx            # Search results
│   │   └── settings/
│   │       └── page.tsx            # User settings
│   ├── c/
│   │   └── [shareToken]/
│   │       └── page.tsx            # Public shared collection (no auth)
│   ├── api/
│   │   ├── scraper/
│   │   │   └── webhook/
│   │   │       └── route.ts        # Webhook dari scraper microservice
│   │   └── collections/
│   │       └── [token]/
│   │           └── route.ts        # Public collection API
│   ├── layout.tsx                  # Root layout
│   └── globals.css
│
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   └── mobile-nav.tsx
│   ├── product/
│   │   ├── product-card.tsx        # Card produk utama
│   │   ├── product-grid.tsx        # Grid layout
│   │   ├── product-modal.tsx       # Detail modal
│   │   ├── product-status-badge.tsx
│   │   ├── price-display.tsx       # Harga + diskon
│   │   └── product-skeleton.tsx    # Loading state
│   ├── collection/
│   │   ├── collection-card.tsx
│   │   ├── collection-grid.tsx
│   │   └── collection-form.tsx
│   ├── paste/
│   │   ├── smart-paste-bar.tsx     # URL input utama
│   │   └── paste-preview-modal.tsx # Preview sebelum save
│   ├── search/
│   │   └── search-command.tsx      # Fuzzy search modal (Cmd+K)
│   ├── three/
│   │   └── hero-background.tsx     # Three.js background
│   └── shared/
│       └── share-page.tsx          # Public share view
│
├── lib/
│   ├── prisma.ts                   # Prisma client singleton
│   ├── redis.ts                    # Upstash Redis client
│   ├── cloudinary.ts               # Cloudinary helpers
│   ├── shopee.ts                   # Shopee URL parser + validator
│   └── utils.ts                    # cn(), formatPrice(), dll
│
├── actions/
│   ├── product.actions.ts          # CRUD produk
│   ├── collection.actions.ts       # CRUD collections
│   └── scraper.actions.ts          # Trigger scraping job
│
├── hooks/
│   ├── use-products.ts
│   ├── use-collections.ts
│   └── use-paste.ts                # Handle paste event global
│
├── store/
│   └── ui.store.ts                 # Zustand UI state
│
├── types/
│   └── index.ts                    # Global types
│
├── prisma/
│   └── schema.prisma
│
├── scraper/                        # Microservice terpisah
│   ├── index.ts                    # Express server
│   ├── shopee.scraper.ts           # Playwright scraper
│   ├── parser.ts                   # HTML parser
│   └── Dockerfile
│
├── .env.local
├── middleware.ts                   # Clerk auth middleware
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 🚀 Core Features

### 1. Smart Paste Bar

Komponen utama app. Selalu visible di top bar.

```
┌─────────────────────────────────────────────────────┐
│  🔗  Paste Shopee link...              [Save] [⌘V]  │
└─────────────────────────────────────────────────────┘
```

**Behavior:**
- Auto-detect paste event (Ctrl/Cmd+V) di mana saja di halaman
- Validate URL format Shopee (`shopee.co.id/...`)
- Show loading state saat scraping
- Muncul preview modal: thumbnail + title + harga
- User pilih collection → Save
- Card langsung muncul di grid (optimistic update)

---

### 2. Product Card

```
┌────────────────────────┐
│  [thumbnail image]     │
│                        │
│  ● status badge        │
├────────────────────────┤
│  Nama Produk Panjang.. │
│  Toko Name             │
│                        │
│  Rp 250.000  ~~320rb~~ │
│  ⭐ 4.8  •  sold 1.2k  │
│                        │
│  🏷️ gaming  keyboard   │
└────────────────────────┘
```

**Smart Status Badges:**
- 🟢 `Price Dropped` — harga turun dari terakhir dicek
- 🔴 `Price Increased` — harga naik
- ⚫ `Sold Out` — stok habis
- 🟡 `Unavailable` — produk dihapus/dinonaktifkan
- 🟣 `On Sale` — ada diskon aktif

---

### 3. Product Detail Modal

Slide-in dari kanan saat card diklik.

```
┌─────────────────────────────────────────────────┐
│  ← Back          [Open Shopee ↗]  [Archive] [⋮] │
├────────────────┬────────────────────────────────┤
│                │  Nama Produk Panjang            │
│  [Image        │  by TokoXYZ ⭐ 4.8              │
│   Carousel]    │                                 │
│                │  Rp 250.000                     │
│                │  ~~Rp 320.000~~  (-22%)         │
│                │                                 │
│                │  📦 Sold: 1.2k                  │
│                │  🏪 Stok: 50                    │
│                │  📍 Dari: Jakarta               │
│                │                                 │
│                │  Variasi:                       │
│                │  [Blue] [Red] [Black]           │
│                ├─────────────────────────────────│
│                │  📝 Notes pribadi...            │
│                │                                 │
│                │  🏷️ Tags: gaming, keyboard      │
│                │                                 │
│                │  📊 Price History               │
│                │  ──────── chart ────────        │
│                │                                 │
│                │  🕐 Last checked: 2 jam lalu    │
└────────────────┴────────────────────────────────┘
```

---

### 4. Collections

Halaman manajemen koleksi.

```
Collections
──────────────────────────────────────

  🎮 Gaming Setup      (12 produk)  [Share] [⋮]
  👟 Sneakers          (8 produk)   [Share] [⋮]
  ⌨️ Keyboard Build    (24 produk)  [Share] [⋮]
  💸 Future Buy        (5 produk)   [Share] [⋮]

  [+ New Collection]
```

**Features:**
- Drag & drop reorder (dnd-kit)
- Emoji picker untuk icon
- Color accent picker
- Toggle public/private
- Share URL generator

---

### 5. Fast Search (Cmd+K)

```
┌─────────────────────────────────────────────────┐
│  🔍  Search products, collections, tags...       │
├─────────────────────────────────────────────────┤
│  Recent                                          │
│  ─────────────────────────────────────────────  │
│  🖱️ Mouse Logitech MX Master 3                  │
│  ⌨️ Keychron K2 Pro                             │
│                                                  │
│  Products                                        │
│  ─────────────────────────────────────────────  │
│  [thumbnail] Nama produk ...    Rp 250.000       │
│  [thumbnail] Nama produk 2...   Rp 80.000        │
└─────────────────────────────────────────────────┘
```

**Search across:** title, shop name, tags, notes, collection name

**Library:** Fuse.js (client-side fuzzy search) + server search fallback

---

### 6. Share Collection

Public URL: `bobalog.app/c/ax72s92`

```
┌──────────────────────────────────────────────────┐
│  🧋 Bobalog                         [Save a copy]│
├──────────────────────────────────────────────────┤
│                                                   │
│  Gaming Setup oleh @username                      │
│  12 produk  •  terakhir update 2 hari lalu        │
│                                                   │
│  [card] [card] [card]                             │
│  [card] [card] [card]                             │
│                                                   │
│  Powered by Bobalog 🧋                            │
└──────────────────────────────────────────────────┘
```

- No auth required untuk view
- Read-only (tidak bisa edit)
- "Save a copy" → register/login → copy ke koleksi sendiri

---

## 🎨 UI & Design System

### Design Principles

- **Minimal tapi berkarakter** — bukan polos, tapi nggak lebay
- **Glassmorphism ringan** — blur + semi-transparent cards
- **Apple-level spacing** — whitespace adalah fitur
- **Smooth everything** — Lenis + Framer Motion

### Color System

```css
:root {
  /* Background */
  --bg-base: #0a0a0f;
  --bg-surface: #111118;
  --bg-overlay: #1a1a24;

  /* Glass */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(12px);

  /* Brand (Boba colors 🧋) */
  --accent-primary: #c4a882;    /* Warm milk tea */
  --accent-purple: #9b7fe8;     /* Taro */
  --accent-pink: #f29cc4;       /* Strawberry */
  --accent-green: #7bcfa0;      /* Matcha */

  /* Text */
  --text-primary: #f0ece6;
  --text-secondary: #8a8a9e;
  --text-muted: #4a4a5e;
}
```

### Typography

```typescript
// next/font setup
import { Geist, Geist_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})
```

### Component Patterns

```tsx
// Glass Card
<div className="
  rounded-2xl
  border border-white/8
  bg-white/4
  backdrop-blur-xl
  p-4
  hover:border-white/16
  hover:bg-white/6
  transition-all duration-300
">

// Price Display
<div className="flex items-baseline gap-2">
  <span className="text-2xl font-semibold text-white">
    Rp {formatPrice(price)}
  </span>
  {originalPrice && (
    <span className="text-sm text-white/40 line-through">
      Rp {formatPrice(originalPrice)}
    </span>
  )}
  {discountPercent && (
    <Badge className="bg-red-500/20 text-red-400">
      -{discountPercent}%
    </Badge>
  )}
</div>
```

### Three.js Hero Background

```tsx
// components/three/hero-background.tsx
// Subtle animated particles / fluid mesh
// Milk tea color palette
// Nggak ganggu readability
// Performance: hanya render di viewport hero
```

### Animation Patterns

```typescript
// Framer Motion variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1 },
}

const staggerChildren = {
  visible: {
    transition: { staggerChildren: 0.05 }
  }
}

// Page transitions
const pageVariants = {
  initial: { opacity: 0, x: -8 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 8 },
}
```

---

## 🔌 API Routes & Server Actions

### Server Actions

```typescript
// actions/product.actions.ts

'use server'

// Simpan produk baru dari URL
export async function saveProduct(url: string, collectionId?: string)

// Update notes/tags produk
export async function updateProduct(id: string, data: UpdateProductInput)

// Archive/unarchive produk
export async function toggleArchive(id: string)

// Delete produk
export async function deleteProduct(id: string)

// Ambil semua produk user
export async function getProducts(filters?: ProductFilters)
```

```typescript
// actions/collection.actions.ts

'use server'

// Buat collection baru
export async function createCollection(data: CreateCollectionInput)

// Update collection
export async function updateCollection(id: string, data: UpdateCollectionInput)

// Toggle public/private
export async function toggleCollectionPublic(id: string)

// Generate/reset share token
export async function refreshShareToken(id: string)

// Reorder collections
export async function reorderCollections(ids: string[])
```

### API Routes

```typescript
// app/api/scraper/webhook/route.ts
// POST — Terima hasil scraping dari microservice
// Verify secret token → update product di DB

// app/api/collections/[token]/route.ts
// GET — Public collection data (no auth)
// Rate limited: 60 req/menit per IP
```

### Scraper Microservice API

```
POST /scrape
Body: { url: string, productId: string, callbackUrl: string }
Response: { jobId: string, status: "queued" }

GET /jobs/:jobId
Response: { status: "pending" | "done" | "failed", data?: ScrapedProduct }
```

---

## 📅 Implementation Phases

### Phase 0 — Setup & Foundation (Hari 1–2)
- [ ] Init Next.js 15 project dengan TypeScript
- [ ] Setup TailwindCSS v4
- [ ] Setup shadcn/ui
- [ ] Setup Clerk auth
- [ ] Setup Prisma + Supabase
- [ ] Setup Upstash Redis
- [ ] Setup Cloudinary
- [ ] Deploy ke Vercel (empty)
- [ ] Setup Railway project (scraper)
- [ ] Setup environment variables

### Phase 1 — Core Data Layer (Hari 3–4)
- [ ] Implementasi Prisma schema
- [ ] Migrasi DB
- [ ] CRUD Server Actions: products
- [ ] CRUD Server Actions: collections
- [ ] Clerk middleware
- [ ] User onboarding (auto-create user row saat signup)

### Phase 2 — Scraper Microservice (Hari 5–7)
- [ ] Setup Express server di `/scraper`
- [ ] Implementasi Playwright scraper untuk Shopee
- [ ] Tier 1: OpenGraph fallback
- [ ] Tier 2: Cheerio HTML parser
- [ ] Tier 3: Playwright full render
- [ ] Webhook endpoint untuk callback
- [ ] Deploy ke Railway
- [ ] Test end-to-end scraping

### Phase 3 — UI Core (Hari 8–12)
- [ ] Layout: Sidebar + Navbar + Mobile Nav
- [ ] Smart Paste Bar
- [ ] Product Card component
- [ ] Product Grid
- [ ] Product Skeleton
- [ ] Product Detail Modal
- [ ] Collection Card + Grid
- [ ] Basic responsive layout

### Phase 4 — Features (Hari 13–17)
- [ ] Smart Paste full flow (paste → scrape → preview → save)
- [ ] Collections page + drag & drop reorder
- [ ] Create/edit collection modal
- [ ] Tags system
- [ ] Product notes
- [ ] Product status (archive, bought)
- [ ] Share collection feature
- [ ] Public share page (`/c/[token]`)

### Phase 5 — Search & Polish (Hari 18–20)
- [ ] Fuzzy search (Fuse.js)
- [ ] Cmd+K search modal
- [ ] Price history chart (Recharts / Tremor)
- [ ] Smart Status badges
- [ ] Lenis smooth scroll setup
- [ ] Three.js hero background
- [ ] Framer Motion page transitions
- [ ] Animation polish semua komponen
- [ ] Dark mode finalisasi

### Phase 6 — QA & Launch (Hari 21–23)
- [ ] Error boundaries
- [ ] Loading states semua page
- [ ] Empty states semua page
- [ ] Mobile testing
- [ ] Performance audit (Lighthouse)
- [ ] Rate limiting audit
- [ ] Security review
- [ ] Final deploy

---

## 🌐 Deployment Strategy

### Vercel (Frontend + Backend)

```bash
# Environment
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
DATABASE_URL=
DIRECT_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SCRAPER_URL=
SCRAPER_SECRET=
NEXT_PUBLIC_APP_URL=
```

### Railway (Scraper)

```dockerfile
# scraper/Dockerfile
FROM mcr.microsoft.com/playwright/node:22-jammy
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

```yaml
# railway.toml
[deploy]
  startCommand = "node dist/index.js"
  healthcheckPath = "/health"
```

---

## 🔐 Environment Variables

```bash
# .env.local

# Auth - Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Database - Supabase + Prisma
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Cache - Upstash Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Storage - Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Scraper Microservice
SCRAPER_URL=https://bobalog-scraper.railway.app
SCRAPER_SECRET=your-webhook-secret-token

# App
NEXT_PUBLIC_APP_URL=https://bobalog.app
```

---

## 🔮 Future Roadmap

### v1.1 — Price Alerts
- [ ] Cron job cek harga semua produk aktif (setiap 24 jam)
- [ ] Notifikasi in-app saat harga turun
- [ ] Email notif (Resend)
- [ ] Push notification (optional)

### v1.2 — Multi Platform
- [ ] Support Tokopedia
- [ ] Support Lazada
- [ ] Support TikTok Shop
- [ ] Universal product card

### v1.3 — Social Features
- [ ] Follow user lain
- [ ] Feed koleksi publik
- [ ] Like / save koleksi temen
- [ ] Comment on shared collection

### v1.4 — AI Features
- [ ] Auto-categorize produk saat paste
- [ ] "Find similar cheaper" — rekomendasi alternatif lebih murah
- [ ] Budget tracking per collection
- [ ] Smart buying priority ranking

### v2.0 — Mobile App
- [ ] React Native / Expo
- [ ] Share ke Bobalog dari browser Shopee (share sheet)
- [ ] Widget koleksi di home screen

---

## 📦 Dependencies Summary

```json
{
  "dependencies": {
    "next": "^15.x",
    "react": "^19.x",
    "react-dom": "^19.x",
    "@clerk/nextjs": "^6.x",
    "@prisma/client": "^5.x",
    "@upstash/redis": "^1.x",
    "cloudinary": "^2.x",
    "zustand": "^5.x",
    "zod": "^3.x",
    "react-hook-form": "^7.x",
    "@hookform/resolvers": "^3.x",
    "framer-motion": "^12.x",
    "@studio-freight/lenis": "^1.x",
    "three": "^0.170.x",
    "@react-three/fiber": "^8.x",
    "@react-three/drei": "^9.x",
    "fuse.js": "^7.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "recharts": "^2.x",
    "lucide-react": "^0.400.x",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "sonner": "^1.x",
    "cmdk": "^1.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "typescript": "^5.x",
    "@types/react": "^19.x",
    "@types/node": "^22.x",
    "@types/three": "^0.170.x"
  }
}
```

```json
// scraper/package.json
{
  "dependencies": {
    "express": "^4.x",
    "playwright": "^1.x",
    "cheerio": "^1.x",
    "axios": "^1.x",
    "zod": "^3.x"
  }
}
```

---

## 🧋 Brand & Copy

**App Name:** Bobalog

**Tagline options:**
> Your personal Shopee brain.
> Save first. Buy later.
> Keranjangmu udah penuh? Kita tampung.

**Logo Direction:**
- Icon: 🧋 Boba cup yang stylized
- Font: Geist dengan custom letter-spacing
- Color: Warm milk tea `#c4a882` sebagai primary accent

**Voice & Tone:**
- Casual Indonesia-English (seperti dokumen ini)
- Friendly, nggak formal
- Helpful, nggak pushy

---

*Plan ini digenerate untuk AI agent developer. Semua arsitektur, schema, dan phase timeline bisa dieksekusi langsung sebagai prompt ke coding agent (Cursor, Claude Code, dll).*

*Last updated: Juni 2026*
*Version: 1.0.0*