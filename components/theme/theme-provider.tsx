'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { useUIStore } from '@/store/ui.store'

/**
 * ThemeProvider — wraps next-themes ThemeProvider to manage persistence,
 * server hydration support, and theme synchronization.
 */
// Suppress React 19 false positive console error warning regarding script tags inside components in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalError = console.error
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag while rendering React component')) {
      return
    }
    originalError(...args)
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      enableSystem={true}
      defaultTheme="system"
      attribute="data-theme"
    >
      <ThemeSync>{children}</ThemeSync>
    </NextThemesProvider>
  )
}

/**
 * Sync component to ensure Zustand store stays perfectly synchronized
 * with next-themes resolved values.
 */
function ThemeSync({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const { setTheme } = useUIStore()

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme as 'dark' | 'light')
    }
  }, [resolvedTheme, setTheme])

  return <>{children}</>
}

/**
 * Hook to toggle theme with a premium circular wave/reveal animation
 * originating from the cursor click position.
 * Employs CSS view-transitions if supported, and a hardware-accelerated fallback ripple.
 */
export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      if (!mounted) return

      const currentTheme = resolvedTheme || theme || 'dark'
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark'

      const x = e.clientX
      const y = e.clientY

      // Radial length calculation to span the viewport
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      // ── View Transition API (Chrome, Safari 18+, Edge, etc.) ──
      if (document.startViewTransition) {
        const transition = document.startViewTransition(() => {
          setTheme(nextTheme)
        })

        transition.ready.then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`
          ]

          document.documentElement.animate(
            {
              clipPath: clipPath,
            },
            {
              duration: 650,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        })
        return
      }

      // ── GPU-Accelerated Ripple Fallback (Firefox, older engines) ──
      const targetBg = nextTheme === 'light' ? '#f5f1ec' : '#0a0a0f'
      
      const ripple = document.createElement('div')
      ripple.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: ${targetBg};
        transform: translate(-50%, -50%);
        z-index: 99999;
        pointer-events: none;
        will-change: width, height, opacity;
        box-shadow: 0 0 50px rgba(196, 168, 130, 0.15);
      `
      document.body.appendChild(ripple)

      const diameter = maxRadius * 2
      const animation = ripple.animate(
        [
          { width: '0px', height: '0px', opacity: 0.8 },
          { width: `${diameter}px`, height: `${diameter}px`, opacity: 1 }
        ],
        {
          duration: 600,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
        }
      )

      // Shift theme in sync with the ripple swell
      setTimeout(() => {
        setTheme(nextTheme)
      }, 250)

      animation.onfinish = () => {
        ripple.remove()
      }
    },
    [theme, resolvedTheme, setTheme, mounted]
  )

  return { 
    theme: mounted ? (resolvedTheme || theme || 'dark') : 'dark', 
    handleToggle,
    mounted 
  }
}
