import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/Providers"
import Navigation from "@/components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cal.pro — Réservation en ligne",
  description: "Alternative française à Calendly. Paiements intégrés. Support français.",
  openGraph: {
    title: "Cal.pro — Réservation en ligne",
    description: "Créez votre page de réservation en 5 minutes.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full bg-white" style={{ colorScheme: "light" }}>
      <body className={`${inter.className} min-h-full flex flex-col bg-white`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
}
