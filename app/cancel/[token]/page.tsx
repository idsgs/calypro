"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { XCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface BookingInfo {
  id: string
  eventName: string
  guestName: string
  startTime: string
  status: string
}

export default function CancelPage() {
  const { token } = useParams<{ token: string }>()
  const [booking, setBooking] = useState<BookingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelled, setCancelled] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetch(`/api/cancel/${token}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setBooking)
      .finally(() => setLoading(false))
  }, [token])

  async function handleCancel() {
    setCancelling(true)
    const res = await fetch(`/api/cancel/${token}`, { method: "POST" })
    if (res.ok) setCancelled(true)
    setCancelling(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Lien invalide</h1>
          <p className="text-gray-500">Ce lien d'annulation n'existe pas.</p>
        </div>
      </div>
    )
  }

  if (cancelled || booking.status === "cancelled") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Réservation annulée</h1>
          <p className="text-gray-500">Votre rendez-vous a bien été annulé.</p>
          <Link href="/" className="mt-6 inline-block text-sm text-red-600 hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Annuler votre réservation ?</h1>
        <p className="text-gray-500 mb-2">
          <strong>{booking.eventName}</strong>
        </p>
        <p className="text-sm text-gray-400 mb-6 capitalize">
          {format(new Date(booking.startTime), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
        </p>

        <div className="flex gap-3">
          <Link
            href="/"
            className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Garder le RDV
          </Link>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {cancelling ? "Annulation…" : "Confirmer l'annulation"}
          </button>
        </div>
      </div>
    </div>
  )
}
