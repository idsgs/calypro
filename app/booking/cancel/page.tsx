"use client"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function BookingCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Paiement annulé</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ton paiement a été annulé. Ta réservation n'a pas été confirmée.
        </p>
        <Link href="/" className="text-sm font-medium text-red-600 hover:text-red-700">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
