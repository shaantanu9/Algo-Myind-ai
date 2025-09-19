import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "DSA Learning Hub - Master Algorithms with Interactive Animations",
  description:
    "Learn Data Structures and Algorithms through interactive visualizations, AI explanations, and real-world analogies. Master coding interviews and engineering concepts.",
  generator: "v0.app",
  keywords: ["algorithms", "data structures", "coding interview", "programming", "computer science", "visualization"],
  authors: [{ name: "DSA Learning Hub" }],
  openGraph: {
    title: "DSA Learning Hub - Interactive Algorithm Learning",
    description: "Master algorithms with animations, AI explanations, and viral sharing",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
