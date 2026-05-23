import { format, addMinutes } from "date-fns"
import { fr } from "date-fns/locale"
import { CheckCircle, Clock, Calendar, Banknote } from "lucide-react"
import Link from "next/link"

interface Props {
  eventName: string
  guestName: string
  startTime: Date
  duration: number
  hostName: string | null
  paymentMethod?: string
}

export default function BookingSuccess({
  eventName, guestName, startTime, duration, hostName, paymentMethod,
}: Props) {
  const end = addMinutes(startTime, duration)
  const isManual = paymentMethod === "manual"

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 max-w-sm w-full text-center">

        {/* Icône */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${isManual ? "bg-blue-50" : "bg-green-50"}`}>
          {isManual
            ? <Banknote className="w-8 h-8 text-blue-600" />
            : <CheckCircle className="w-8 h-8 text-green-600" />
          }
        </div>

        {/* Titre */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          {isManual ? "Réservation enregistrée !" : "Réservation confirmée !"}
        </h1>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {isManual
            ? "Ta réservation est bien enregistrée. Le paiement se fera directement sur place le jour du rendez-vous."
            : "Ta réservation est confirmée. Un email de confirmation t'a été envoyé."}
        </p>

        {/* Résumé */}
        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900">{eventName}</p>
              {hostName && <p className="text-xs text-gray-400">avec {hostName}</p>}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {format(startTime, "EEEE d MMMM yyyy", { locale: fr })}
              </p>
              <p className="text-xs text-gray-400">
                {format(startTime, "HH:mm")} — {format(end, "HH:mm")} · {duration} min
              </p>
            </div>
          </div>
        </div>

        {/* Message paiement sur place */}
        {isManual && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-left">
            <p className="text-xs font-semibold text-blue-700 mb-0.5">Paiement sur place</p>
            <p className="text-xs text-blue-600">
              Pense à prévoir le montant exact le jour du rendez-vous. Tu peux annuler à tout moment via le lien dans l'email.
            </p>
          </div>
        )}

        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 underline">
          Créer ma propre page de réservation
        </Link>
      </div>
    </div>
  )
}
