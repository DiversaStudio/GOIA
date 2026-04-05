import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "GOIA - AI Governance Platform",
    template: "%s | GOIA"
  },
  description: "AI Governance SaaS Platform - Compliance, Privacy, Fairness, and Observability for AI Systems",
  keywords: ["AI Governance", "Compliance", "Privacy", "Fairness", "EU AI Act", "Audit"],
  authors: [{ name: "GOIA" }],
  creator: "GOIA",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://goia.ai",
    siteName: "GOIA",
    title: "GOIA - AI Governance Platform",
    description: "AI Governance SaaS Platform - Compliance, Privacy, Fairness, and Observability for AI Systems",
  },
  twitter: {
    card: "summary_large_image",
    title: "GOIA - AI Governance Platform",
    description: "AI Governance SaaS Platform - Compliance, Privacy, Fairness, and Observability for AI Systems",
    creator: "@goia",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  )
}
