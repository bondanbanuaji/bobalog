'use client'

import { useState, useCallback } from 'react'
import { Link2, Loader2, Check, X, Plus, LogIn } from 'lucide-react'
import { useAuth, SignInButton } from '@clerk/nextjs'
import { isShopeeUrl } from '@/lib/utils'
import { useUIStore } from '@/store/ui.store'

type PasteState = 'idle' | 'validating' | 'scraping' | 'success' | 'error'

export default function SmartPasteBar() {
  const [url, setUrl] = useState('')
  const [state, setState] = useState<PasteState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const { isSignedIn } = useAuth()
  
  const { setQuickAddModalOpen, setPastedUrl } = useUIStore()

  const handleSubmit = useCallback(async () => {
    if (!url.trim()) {
      // Open modal empty for manual entry
      setPastedUrl(null)
      setQuickAddModalOpen(true)
      return
    }

    setState('validating')

    // Validate URL
    if (!isShopeeUrl(url)) {
      setState('error')
      setErrorMsg('Bukan link Shopee yang valid')
      setTimeout(() => {
        setState('idle')
        setErrorMsg('')
      }, 3000)
      return
    }

    // Success - Open Modal
    setState('success')
    setPastedUrl(url)
    setQuickAddModalOpen(true)
    
    setTimeout(() => {
      setState('idle')
      setUrl('')
    }, 1000)
  }, [url, setQuickAddModalOpen, setPastedUrl])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text')
    if (isShopeeUrl(pastedText)) {
      setUrl(pastedText)
      setTimeout(() => {
        handleSubmit()
      }, 300)
    }
  }, [handleSubmit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  // ── Not signed in: show login prompt ──
  if (!isSignedIn) {
    return (
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            <Link2 size={16} />
          </div>
          <div className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] text-text-muted cursor-default select-none truncate">
            Masuk untuk mulai menyimpan produk...
          </div>
        </div>
        <SignInButton mode="modal">
          <button className="btn-primary px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <LogIn size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">Masuk</span>
          </button>
        </SignInButton>
      </div>
    )
  }

  // ── Signed in: full paste bar ──
  return (
    <div className="relative flex items-center gap-1.5 sm:gap-2">
      <div className="relative flex-1 min-w-0">
        {/* Icon */}
        <div className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
          {state === 'scraping' ? (
            <Loader2 size={14} className="animate-spin text-boba sm:w-4 sm:h-4" />
          ) : state === 'success' ? (
            <Check size={14} className="text-matcha sm:w-4 sm:h-4" />
          ) : state === 'error' ? (
            <X size={14} className="text-red-400 sm:w-4 sm:h-4" />
          ) : (
            <Link2 size={14} className="sm:w-4 sm:h-4" />
          )}
        </div>

        {/* Input */}
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder="Paste link Shopee..."
          disabled={state === 'scraping'}
          className={`
            w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm
            bg-[var(--color-glass-bg)] border transition-all duration-200
            text-[var(--color-text-primary)]
            placeholder:text-text-muted focus:outline-none
            ${state === 'error'
              ? 'border-red-500/30 focus:border-red-500/50 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
              : state === 'success'
                ? 'border-matcha/30'
                : 'border-[var(--color-glass-border)] focus:border-boba/40 focus:shadow-[0_0_0_3px_rgba(196,168,130,0.08)]'
            }
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
          id="smart-paste-bar"
        />

        {/* Status text — hidden on very small screens */}
        {state === 'scraping' && (
          <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-boba font-medium animate-pulse">
            Scraping...
          </span>
        )}
        {state === 'success' && (
          <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-matcha font-medium">
            Tersimpan! ✓
          </span>
        )}
        {state === 'error' && errorMsg && (
          <span className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-red-400 font-medium">
            {errorMsg}
          </span>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={handleSubmit}
        disabled={state === 'validating' || state === 'scraping'}
        className="btn-primary px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none flex-shrink-0"
      >
        <Plus size={14} className="sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Tambah</span>
      </button>
    </div>
  )
}
