'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Show, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import {
  Home,
  FolderOpen,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { useUIStore } from '@/store/ui.store'
import ThemeToggle from '@/components/theme/theme-toggle'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Beranda', icon: Home },
  { href: '/collections', label: 'Koleksi', icon: FolderOpen },
  { href: '#search', label: 'Cari', icon: Search, action: 'search' },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, toggleSidebar, setSearchOpen, collections } = useUIStore()

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden',
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-40 flex flex-col transition-all duration-300 ease-out',
          'border-r border-[var(--color-glass-border)] bg-[var(--color-bg-surface)]/80 backdrop-blur-xl',
          sidebarOpen
            ? 'w-[280px] translate-x-0'
            : 'w-[72px] -translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-3 px-5 h-16 border-b border-[var(--color-glass-border)] w-full text-left focus:outline-none hover:bg-[var(--color-glass-bg-hover)] transition-colors cursor-pointer group"
          aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-boba/20 to-boba-dark/20 border border-boba/30 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Logo size={20} />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-lg tracking-tight gradient-text-warm">
              Bobalog
            </span>
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href) && item.href !== '#search'
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.action === 'search' ? '#' : item.href}
                  onClick={(e) => {
                    if (item.action === 'search') {
                      e.preventDefault()
                      setSearchOpen(true)
                    }
                  }}
                  className={cn('sidebar-link', isActive && 'active')}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>

          {/* Collections section (real data, empty state if none) */}
          {sidebarOpen && (
            <div className="mt-8">
              <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-widest text-text-muted">
                Koleksi
              </p>
              {collections.length === 0 ? (
                <p className="px-3 text-[12px] text-text-muted italic">
                  Belum ada koleksi
                </p>
              ) : (
                <div className="space-y-0.5">
                  {collections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.id}`}
                      className={cn(
                        'sidebar-link text-[13px]',
                        pathname === `/collections/${col.id}` && 'active'
                      )}
                    >
                      <span className="text-base flex-shrink-0">{col.emoji}</span>
                      <span className="truncate">{col.name}</span>
                      <span className="ml-auto text-[11px] text-text-muted font-medium">
                        {col.productCount}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Bottom section */}
        <div className="px-3 py-3 border-t border-[var(--color-glass-border)] space-y-2">
          {/* User Logged In */}
          <Show when="signed-in">
            <div className={cn('sidebar-link', !sidebarOpen && 'justify-center', 'pointer-events-none')}>
              <div className="pointer-events-auto h-7 w-7 flex items-center justify-center">
                <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-7 h-7' } }} />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate">Akun Saya</p>
                  <p className="text-[11px] text-text-muted truncate">Kelola profil</p>
                </div>
              )}
            </div>
          </Show>

          {/* User Logged Out */}
          <Show when="signed-out">
            <div className={cn('flex flex-col gap-2', !sidebarOpen && 'items-center')}>
              <SignInButton mode="modal">
                <button className={cn('btn-primary text-xs py-2', sidebarOpen ? 'w-full' : 'px-2 w-8 h-8 flex items-center justify-center rounded-full')}>
                  {sidebarOpen ? 'Masuk' : '→'}
                </button>
              </SignInButton>
              {sidebarOpen && (
                <SignUpButton mode="modal">
                  <button className="btn-ghost w-full text-xs py-1.5 border border-[var(--color-glass-border)] rounded-xl">
                    Daftar
                  </button>
                </SignUpButton>
              )}
            </div>
          </Show>
        </div>
      </aside>
    </>
  )
}
