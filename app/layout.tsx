import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DPDP Self-Check — India DPDP Act 2023 Compliance Tool",
  description:
    "Free, privacy-first self-assessment tool to check your organisation's compliance with India's Digital Personal Data Protection Act 2023. All data stays in your browser.",
  keywords: ["DPDP Act", "India data protection", "DPDP compliance", "privacy compliance", "GRC", "Data Protection Board"],
  authors: [{ name: "Sahil Singhi", url: "https://github.com/sahilsinghi" }],
  openGraph: {
    title: "DPDP Self-Check — India DPDP Act 2023 Compliance Tool",
    description:
      "Free self-assessment tool for India's Digital Personal Data Protection Act 2023. 66 questions, 11 obligation areas, privacy-first architecture.",
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "DPDP Self-Check compliance tool" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DPDP Self-Check",
    description: "Free DPDP Act 2023 compliance self-assessment tool for Indian organisations.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
