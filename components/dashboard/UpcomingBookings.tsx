"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { User, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface Booking {
  id: string
  guestName: string
  guestEmail: string
  guestPhone: string | null
  startTime: string
  endTime: string
  status: string
  notes: string | null
  eventType: { name: string; color: string }
  payment: { amount: number; status: string } | null
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmé", cls: "bg-blue-50 text-blue-700 border border-blue-100" },
  paid: { label: "Payé", cls: "bg-green-50 text-green-700 border border-green-100" },
  pending_payment: { label: "En attente de paiement", cls: "bg-amber-50 text-amber-700 border border-amber-100" },
  cancelled: { label: "Annulé", cls: "bg-gray-100 text-gray-500 border border-gray-200" },
  "no-show": { label: "No-show", cls: "bg-red-50 text-red-700 border border-red-100" },
}

export default function UpcomingBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending_payment">("all")

  function load() {
    setLoading(true)
    // Récupère toutes les réservations (passées et futures)
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setBookings(data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  async function markPaid(id: string) {
    await fetch(`/api/bookings/${id}/mark-paid`, { method: "POST" })
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "paid" } : b)))
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
  }

  const filtered = filter === "pending_payment"
    ? bookings.filter((b) => b.status === "pending_payment")
    : bookings

  const pendingCount = bookings.filter((b) => b.status === "pending_payment").length

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header + filtres */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-900 text-sm md:text-base">Réservations</h2>
          <button onClick={load} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Rafraîchir">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === "all" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter("pending_payment")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              filter === "pending_payment" ? "bg-amber-600 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            En attente
            {pendingCount > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${filter === "pending_payment" ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-700"}`}>
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="px-5 py-12 text-center text-gray-400 text-sm">
          {filter === "pending_payment" ? "Aucun paiement en attente." : "Aucune réservation à venir."}
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {filtered.map((b) => {
            const s = STATUS_LABELS[b.status] || STATUS_LABELS.confirmed
            const isPending = b.status === "pending_payment"
            return (
              <div key={b.id} className="px-4 md:px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-gray-900">{b.guestName}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>
                        {s.label}
                      </span>
                      {b.payment && (
                        <span className="text-xs text-gray-400 font-medium">
                          {(b.payment.amount / 100).toFixed(0)}€
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{b.guestEmail}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span className="capitalize">
                        {format(new Date(b.startTime), "EEE d MMM, HH:mm", { locale: fr })} — {format(new Date(b.endTime), "HH:mm")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{b.eventType.name}</p>

                    {/* Actions paiement en attente */}
                    {isPending && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => markPaid(b.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Marquer payé
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, "cancelled")}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-lg transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Annuler
                        </button>
                      </div>
                    )}
                    {!isPending && b.status !== "cancelled" && b.status !== "paid" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => updateStatus(b.id, "no-show")}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <AlertCircle className="w-3 h-3" />
                          No-show
                        </button>
                        <button
                          onClick={() => updateStatus(b.id, "cancelled")}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle className="w-3 h-3" />
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
