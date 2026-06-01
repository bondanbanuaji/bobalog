'use client'

import { Sun, Moon } from 'lucide-react'
import { useThemeToggle } from './theme-provider'
import { motion, AnimatePresence } from 'framer-motion'

interface ThemeToggleProps {
  className?: string
  showText?: boolean
}

/**
 * ThemeToggle Component — Premium theme toggle with micro-animations
 * Supports dynamic scaling, rotation, accessibility, and mounted checking.
 */
export default function ThemeToggle({ className, showText = false }: ThemeToggleProps) {
  const { theme, handleToggle, mounted } = useThemeToggle()

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-xl bg-transparent border border-transparent text-text-muted cursor-wait"
        aria-hidden="true"
        disabled
      >
        <Moon size={18} className="opacity-50" />
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={handleToggle}
      className={`
        relative p-2 rounded-xl transition-all duration-300
        hover:bg-[var(--color-glass-bg-hover)] text-text-secondary hover:text-text-primary
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-boba/20
        flex items-center gap-3 w-full justify-start
        ${className || ''}
      `}
      aria-label={isDark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ y: 20, rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
            exit={{ y: -20, rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'backOut' }}
            className="absolute"
          >
            {isDark ? (
              <Sun size={18} className="text-boba drop-shadow-[0_0_8px_rgba(196,168,130,0.4)]" />
            ) : (
              <Moon size={18} className="text-taro drop-shadow-[0_0_8px_rgba(155,127,232,0.4)]" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {showText && (
        <span className="text-sm font-medium transition-colors duration-200">
          {isDark ? 'Mode Terang' : 'Mode Gelap'}
        </span>
      )}
    </button>
  )
}
