'use client'

import { useEffect, useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import AuthLayout from '@/components/auth/AuthLayout'
import { getClerkAppearance } from '@/components/auth/ClerkAppearance'
import Link from 'next/link'

export default function SignUpPage() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF9' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #c4a882', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  const theme = (resolvedTheme === 'dark' ? 'dark' : 'light') as 'light' | 'dark'
  const appearance = getClerkAppearance(theme)
  const linkColor = theme === 'dark' ? '#d4be9e' : '#c4a882'
  const linkHover = theme === 'dark' ? '#e8d5bd' : '#b09570'
  const mutedText = theme === 'dark' ? '#78716C' : '#A8A29E'

  return (
    <AuthLayout
      title="Buat Akun Baru"
      subtitle="Mulai organisir wishlist Shopee kamu"
    >
      <SignUp
        appearance={appearance}
        routing="path"
        path="/sign-up"
      />

      {/* Custom footer link — Clerk footer is hidden */}
      <p style={{ marginTop: 24, fontSize: 12, textAlign: 'center', color: mutedText }}>
        Sudah punya akun?{' '}
        <Link
          href="/sign-in"
          style={{ color: linkColor, fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
          onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
        >
          Masuk di sini
        </Link>
      </p>
    </AuthLayout>
  )
}
