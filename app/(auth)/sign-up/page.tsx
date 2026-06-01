import { SignUp } from '@clerk/nextjs'
import { Logo } from '@/components/ui/logo'
import { clerkAppearance } from '@/lib/clerk-appearance'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="relative w-full max-w-[420px]">
        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-matcha/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-boba/15 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 glass-card p-6 sm:p-8 rounded-3xl flex flex-col items-center">
          {/* Logo & Branding */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-boba/20 to-boba-dark/20 border border-boba/30 flex items-center justify-center shadow-lg shadow-boba/10">
              <Logo size={32} />
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-display font-bold gradient-text-warm">
                Buat Akun Baru
              </h1>
              <p className="text-sm text-text-muted mt-1">
                Mulai organisir wishlist Shopee kamu
              </p>
            </div>
          </div>
          
          {/* Clerk Sign Up */}
          <div className="w-full">
            <SignUp 
              appearance={clerkAppearance}
              routing="hash"
            />
          </div>

          {/* Footer link */}
          <p className="mt-6 text-xs text-text-muted text-center">
            Sudah punya akun?{' '}
            <Link href="/sign-in" className="text-boba hover:text-boba-light font-medium transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
