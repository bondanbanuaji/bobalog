'use client'

import { Package, Store, Tags, TrendingDown, AlertCircle } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

import { useMemo } from 'react'

export default function DashboardOverviewPage() {
  const { products, collections } = useUIStore()

  // 1. Hitung Statistik (Real Data)
  const stats = useMemo(() => {
    const totalProduk = products.length
    
    const uniqueShops = new Set(products.map(p => p.shopName).filter(Boolean))
    const totalToko = uniqueShops.size
    
    const totalKategori = collections.length
    
    const hargaTurun = products.filter(p => (p.discountPercent || 0) > 0 || p.priceChange === 'dropped').length
    
    const stokHabis = products.filter(p => p.stock === 0).length

    return [
      { label: 'Total Produk', value: totalProduk, icon: Package, color: 'text-boba' },
      { label: 'Toko Dipantau', value: totalToko, icon: Store, color: 'text-taro' },
      { label: 'Kategori', value: totalKategori, icon: Tags, color: 'text-matcha' },
      { label: 'Harga Turun', value: hargaTurun, icon: TrendingDown, color: 'text-green-500' },
      { label: 'Stok Habis', value: stokHabis, icon: AlertCircle, color: 'text-red-500' },
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

  // 3. Hitung Distribusi Toko (Top 5 Toko)
  const chartDistribusiToko = useMemo(() => {
    const shopCounts: Record<string, number> = {}
    products.forEach(p => {
      if (p.shopName) {
        shopCounts[p.shopName] = (shopCounts[p.shopName] || 0) + 1
      }
    })
    
    return Object.entries(shopCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ 
        name: name.length > 15 ? name.substring(0, 15) + '...' : name, 
        value 
      }))
  }, [products])



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-text-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Ringkasan analitik dan status katalog Shopee kamu.
          </p>
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
              className="glass-card p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] ${stat.color}`}>
                  <Icon size={18} className="currentColor" />
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
              </div>
              <h3 className="text-2xl font-semibold text-text-primary">
                {stat.value}
              </h3>
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
          className="glass-card p-6 flex flex-col"
        >
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium text-text-primary">Distribusi Toko</h3>
            <p className="text-sm text-text-muted">Top 5 toko dengan produk terbanyak</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartDistribusiToko} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-glass-border)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'var(--color-glass-bg-hover)' }}
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', borderColor: 'var(--color-glass-border)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="var(--color-taro)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
