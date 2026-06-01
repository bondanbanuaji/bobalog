import { dark } from "@clerk/themes"

/**
 * Generates the Clerk appearance configuration dynamically based on the current theme.
 * Uses inline CSS styles (not Tailwind classes) for reliable Clerk element overrides.
 *
 * This ensures unified styling across all Clerk auth components (SignIn, SignUp, UserProfile).
 */
export function getClerkAppearance(theme: "light" | "dark") {
  const isDark = theme === "dark"

  // Palette
  const bg = isDark ? "#1A1A1A" : "#FAFAF9"
  const inputBg = isDark ? "#242424" : "#FFFFFF"
  const textPrimary = isDark ? "#F0EDE8" : "#1C1C1C"
  const textSecondary = isDark ? "#9CA3AF" : "#6B7280"
  const textMuted = isDark ? "#6B7280" : "#9CA3AF"
  const brand = isDark ? "#d4be9e" : "#c4a882"
  const brandDark = "#a08660"
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const borderHover = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.14)"
  const glassBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
  const glassBgHover = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"

  return {
    baseTheme: isDark ? dark : undefined,

    variables: {
      colorBackground: bg,
      colorInputBackground: inputBg,
      colorText: textPrimary,
      colorTextSecondary: textSecondary,
      colorPrimary: brand,
      colorDanger: isDark ? "#EF9A9A" : "#E57373",
      borderRadius: "12px",
      fontFamily: "var(--font-auth-body), 'Plus Jakarta Sans', sans-serif",
    },

    elements: {
      /* ── Root / Container ── */
      rootBox: {
        width: "100%",
      },
      cardBox: {
        boxShadow: "none",
        border: "none",
        background: "transparent",
        width: "100%",
        maxWidth: "100%",
      },
      card: {
        background: "transparent",
        boxShadow: "none",
        padding: "0",
        border: "none",
      },

      /* ── Header ── */
      headerTitle: {
        fontFamily: "var(--font-auth-display), 'Playfair Display', serif",
        fontSize: "1.5rem",
        fontWeight: "700",
        letterSpacing: "-0.01em",
        color: textPrimary,
      },
      headerSubtitle: {
        color: textSecondary,
        fontSize: "0.875rem",
        marginTop: "4px",
      },

      /* ── Social Buttons ── */
      socialButtonsBlockButton: {
        background: glassBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "10px 16px",
        color: textPrimary,
        transition: "all 0.2s ease",
        "&:hover": {
          background: glassBgHover,
          borderColor: borderHover,
        },
      },
      socialButtonsBlockButtonText: {
        color: textPrimary,
        fontWeight: "500",
        fontSize: "0.875rem",
      },
      socialButtonsBlockButtonArrow: {
        color: textMuted,
      },

      /* ── Divider ── */
      dividerLine: {
        background: borderColor,
      },
      dividerText: {
        color: textMuted,
        fontSize: "0.75rem",
        fontWeight: "500",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
      },

      /* ── Form Fields ── */
      formFieldLabel: {
        color: textSecondary,
        fontSize: "0.75rem",
        fontWeight: "600",
        marginBottom: "6px",
        letterSpacing: "0.02em",
      },
      formFieldInput: {
        background: glassBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "10px 14px",
        color: textPrimary,
        fontSize: "0.875rem",
        transition: "all 0.2s ease",
        "&:focus": {
          borderColor: brand,
          boxShadow: `0 0 0 3px ${brand}20`,
        },
        "&::placeholder": {
          color: textMuted,
        },
      },

      /* ── Primary Button ── */
      formButtonPrimary: {
        background: `linear-gradient(135deg, ${brand} 0%, ${brandDark} 100%)`,
        color: "#0a0a0f",
        fontWeight: "600",
        borderRadius: "12px",
        padding: "10px 20px",
        fontSize: "0.875rem",
        border: "none",
        transition: "all 0.2s ease",
        cursor: "pointer",
        "&:hover": {
          boxShadow: `0 4px 20px ${brand}30`,
          transform: "translateY(-1px)",
        },
        "&:active": {
          transform: "scale(0.98)",
        },
      },
      formButtonReset: {
        color: brand,
        fontSize: "0.875rem",
        fontWeight: "500",
      },

      /* ── Identity Preview ── */
      identityPreviewEditButton: {
        color: brand,
      },
      identityPreview: {
        background: glassBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "12px",
        padding: "12px",
      },

      /* ── OTP ── */
      otpCodeFieldInput: {
        background: glassBg,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        color: textPrimary,
        "&:focus": {
          borderColor: brand,
          boxShadow: `0 0 0 3px ${brand}20`,
        },
      },

      /* ── Alerts ── */
      alert: {
        borderRadius: "12px",
        border: "1px solid rgba(239,68,68,0.15)",
        background: "rgba(239,68,68,0.05)",
        padding: "14px",
        fontSize: "0.875rem",
      },
      alertText: {
        color: textPrimary,
        fontSize: "0.875rem",
      },

      /* ── Hide Clerk watermark & dev badge ── */
      footer: { display: "none" },
      footerAction: { display: "none" },
      footerPages: { display: "none" },
      badge: { display: "none" },
    },
  }
}
