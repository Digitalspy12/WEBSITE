import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AK 0121 — Done-For-You Tech Agency',
  description:
    'AK 0121 builds custom web apps, mission-critical systems, and AI-driven automation in weeks, not months. Stop fighting DIY tools. Start scaling.',
  generator: 'v0.app',
  keywords: ['AK 0121', 'tech agency', 'AI automation', 'web apps', 'done-for-you', 'custom software'],
  openGraph: {
    title: 'AK 0121 — Done-For-You Tech Agency',
    description: 'Custom web apps, AI automation, and mission-critical systems. Built in weeks.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased grain">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
