"use client"

import { useState } from "react"
import { format, addMinutes } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, CreditCard, Banknote } from "lucide-react"

interface CustomField {
  id: string
  label: string
  type: string
  required: boolean
  options: string | null
}

interface Props {
  eventTypeId: string
  eventName?: string
  startTime: string
  duration: number
  price: number | null
  customFields: CustomField[]
  onBack: () => void
  onSuccess: (booking: { id: string; guestName: string; startTime: string; paymentMethod?: string }) => void
}

export default function BookingForm({
  eventTypeId, eventName, startTime, duration, price, customFields, onBack, onSuccess,
}: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [customValues, setCustomValues] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<"stripe" | "manual" | null>(null)
  const [error, setError] = useState("")

  const start = new Date(startTime)
  const end = addMinutes(start, duration)
  const hasPaidOption = price !== null && price > 0

  async function submit(paymentMethod: "stripe" | "manual") {
    setError("")
    setSubmitting(paymentMethod)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTypeId,
          guestName: name,
          guestEmail: email,
          guestPhone: phone || undefined,
          startTime,
          notes: notes || undefined,
          customFields: Object.keys(customValues).length ? customValues : undefined,
          paymentMethod,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        // Stripe Checkout → redirect
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl
          return
        }
        onSuccess({ id: data.booking?.id || data.id, guestName: name, startTime, paymentMethod })
        return
      }

      let errorMsg = "Une erreur est survenue"
      try {
        const data = await res.json()
        if (typeof data.error === "string") errorMsg = data.error
      } catch {}
      setError(errorMsg)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible de contacter le serveur.")
    } finally {
      setSubmitting(null)
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header résumé */}
      <div className="px-5 py-4 border-b border-gray-100">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" /> Choisir un autre créneau
        </button>
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">
            {eventName && <span>{eventName} · </span>}
            <span className="capitalize">
              {format(start, "EEEE d MMMM", { locale: fr })} à {format(start, "HH:mm")}
            </span>
            {" "}—{" "}
            {format(end, "HH:mm")}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {duration} min
            {hasPaidOption ? ` · ${(price! / 100).toFixed(0)}€` : " · Gratuit"}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Nom complet *</label>
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Jean Dupont"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="jean@exemple.fr"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Téléphone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Champs custom */}
        {customFields.map((field) => (
          <div key={field.id}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {field.label}{field.required && " *"}
            </label>
            {field.type === "textarea" ? (
              <textarea required={field.required} value={customValues[field.id] || ""}
                onChange={(e) => setCustomValues({ ...customValues, [field.id]: e.target.value })}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            ) : field.type === "select" && field.options ? (
              <select required={field.required} value={customValues[field.id] || ""}
                onChange={(e) => setCustomValues({ ...customValues, [field.id]: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Sélectionner…</option>
                {JSON.parse(field.options).map((opt: string) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input required={field.required} type={field.type === "email" ? "email" : "text"}
                value={customValues[field.id] || ""}
                onChange={(e) => setCustomValues({ ...customValues, [field.id]: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>
        ))}

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Notes (optionnel)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            placeholder="Informations supplémentaires…"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        {/* Boutons paiement */}
        {!name || !email ? (
          <button
            type="button"
            disabled
            className="w-full bg-red-600 opacity-40 text-white font-semibold py-3.5 rounded-full text-sm"
          >
            Remplissez les champs obligatoires
          </button>
        ) : hasPaidOption ? (
          <div className="space-y-2.5">
            <button
              onClick={() => submit("stripe")}
              disabled={!!submitting}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-full text-sm transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              {submitting === "stripe" ? "Redirection…" : `Payer ${(price! / 100).toFixed(0)}€ par carte`}
            </button>
            <button
              onClick={() => submit("manual")}
              disabled={!!submitting}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-semibold py-3.5 rounded-full text-sm border border-gray-200 transition-colors"
            >
              <Banknote className="w-4 h-4" />
              {submitting === "manual" ? "Réservation…" : "Réserver · Payer à la séance"}
            </button>
            <p className="text-xs text-center text-gray-400">
              Le paiement à la séance sera confirmé par l'hôte.
            </p>
          </div>
        ) : (
          <button
            onClick={() => submit("manual")}
            disabled={!!submitting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-full text-sm transition-colors"
          >
            {submitting ? "Réservation…" : "Confirmer la réservation"}
          </button>
        )}
      </div>
    </div>
  )
}
