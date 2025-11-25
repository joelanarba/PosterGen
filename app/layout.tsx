import type React from "react"
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/lib/auth-context"
import { PosterStorageProvider } from "@/lib/poster-storage"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" })

export const metadata: Metadata = {
  title: "PosterGen - AI Event Poster & Flyer Generator",
  description:
    "Create stunning event posters and flyers in seconds with AI. Perfect for churches, businesses, weddings, birthdays, and more.",
  keywords: ["poster generator", "flyer maker", "AI design", "event poster", "church flyer", "wedding invitation"],
    generator: 'v0.app'
}

export const viewport = {
  themeColor: "#FF6B35",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          <PosterStorageProvider>{children}</PosterStorageProvider>
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
