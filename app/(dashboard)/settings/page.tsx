'use client'

import { useAuth, UserProfile } from '@clerk/nextjs'

export default function SettingsPage() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded || !isSignedIn) {
    return null
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-semibold text-text-primary tracking-tight">
          Pengaturan
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Kelola preferensi akun dan profil Anda
        </p>
      </div>

      <div className="bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-xl">
        <UserProfile 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none bg-transparent w-full max-w-none",
              navbar: "hidden", // Hide clerk sidebar since we have our own
              pageScrollBox: "p-0",
              headerTitle: "text-text-primary",
              headerSubtitle: "text-text-muted",
              profileSectionTitle: "text-text-primary border-b border-[var(--color-glass-border)] pb-2",
              profileSectionTitleText: "font-semibold",
              profileSectionItem: "border-b border-[var(--color-glass-border)]",
              profileSectionPrimaryButton: "text-boba hover:bg-boba/10",
              avatarImageActionsUpload: "text-boba",
              formButtonPrimary: "bg-boba text-[color:var(--btn-primary-text)] hover:bg-boba-dark",
              formButtonReset: "text-text-muted hover:bg-[var(--color-glass-bg-hover)]",
              formFieldLabel: "text-text-secondary",
              formFieldInput: "bg-[var(--color-bg-surface)] border-[var(--color-glass-border)] text-text-primary",
            }
          }}
        />
      </div>
    </div>
  )
}
