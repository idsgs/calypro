"use client"

import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { Plus, Settings } from "lucide-react"
import Link from "next/link"
import Sidebar from "@/components/dashboard/Sidebar"
import BookingsCalendar from "@/components/dashboard/BookingsCalendar"
import UpcomingBookings from "@/components/dashboard/UpcomingBookings"
import StatsBar from "@/components/dashboard/StatsBar"
import CreateEventTypeModal from "@/components/dashboard/CreateEventTypeModal"

export interface EventType {
  id: string
  name: string
  slug: string
  duration: number
  price: number | null
  color: string
  isActive: boolean
}

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-500", red: "bg-red-500", green: "bg-green-500",
  purple: "bg-purple-500", orange: "bg-orange-500", pink: "bg-pink-500",
}

function DashboardInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [eventTypes, setEventTypes] = useState<EventType[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"calendar" | "bookings">("calendar")
  const [showMobileModal, setShowMobileModal] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  // Lit ?tab=bookings depuis l'URL
  useEffect(() => {
    if (searchParams.get("tab") === "bookings") setActiveTab("bookings")
  }, [searchParams])

  function copyBookingLink() {
    if (!username) return
    navigator.clipboard.writeText(`${window.location.origin}/${username}`)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin")
  }, [status, router])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch("/api/event-types").then((r) => r.json()).then(setEventTypes)
    fetch("/api/user").then((r) => r.json()).then((u) => setUsername(u.username))
  }, [session])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="flex bg-gray-50 min-h-[calc(100vh-56px)]">
      {/* Desktop sidebar */}
      <Sidebar eventTypes={eventTypes} username={username} onEventTypesChange={setEventTypes} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">

        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-gray-900">
              Bonjour, {session.user?.name?.split(" ")[0]}
            </p>
            {!username && (
              <Link href="/dashboard/settings" className="text-xs text-amber-600 underline">
                Configurer mon lien de réservation
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/settings" className="p-2 text-gray-400 hover:text-gray-700">
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setShowMobileModal(true)}
              className="flex items-center gap-1.5 bg-red-600 text-white text-sm font-semibold px-3 py-2 rounded-xl"
            >
              <Plus className="w-4 h-4" />
              Nouveau
            </button>
          </div>
        </div>

        {/* Mobile events horizontal scroll */}
        {eventTypes.length > 0 && (
          <div className="md:hidden px-4 pt-3 pb-1">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {eventTypes.map((et) => (
                <div key={et.id} className="flex-shrink-0 flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2">
                  <div className={`w-2 h-2 rounded-full ${COLOR_MAP[et.color] || "bg-gray-400"}`} />
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{et.name}</span>
                  <span className="text-xs text-gray-400">{et.duration}min</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop header + tabs */}
        <div className="hidden md:block max-w-5xl mx-auto px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Bonjour, {session.user?.name?.split(" ")[0]}
              </h1>
              {!username && (
                <p className="text-sm text-amber-600 mt-1">
                  Configurez votre nom d'utilisateur pour partager votre lien.{" "}
                  <Link href="/dashboard/settings" className="underline">Paramètres</Link>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "calendar"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Calendrier
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "bookings"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Réservations
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 pb-6 space-y-4 md:space-y-6">
          {/* Mobile tabs */}
          <div className="md:hidden flex gap-2 pt-3">
            <button
              onClick={() => setActiveTab("calendar")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "calendar"
                  ? "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  : "text-gray-500 bg-transparent"
              }`}
            >
              Calendrier
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === "bookings"
                  ? "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  : "text-gray-500 bg-transparent"
              }`}
            >
              Réservations
            </button>
          </div>

          {/* Lien de réservation public */}
          {username ? (
            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Ton lien de réservation</p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {typeof window !== "undefined" ? window.location.origin : "https://localhost:3000"}/{username}
                </p>
              </div>
              <button
                onClick={copyBookingLink}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  copiedLink
                    ? "bg-green-100 text-green-700"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {copiedLink ? "Copié !" : "Copier"}
              </button>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center justify-between gap-3">
              <p className="text-sm text-amber-700">
                Configure ton nom d'utilisateur pour obtenir ton lien de réservation.
              </p>
              <Link href="/dashboard/settings" className="flex-shrink-0 text-sm font-semibold text-amber-700 underline">
                Configurer
              </Link>
            </div>
          )}

          <StatsBar />

          {activeTab === "calendar" ? (
            <BookingsCalendar eventTypes={eventTypes} />
          ) : (
            <UpcomingBookings />
          )}
        </div>
      </main>

      {/* Mobile create modal */}
      {showMobileModal && (
        <CreateEventTypeModal
          onClose={() => setShowMobileModal(false)}
          onCreated={(newType) => {
            setEventTypes([newType, ...eventTypes])
            setShowMobileModal(false)
          }}
        />
      )}
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardInner />
    </Suspense>
  )
}
