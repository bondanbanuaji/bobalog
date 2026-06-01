'use client'

import { useEffect, useState } from 'react'
import { UserProfile } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import AuthLayout from '@/components/auth/AuthLayout'
import { getClerkAppearance } from '@/components/auth/ClerkAppearance'

export default function UserProfilePage() {
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

  return (
    <AuthLayout
      title="Profil Pengguna"
      subtitle="Kelola informasi akun Anda"
      isWide={true}
    >
      <UserProfile
        appearance={appearance}
        routing="path"
        path="/user-profile"
      />
    </AuthLayout>
  )
}
