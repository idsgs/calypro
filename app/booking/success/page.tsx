"use client"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

function SuccessContent() {
  const params = useSearchParams()
  const bookingId = params.get("booking_id")
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Paiement réussi !</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ta réservation est confirmée et ton paiement a bien été reçu. Un email de confirmation t'a été envoyé.
        </p>
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 underline">
          Créer ma propre page de réservation
        </Link>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return <Suspense><SuccessContent /></Suspense>
}
