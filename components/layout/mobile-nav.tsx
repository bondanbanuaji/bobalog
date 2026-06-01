'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderOpen, Search, Settings } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/collections', label: 'Koleksi', icon: FolderOpen },
  { href: '#search', label: 'Cari', icon: Search, action: 'search' },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
]

export default function MobileNav() {
  const pathname = usePathname()
  const { setSearchOpen } = useUIStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="border-t border-[var(--color-glass-border)] bg-[var(--color-bg-surface)]/90 backdrop-blur-xl px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = tab.href === '/'
              ? pathname === '/'
              : pathname.startsWith(tab.href) && tab.href !== '#search'
            const Icon = tab.icon

            return (
              <Link
                key={tab.href}
                href={tab.action === 'search' ? '#' : tab.href}
                onClick={(e) => {
                  if (tab.action === 'search') {
                    e.preventDefault()
                    setSearchOpen(true)
                  }
                }}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                  isActive
                    ? 'text-boba'
                    : 'text-text-muted hover:text-text-secondary'
                )}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-boba" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
