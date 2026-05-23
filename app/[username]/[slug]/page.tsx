"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Clock, Euro, User, CheckCircle } from "lucide-react"
import BookingCalendar from "@/components/booking/BookingCalendar"
import BookingForm from "@/components/booking/BookingForm"
import BookingSuccess from "@/components/booking/BookingSuccess"

interface EventTypePublic {
  id: string
  name: string
  description: string | null
  duration: number
  price: number | null
  color: string
  hostName: string | null
  hostImage: string | null
  customFields: CustomField[]
}

interface CustomField {
  id: string
  label: string
  type: string
  required: boolean
  options: string | null
}

const STEPS = [
  { id: "calendar", label: "Choisir une date" },
  { id: "form", label: "Mes informations" },
  { id: "success", label: "Confirmation" },
]

export default function BookingPage() {
  const { username, slug } = useParams<{ username: string; slug: string }>()
  const [eventType, setEventType] = useState<EventTypePublic | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [booking, setBooking] = useState<{ id: string; guestName: string; startTime: string; paymentMethod?: string } | null>(null)
  const [step, setStep] = useState<"calendar" | "form" | "success">("calendar")

  useEffect(() => {
    fetch(`/api/public/${username}/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setEventType)
      .finally(() => setLoading(false))
  }, [username, slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!eventType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Page introuvable</h1>
          <p className="text-gray-500 text-sm">Ce lien de réservation n'existe pas ou a été désactivé.</p>
        </div>
      </div>
    )
  }

  if (step === "success" && booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BookingSuccess
          eventName={eventType.name}
          guestName={booking.guestName}
          startTime={new Date(booking.startTime)}
          duration={eventType.duration}
          hostName={eventType.hostName}
          paymentMethod={booking.paymentMethod}
        />
      </div>
    )
  }

  const stepIndex = step === "calendar" ? 0 : step === "form" ? 1 : 2

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-8">

        {/* Infos événement */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3 mb-3">
            {eventType.hostImage ? (
              <img src={eventType.hostImage} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-red-600" />
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400">{eventType.hostName}</p>
              <h1 className="text-base font-bold text-gray-900">{eventType.name}</h1>
            </div>
          </div>
          {eventType.description && (
            <p className="text-sm text-gray-500 mb-3">{eventType.description}</p>
          )}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5" />
              {eventType.duration} min
            </span>
            {eventType.price !== null && eventType.price > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Euro className="w-3.5 h-3.5" />
                {(eventType.price / 100).toFixed(0)}€
              </span>
            )}
            {(!eventType.price || eventType.price === 0) && (
              <span className="text-xs text-green-600 font-medium">Gratuit</span>
            )}
          </div>
        </div>

        {/* Indicateur d'étapes */}
        {step !== "success" && (
          <div className="flex items-center mb-5">
            {STEPS.slice(0, 2).map((s, i) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    i < stepIndex
                      ? "bg-green-500 text-white"
                      : i === stepIndex
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}>
                    {i < stepIndex ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === stepIndex ? "text-gray-900" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < 1 && (
                  <div className={`flex-1 h-px mx-3 ${i < stepIndex ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contenu de l'étape */}
        {step === "calendar" && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Choisissez une date et un horaire</p>
            <BookingCalendar
              username={username}
              slug={slug}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot)
                setStep("form")
              }}
            />
          </div>
        )}

        {step === "form" && selectedSlot && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Vos informations</p>
            <BookingForm
              eventTypeId={eventType.id}
              eventName={eventType.name}
              startTime={selectedSlot}
              duration={eventType.duration}
              price={eventType.price}
              customFields={eventType.customFields}
              onBack={() => setStep("calendar")}
              onSuccess={(b) => {
                setBooking(b)
                setStep("success")
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
