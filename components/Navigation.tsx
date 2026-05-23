"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { Calendar, LogOut, Settings, User, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { smoothScrollTo } from "@/lib/smoothScroll"

const navLinks = [
  { label: "Fonctionnalités", id: "fonctionnalites" },
  { label: "Tarifs", id: "tarifs" },
  { label: "Garanties", id: "temoignages" },
  { label: "FAQ", id: "faq" },
]

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  // Contextes de navigation
  const isLanding = pathname === "/"
  const isDashboard = pathname.startsWith("/dashboard")
  const isAuthPage = pathname.startsWith("/auth")
  // Pages publiques client : /[username], /[username]/[slug], /cancel/[token]
  const isPublicClientPage = !isLanding && !isDashboard && !isAuthPage

  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userMenuOpen) return
    function handler(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [userMenuOpen])

  useEffect(() => {
    if (drawerOpen) {
      const scrollY = window.scrollY
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.overflow = "hidden"
    } else {
      const top = document.body.style.top
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.overflow = ""
      if (top) window.scrollTo(0, -parseInt(top))
    }
    return () => {
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.overflow = ""
    }
  }, [drawerOpen])

  function handleNavClick(e: React.MouseEvent, id: string) {
    e.preventDefault()
    setDrawerOpen(false)
    if (isLanding) smoothScrollTo(id)
    else router.push(`/#${id}`)
  }

  // ── Pages publiques client : uniquement le logo ──────────────────────────
  if (isPublicClientPage) {
    return (
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-base">
            <Calendar className="w-4 h-4 text-red-600" />
            Cal.pro
          </Link>
        </div>
      </nav>
    )
  }

  // ── Pages auth : uniquement le logo ──────────────────────────────────────
  if (isAuthPage) {
    return (
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg">
            <Calendar className="w-5 h-5 text-red-600" />
            Cal.pro
          </Link>
        </div>
      </nav>
    )
  }

  // ── Dashboard : logo + liens dashboard + menu utilisateur ────────────────
  if (isDashboard) {
    return (
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg flex-shrink-0">
            <Calendar className="w-5 h-5 text-red-600" />
            Cal.pro
          </Link>

          {session && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-red-600" />
                  </div>
                )}
                <span className="hidden sm:inline text-sm">{session.user?.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                    <Calendar className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                    <Settings className="w-4 h-4" /> Paramètres
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    )
  }

  // ── Landing page : nav publique (jamais de session) ───────────────────────
  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="relative h-14 flex items-center px-10">
          {/* Logo — gauche */}
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg flex-shrink-0">
            <Calendar className="w-5 h-5 text-red-600" />
            Cal.pro
          </Link>

          {/* Liens — position absolue au centre exact */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Boutons — droite */}
          <div className="ml-auto flex items-center gap-3">
            <Link href="/auth/signin" className="hidden md:block text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
              Connexion
            </Link>
            <Link href="/auth/signin" className="hidden md:block bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Commencer
            </Link>
            <button
              className="md:hidden flex flex-col gap-[5px] p-3 -mr-2 touch-manipulation"
              onClick={() => setDrawerOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <span className="w-5 h-0.5 bg-gray-700 block rounded" />
              <span className="w-5 h-0.5 bg-gray-700 block rounded" />
              <span className="w-5 h-0.5 bg-gray-700 block rounded" />
            </button>
          </div>
        </div>
      </nav>

      {drawerOpen && (
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "56px", borderBottom: "1px solid #f3f4f6", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "#111827", fontSize: "1.125rem" }}>
              <Calendar style={{ width: 20, height: 20, color: "#dc2626" }} />Cal.pro
            </div>
            <button onClick={() => setDrawerOpen(false)} style={{ padding: 12, color: "#9ca3af", touchAction: "manipulation" }}>
              <X style={{ width: 20, height: 20 }} />
            </button>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", padding: "16px 24px 0", flex: 1 }}>
            {navLinks.map((link) => (
              <a key={link.id} href={`#${link.id}`} onClick={(e) => handleNavClick(e, link.id)}
                style={{ padding: "16px 0", fontSize: "1.125rem", fontWeight: 500, color: "#374151", borderBottom: "1px solid #f3f4f6", textDecoration: "none" }}>
                {link.label}
              </a>
            ))}
          </nav>
          <div style={{ padding: "16px 24px 48px", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
            <Link href="/auth/signin" onClick={() => setDrawerOpen(false)} style={{ width: "100%", textAlign: "center", padding: "14px 0", fontSize: "0.875rem", fontWeight: 500, color: "#4b5563", border: "1px solid #e5e7eb", borderRadius: 999, textDecoration: "none", display: "block" }}>Connexion</Link>
            <Link href="/auth/signin" onClick={() => setDrawerOpen(false)} style={{ width: "100%", textAlign: "center", padding: "14px 0", fontSize: "0.875rem", fontWeight: 700, color: "white", backgroundColor: "#dc2626", borderRadius: 999, textDecoration: "none", display: "block" }}>Commencer gratuitement</Link>
          </div>
        </div>
      )}
    </>
  )
}
