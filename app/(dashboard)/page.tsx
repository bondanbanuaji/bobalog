'use client'

import { Package, Store, Tags } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import SplitText from '@/components/reactbits/SplitText'
import BlurText from '@/components/reactbits/BlurText'
import GradientText from '@/components/reactbits/GradientText'
import SpotlightCard from '@/components/reactbits/SpotlightCard'
import Aurora from '@/components/reactbits/Aurora'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const CircularGallery = dynamic(() => import('@/components/reactbits/CircularGallery'), { ssr: false })

export default function DashboardOverviewPage() {
  const { products, collections, setActiveProductId } = useUIStore()

  // 1. Hitung Statistik (Real Data)
  const stats = useMemo(() => {
    const totalProduk = products.length
    
    const uniqueShops = new Set(products.map(p => p.shopName).filter(Boolean))
    const totalToko = uniqueShops.size
    
    const totalKategori = collections.length
    

    return [
      { label: 'Total Produk', value: totalProduk, icon: Package, color: 'text-boba', spotlightColor: 'rgba(196, 168, 130, 0.2)' },
      { label: 'Toko Dipantau', value: totalToko, icon: Store, color: 'text-taro', spotlightColor: 'rgba(155, 127, 232, 0.2)' },
      { label: 'Koleksi', value: totalKategori, icon: Tags, color: 'text-matcha', spotlightColor: 'rgba(123, 207, 160, 0.2)' },
    ]
  }, [products, collections])

  // 2. Hitung Penambahan Produk Harian (7 Hari Terakhir)
  const chartPenambahanHarian = useMemo(() => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return { 
        date: d, 
        name: d.toLocaleDateString('id-ID', { weekday: 'short' }), 
        count: 0 
      }
    })

    products.forEach(p => {
      if (!p.createdAt) return
      const pDate = new Date(p.createdAt)
      const match = last7Days.find(d => 
        d.date.getDate() === pDate.getDate() &&
        d.date.getMonth() === pDate.getMonth() &&
        d.date.getFullYear() === pDate.getFullYear()
      )
      if (match) match.count++
    })

    return last7Days
  }, [products])

  // 3. Carousel Produk Interaktif
  const galleryItems = useMemo(() => {
    return products.slice(0, 15).map(p => ({
      image: p.thumbnail || `https://picsum.photos/seed/${p.id}/800/600`,
      text: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
      id: p.id
    }))
  }, [products])



  return (
    <div className="space-y-6 relative z-10">
      {/* Background Aurora */}
      <div className="absolute inset-0 -top-6 -mx-4 sm:-mx-8 z-0 pointer-events-none h-[400px]">
        <Aurora 
          colorStops={['#c4a882', '#9b7fe8', '#f29cc4', '#7bcfa0']} 
          blur="120px" 
          speed={10} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-base" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 pt-4">
        <div>
          <SplitText
            text="Dashboard"
            tag="h1"
            className="text-2xl sm:text-3xl font-display font-semibold text-text-primary tracking-tight drop-shadow-md"
            delay={0.04}
            splitBy="chars"
          />
          <BlurText
            text="Ringkasan analitik dan status katalog Shopee kamu."
            className="text-sm text-text-muted mt-1"
            delay={0.03}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <SpotlightCard
                className="glass-card p-5 space-y-3 rounded-2xl"
                spotlightColor={stat.spotlightColor}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] ${stat.color}`}>
                    <Icon size={18} className="currentColor" />
                  </div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                </div>
                <h3 className="text-2xl font-semibold text-text-primary">
                  <GradientText
                    colors={
                      stat.color === 'text-boba'
                        ? ['#d4be9e', '#c4a882', '#a08660']
                        : stat.color === 'text-taro'
                        ? ['#b49ef0', '#9b7fe8', '#8b5cf6']
                        : ['#a0e0bc', '#7bcfa0', '#4ade80']
                    }
                    animationSpeed={6}
                  >
                    {stat.value}
                  </GradientText>
                </h3>
              </SpotlightCard>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SpotlightCard className="glass-card p-6 flex flex-col rounded-2xl" spotlightColor="rgba(196, 168, 130, 0.12)">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-text-primary">Penambahan Produk Harian</h3>
              <p className="text-sm text-text-muted">7 hari terakhir</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartPenambahanHarian} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-boba)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-boba)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-glass-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-glass-border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--color-text-primary)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="var(--color-boba)" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SpotlightCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SpotlightCard className="glass-card p-6 flex flex-col rounded-2xl h-full" spotlightColor="rgba(155, 127, 232, 0.12)">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-text-primary">Galeri Produk</h3>
              <p className="text-sm text-text-muted">Produk terbaru di katalogmu</p>
            </div>
            <div className="flex-1 w-full relative min-h-[256px]">
              {galleryItems.length > 0 ? (
                <div style={{ position: 'absolute', inset: -16, borderRadius: '16px', overflow: 'hidden' }}>
                  <CircularGallery
                    items={galleryItems}
                    bend={3}
                    textColor="#ffffff"
                    borderRadius={0.08}
                    scrollEase={0.04}
                    font="bold 24px Inter"
                    scrollSpeed={1.8}
                    onItemClick={(item) => {
                      if (item && item.id) {
                        setActiveProductId(item.id)
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-text-muted text-sm border border-dashed border-[var(--color-glass-border)] rounded-xl">
                  Belum ada produk
                </div>
              )}
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  )
}

