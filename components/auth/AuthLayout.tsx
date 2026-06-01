'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-auth-display',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-auth-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  isWide?: boolean
}

export default function AuthLayout({ children, title, subtitle, isWide = false }: AuthLayoutProps) {
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

  const isDark = resolvedTheme === 'dark'

  // Colors
  const pageBg = isDark ? '#1A1A1A' : '#FAFAF9'
  const textPrimary = isDark ? '#F0EDE8' : '#1C1C1C'
  const textSecondary = isDark ? '#A8A29E' : '#78716C'
  const textMuted = isDark ? '#6B7280' : '#9CA3AF'
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const glassBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'
  const dotColor = isDark ? '#404040' : '#D6D3D1'
  const badgeGreen = isDark ? 'rgba(52,211,153,0.12)' : 'rgba(16,185,129,0.08)'
  const badgeGreenText = isDark ? '#6EE7B7' : '#059669'
  const badgeAmber = isDark ? 'rgba(251,191,36,0.12)' : 'rgba(245,158,11,0.08)'
  const badgeAmberText = isDark ? '#FCD34D' : '#D97706'
  const productBg = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)'

  return (
    <div
      className={`${playfair.variable} ${jakarta.variable}`}
      style={{
        fontFamily: "var(--font-auth-body), 'Plus Jakarta Sans', sans-serif",
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: pageBg,
        backgroundImage: isDark
          ? 'radial-gradient(circle at 10% 20%, rgba(196, 168, 130, 0.04) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(196, 168, 130, 0.03) 0%, transparent 40%)'
          : 'radial-gradient(circle at 10% 20%, rgba(196, 168, 130, 0.06) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(196, 168, 130, 0.05) 0%, transparent 40%)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        overflowX: 'hidden',
      }}
    >
      {/* Inline keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes authSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .auth-animate { animation: authSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .auth-animate-delay { animation: authSlideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }

        /* Force-hide Clerk watermark & dev badges via global CSS */
        .cl-internal-b3fm6y,
        .cl-internal-1pybe25,
        [data-clerk-badge],
        .cl-footer,
        .cl-card-actions + div,
        div[class*="cl-internal"] > a[href*="clerk.com"],
        div[class*="__internal"] { 
          display: none !important; 
          visibility: hidden !important;
          height: 0 !important;
          overflow: hidden !important;
        }
      `}} />

      {/* ═══════ DESKTOP: Two-Column Layout ═══════ */}
      <div style={{ display: 'flex', flex: 1, minHeight: '100vh' }}>

        {/* Left Column — Branding (hidden on mobile) */}
        <div
          className="auth-left-col"
          style={{
            width: '50%',
            display: 'none', // default hidden on mobile
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '48px 56px',
            borderRight: `1px solid ${borderColor}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient glow */}
          <div style={{ position: 'absolute', top: -160, left: -160, width: 400, height: 400, background: 'rgba(196,168,130,0.08)', filter: 'blur(120px)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 350, height: 350, background: 'rgba(196,168,130,0.05)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />

          {/* Logo */}
          <div className="auth-animate" style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto', width: '100%' }}>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(196,168,130,0.2), rgba(160,134,96,0.2))',
                border: '1px solid rgba(196,168,130,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
              }}>
                <Logo size={24} className="text-[#c4a882]" />
              </div>
              <span style={{
                fontFamily: "var(--font-auth-display), 'Playfair Display', serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: textPrimary,
              }}>
                Bobalog
              </span>
            </Link>
          </div>

          {/* Tagline & Mockup */}
          <div className="auth-animate-delay" style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: 'auto', width: '100%', padding: '48px 0' }}>
            <h2 style={{
              fontFamily: "var(--font-auth-display), 'Playfair Display', serif",
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: '-0.01em',
              color: textPrimary,
              margin: 0,
            }}>
              Simpan dulu, <br />
              <span style={{ color: '#c4a882' }}>beli nanti.</span>
            </h2>
            <p style={{
              marginTop: 24,
              fontSize: '1rem',
              color: textSecondary,
              lineHeight: 1.7,
              fontWeight: 300,
            }}>
              Organisir wishlist Shopee kamu dalam satu katalog pribadi yang cantik dan rapi. Dapatkan pembaruan status dan kelola belanjaan impian secara cerdas.
            </p>

            {/* Wishlist Mockup Card */}
            <div style={{
              marginTop: 48,
              padding: 24,
              borderRadius: 16,
              border: `1px solid ${cardBorder}`,
              background: glassBg,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}>
              {/* Dots & Label */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${cardBorder}` }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor }} />
                </div>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: textMuted }}>
                  Wishlist Mockup
                </span>
              </div>

              {/* Product rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Product 1 */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 10, borderRadius: 12, background: productBg,
                  border: `1px solid ${cardBorder}`, transition: 'border-color 0.3s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: isDark ? '#292524' : '#E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧋</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>Matcha Milk Tumbler</div>
                      <div style={{ fontSize: 10, color: textMuted }}>Shopee Mall</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: textPrimary }}>Rp 129.000</div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: badgeGreenText, background: badgeGreen, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 2 }}>Diskon 20%</span>
                  </div>
                </div>

                {/* Product 2 */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: 10, borderRadius: 12, background: productBg,
                  border: `1px solid ${cardBorder}`, transition: 'border-color 0.3s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: isDark ? '#292524' : '#E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⌨️</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: textPrimary }}>Minimalist Mechanical Keyboard</div>
                      <div style={{ fontSize: 10, color: textMuted }}>Star+ Seller</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: textPrimary }}>Rp 849.000</div>
                    <span style={{ fontSize: 9, fontWeight: 600, color: badgeAmberText, background: badgeAmber, padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 2 }}>Stok Menipis</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="auth-animate" style={{ position: 'relative', zIndex: 1, maxWidth: 480, margin: '0 auto', width: '100%', display: 'flex', gap: 16, fontSize: 12, color: textMuted }}>
            <span>&copy; {new Date().getFullYear()} Bobalog.</span>
            <Link href="/privacy" style={{ color: textMuted, textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: textMuted, textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>

        {/* Right Column — Clerk Form (centered) */}
        <div
          className="auth-right-col"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '24px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Mobile Header — visible only on mobile */}
          <div
            className="auth-mobile-header auth-animate"
            style={{
              display: 'flex', // shown by default, hidden on md+ via media query
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              marginBottom: 32,
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(196,168,130,0.2), rgba(160,134,96,0.2))',
              border: '1px solid rgba(196,168,130,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
              <Logo size={26} className="text-[#c4a882]" />
            </div>
            <div>
              <h1 style={{
                fontFamily: "var(--font-auth-display), 'Playfair Display', serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: textPrimary,
                margin: 0,
              }}>
                {title}
              </h1>
              <p style={{ fontSize: 13, color: textSecondary, marginTop: 4 }}>
                {subtitle}
              </p>
            </div>
          </div>

          {/* Auth Form Container */}
          <div
            className="auth-animate-delay"
            style={{
              width: '100%',
              maxWidth: isWide ? 840 : 400,
            }}
          >
            {children}
          </div>
        </div>
      </div>

      {/* ═══════ Responsive Media Queries ═══════ */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Desktop: md (768px+) */
        @media (min-width: 768px) {
          .auth-left-col {
            display: flex !important;
          }
          .auth-mobile-header {
            display: none !important;
          }
          .auth-right-col {
            padding: 48px 64px !important;
          }
        }
        /* Large desktop */
        @media (min-width: 1024px) {
          .auth-right-col {
            padding: 64px 80px !important;
          }
        }
      `}} />
    </div>
  )
}
