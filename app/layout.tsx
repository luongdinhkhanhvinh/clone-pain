import { ConditionalLayout } from "@/components/layout/conditional-layout"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import type React from "react"
import "./globals.css"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "arial"],
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  fallback: ["serif", "Times New Roman"],
})

export const metadata: Metadata = {
  title: {
    default: "Silklux - Premium Silklux Solutions",
    template: "%s | Silklux",
  },
  description:
    "Discover premium Silkluxs with natural finishes. High-quality Silklux colors and professional-grade products for discerning designers and homeowners.",
  keywords: [
    "luxury wood",
    "premium wood colors",
    "silk finish wood",
    "interior design",
    "SilkLux",
    "color consultation",
    "high-end wood",
  ],
  authors: [{ name: "SilkLux" }],
  creator: "SilkLux",
  publisher: "SilkLux",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://silklux.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://silklux.com",
    siteName: "SilkLux",
    title: "SilkLux - Premium Luxury wood & Color Solutions",
    description: "Discover premium luxury wood with silk-like finishes and sophisticated color palettes.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SilkLux Premium wood Colors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SilkLux - Premium Luxury wood & Color Solutions",
    description: "Discover premium luxury wood with silk-like finishes and sophisticated color palettes.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}
