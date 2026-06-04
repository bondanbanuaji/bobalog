'use client'

import { Menu, Search, Command } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import SmartPasteBar from '@/components/paste/smart-paste-bar'
import ThemeToggle from '@/components/theme/theme-toggle'

export default function Navbar() {
  const { toggleSidebar, setSearchOpen } = useUIStore()

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-base)]/60 backdrop-blur-xl">
      <div className="flex items-center gap-2 sm:gap-3 h-14 sm:h-16 px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Mobile menu toggle */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-[var(--color-glass-bg-hover)] text-text-secondary transition-colors flex-shrink-0"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>

        {/* Smart Paste Bar — scales across breakpoints */}
        <div className="flex-1 min-w-0 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
          <SmartPasteBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto">
          {/* Theme toggle */}
          <div className="hidden lg:flex">
            <ThemeToggle className="w-auto h-auto !p-2" />
          </div>

          {/* Search shortcut */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-xl hover:bg-[var(--color-glass-bg-hover)] text-text-secondary transition-colors md:px-3 md:py-2 md:gap-2 md:border md:border-[var(--color-glass-border)] md:bg-[var(--color-glass-bg)] md:text-text-muted md:text-sm inline-flex items-center"
            aria-label="Cari"
          >
            <Search size={16} className="md:w-3.5 md:h-3.5" />
            <span className="hidden md:inline">Cari...</span>
            <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[var(--color-glass-bg-hover)] text-[10px] font-mono font-medium">
              <Command size={10} />K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  )
}
