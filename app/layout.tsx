import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const meta Metadata = {
  title: 'CryptoLink - Secure Crypto-Based URL Shortener',
  description: 'Pay with cryptocurrency, get premium features. Secure, fast, and privacy-focused URL shortening with advanced anti-bot protection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
  }
