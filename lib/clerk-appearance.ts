import type { SignIn } from '@clerk/nextjs'

type SignInProps = React.ComponentProps<typeof SignIn>
type ClerkAppearance = NonNullable<SignInProps['appearance']>

/**
 * Shared Clerk appearance configuration
 * Uses CSS variables so it adapts to both dark and light mode automatically
 */
export const clerkAppearance: ClerkAppearance = {
  variables: {
    colorPrimary: '#c4a882',
    colorText: 'var(--color-text-primary)',
    colorTextSecondary: 'var(--color-text-secondary)',
    colorBackground: 'transparent',
    colorInputBackground: 'var(--color-glass-bg)',
    colorInputText: 'var(--color-text-primary)',
    borderRadius: '0.75rem',
    fontFamily: "'DM Sans', sans-serif",
  },
  elements: {
    rootBox: 'mx-auto w-full',
    cardBox: 'shadow-none border-none bg-transparent w-full',
    card: 'shadow-none bg-transparent p-0',
    header: 'hidden',
    footer: {
      display: 'flex',
      justifyContent: 'center',
      '& a': {
        color: 'var(--color-text-muted)',
        fontSize: '12px',
      },
    },
    socialButtonsBlockButton: `
      bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)]
      text-[var(--color-text-primary)] rounded-xl py-2.5
      hover:bg-[var(--color-glass-bg-hover)] hover:border-[var(--color-glass-border-hover)]
      transition-all duration-200
    `,
    socialButtonsBlockButtonText: 'text-[var(--color-text-primary)] font-medium text-sm',
    socialButtonsBlockButtonArrow: 'text-[var(--color-text-muted)]',
    dividerLine: 'bg-[var(--color-glass-border)]',
    dividerText: 'text-[var(--color-text-muted)] text-xs',
    formFieldLabel: 'text-[var(--color-text-secondary)] text-xs font-medium mb-1',
    formFieldInput: `
      bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)]
      text-[var(--color-text-primary)] rounded-xl py-2.5 px-3
      focus:border-[#c4a882] focus:ring-2 focus:ring-[#c4a882]/20
      placeholder:text-[var(--color-text-muted)]
      transition-all duration-200
    `,
    formButtonPrimary: `
      bg-gradient-to-r from-[#c4a882] to-[#a08660]
      text-[#0a0a0f] font-semibold rounded-xl py-2.5
      hover:shadow-lg hover:shadow-[#c4a882]/20
      transition-all duration-200
    `,
    formButtonReset: 'text-[#c4a882] hover:text-[#d4be9e] text-sm',
    identityPreviewEditButton: 'text-[#c4a882] hover:text-[#d4be9e]',
    identityPreview: `
      bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)] rounded-xl
    `,
    otpCodeFieldInput: `
      bg-[var(--color-glass-bg)] border border-[var(--color-glass-border)]
      text-[var(--color-text-primary)] rounded-lg
      focus:border-[#c4a882] focus:ring-2 focus:ring-[#c4a882]/20
    `,
    alert: 'rounded-xl text-sm',
    alertText: 'text-sm',
    footerActionLink: 'text-[#c4a882] hover:text-[#d4be9e] font-medium',
  },
}
