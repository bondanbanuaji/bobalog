import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number as Indonesian Rupiah
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) return '0'
  return new Intl.NumberFormat('id-ID').format(price)
}

/**
 * Format large numbers compactly (e.g., 1200 → "1.2k")
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return '0'
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`
  }
  return num.toString()
}

/**
 * Validate if a URL is a Shopee link
 */
export function isShopeeUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return (
      parsed.hostname.includes('shopee.co.id') ||
      parsed.hostname.includes('shopee.com') ||
      parsed.hostname.includes('shp.ee')
    )
  } catch {
    return false
  }
}

/**
 * Get relative time string (e.g., "2 jam lalu")
 */
export function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)

  if (months > 0) return `${months} bulan lalu`
  if (weeks > 0) return `${weeks} minggu lalu`
  if (days > 0) return `${days} hari lalu`
  if (hours > 0) return `${hours} jam lalu`
  if (minutes > 0) return `${minutes} menit lalu`
  return 'Baru saja'
}

/**
 * Extract Shopee product ID from URL
 */
export function extractShopeeProductId(url: string): string | null {
  const match = url.match(/i\.(\d+)\.(\d+)/)
  if (match) return `${match[1]}.${match[2]}`

  const altMatch = url.match(/product\/(\d+)\/(\d+)/)
  if (altMatch) return `${altMatch[1]}.${altMatch[2]}`

  return null
}

/**
 * Priority display config
 */
export const priorityConfig = {
  LOW: { label: 'Low', color: 'text-gray-400', bg: 'bg-gray-500/10' },
  NORMAL: { label: 'Normal', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  HIGH: { label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  MUST_BUY: { label: 'Must Buy!', color: 'text-red-400', bg: 'bg-red-500/10' },
} as const

/**
 * Status display config
 */
export const statusConfig = {
  ACTIVE: { label: 'Active', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ARCHIVED: { label: 'Archived', color: 'text-gray-400', bg: 'bg-gray-500/10' },
  BOUGHT: { label: 'Bought ✓', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  UNAVAILABLE: { label: 'Unavailable', color: 'text-red-400', bg: 'bg-red-500/10' },
} as const
