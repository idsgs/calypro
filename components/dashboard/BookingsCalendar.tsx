"use client"

import { useEffect, useState } from "react"
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, addMonths, subMonths,
} from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, ChevronRight, RefreshCw, User, Clock } from "lucide-react"
import type { EventType } from "@/app/dashboard/page"

interface Booking {
  id: string
  guestName: string
  guestEmail: string
  startTime: string
  endTime: string
  status: string
  eventType: { name: string; color: string }
}

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmé", cls: "bg-blue-100 text-blue-700" },
  paid: { label: "Payé", cls: "bg-green-100 text-green-700" },
  pending_payment: { label: "Paiement sur place", cls: "bg-amber-100 text-amber-700" },
  cancelled: { label: "Annulé", cls: "bg-gray-100 text-gray-500" },
  "no-show": { label: "No-show", cls: "bg-red-100 text-red-700" },
}

const DOT_COLOR: Record<string, string> = {
  blue: "bg-blue-500", red: "bg-red-500", green: "bg-green-500",
  purple: "bg-purple-500", orange: "bg-orange-500", pink: "bg-pink-500",
}

export default function BookingsCalendar({ eventTypes }: { eventTypes: EventType[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selected, setSelected] = useState<Date | null>(new Date())
  const [loading, setLoading] = useState(false)

  function load(month: Date) {
    setLoading(true)
    const from = startOfMonth(month).toISOString()
    const to = endOfMonth(month).toISOString()
    fetch(`/api/bookings?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setBookings(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(currentMonth) }, [currentMonth])

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })
  const firstDayOffset = (startOfMonth(currentMonth).getDay() + 6) % 7

  const selectedBookings = selected
    ? bookings.filter((b) => isSameDay(new Date(b.startTime), selected))
    : []

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 capitalize">
            {format(currentMonth, "MMMM yyyy", { locale: fr })}
          </h2>
          <button onClick={() => load(currentMonth)} className="p-1 text-gray-400 hover:text-gray-600" title="Rafraîchir">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={() => { const now = new Date(); setCurrentMonth(now); setSelected(now) }}
            className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
            Aujourd'hui
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Jours de la semaine */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-400 py-2 border-b border-gray-100">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-14 border-b border-r border-gray-50" />
        ))}
        {days.map((day) => {
          const dayBookings = bookings.filter((b) => isSameDay(new Date(b.startTime), day))
          const isSelected = selected && isSameDay(day, selected)
          const hasPending = dayBookings.some((b) => b.status === "pending_payment")

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelected(day)}
              className={`h-14 border-b border-r border-gray-50 flex flex-col items-center pt-1.5 text-sm transition-colors relative ${
                isSelected ? "bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                isToday(day) ? "bg-red-600 text-white"
                  : isSelected ? "text-red-600 font-bold"
                  : "text-gray-700"
              }`}>
                {format(day, "d")}
              </span>

              {/* Indicateurs de réservations */}
              {dayBookings.length > 0 && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  {dayBookings.slice(0, 3).map((b, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${
                      b.status === "pending_payment" ? "bg-amber-400"
                        : b.status === "paid" ? "bg-green-500"
                        : b.status === "cancelled" ? "bg-gray-300"
                        : DOT_COLOR[b.eventType.color] || "bg-gray-400"
                    }`} />
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="text-xs text-gray-400 ml-0.5">+{dayBookings.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Réservations du jour sélectionné */}
      {selected && (
        <div className="border-t border-gray-100 px-4 md:px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 capitalize">
            {format(selected, "EEEE d MMMM", { locale: fr })}
            {selectedBookings.length > 0 && (
              <span className="ml-2 text-xs font-normal text-gray-400">
                {selectedBookings.length} réservation{selectedBookings.length > 1 ? "s" : ""}
              </span>
            )}
          </h3>

          {selectedBookings.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune réservation ce jour.</p>
          ) : (
            <div className="space-y-2.5">
              {selectedBookings.map((b) => {
                const statusInfo = STATUS_BADGE[b.status] || STATUS_BADGE.confirmed
                return (
                  <div key={b.id} className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start gap-3">
                    <div className="w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">{b.guestName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.cls}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{b.guestEmail}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          {format(new Date(b.startTime), "HH:mm")} — {format(new Date(b.endTime), "HH:mm")}
                        </span>
                        <span className="text-gray-300">·</span>
                        <span>{b.eventType.name}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
