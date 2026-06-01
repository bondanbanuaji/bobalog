import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import ThemeProvider from "@/components/theme/theme-provider";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bobalog — Katalog Shopee Pribadimu 🧋",
  description:
    "Simpan dulu, beli nanti. Organisir wishlist Shopee kamu dengan koleksi cerdas dan tampilan katalog yang cantik.",
  keywords: ["shopee", "wishlist", "katalog", "harga", "bobalog"],
  openGraph: {
    title: "Bobalog — Katalog Shopee Pribadimu 🧋",
    description: "Simpan dulu, beli nanti. Organisir wishlist Shopee kamu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="noise-overlay">
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
        >
          <ThemeProvider>
            {/* Floating Boba Pearls Background */}
            <div className="boba-bg" aria-hidden="true">
              <div className="boba-pearl" />
              <div className="boba-pearl" />
              <div className="boba-pearl" />
              <div className="boba-pearl" />
              <div className="boba-pearl" />
              <div className="boba-pearl" />
            </div>

            {/* App Content */}
            <div className="relative z-10">
              {children}
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
