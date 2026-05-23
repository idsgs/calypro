"use client"

import { useState } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import type { EventType } from "@/app/dashboard/page"

interface Props {
  eventType: EventType & { availability?: AvailDay[] }
  onClose: () => void
  onUpdated: (updated: EventType) => void
}

const COLORS = ["blue", "red", "green", "purple", "orange", "pink"]
const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-500", red: "bg-red-500", green: "bg-green-500",
  purple: "bg-purple-500", orange: "bg-orange-500", pink: "bg-pink-500",
}

const DAYS = [
  { label: "Lun", value: 1 },
  { label: "Mar", value: 2 },
  { label: "Mer", value: 3 },
  { label: "Jeu", value: 4 },
  { label: "Ven", value: 5 },
  { label: "Sam", value: 6 },
  { label: "Dim", value: 0 },
]

interface AvailDay {
  day: number
  enabled: boolean
  start: string
  end: string
}

function buildDefaultAvail(existing?: AvailDay[]): AvailDay[] {
  return DAYS.map((d) => {
    const found = existing?.find((a) => a.day === d.value)
    return {
      day: d.value,
      enabled: found ? true : d.value >= 1 && d.value <= 5,
      start: found?.start ?? "09:00",
      end: found?.end ?? "17:00",
    }
  })
}

export default function EditEventTypeModal({ eventType, onClose, onUpdated }: Props) {
  const [name, setName] = useState(eventType.name)
  const [duration, setDuration] = useState(eventType.duration)
  const [price, setPrice] = useState(eventType.price ? (eventType.price / 100).toString() : "")
  const [color, setColor] = useState(eventType.color)
  const [availability, setAvailability] = useState<AvailDay[]>(buildDefaultAvail(eventType.availability))
  const [showAvail, setShowAvail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function toggleDay(day: number) {
    setAvailability((prev) => prev.map((a) => (a.day === day ? { ...a, enabled: !a.enabled } : a)))
  }

  function updateTime(day: number, field: "start" | "end", value: string) {
    setAvailability((prev) => prev.map((a) => (a.day === day ? { ...a, [field]: value } : a)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    const availPayload = availability
      .filter((a) => a.enabled)
      .map((a) => ({ dayOfWeek: a.day, startTime: a.start, endTime: a.end }))

    const res = await fetch(`/api/event-types/${eventType.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        duration,
        price: price ? Math.round(parseFloat(price) * 100) : null,
        color,
        availability: availPayload,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      onUpdated({ ...eventType, name, duration, price: data.price, color })
    } else {
      const data = await res.json()
      setError(data.error?.message || "Erreur lors de la mise à jour")
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900">Modifier l'événement</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {[15, 20, 30, 45, 60, 90, 120].map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input
                type="number" step="0.01" min="0" value={price}
                onChange={(e) => setPrice(e.target.value)} placeholder="0 = gratuit"
                className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full ${COLOR_CLASSES[c]} ${color === c ? "ring-2 ring-offset-2 ring-gray-400" : ""} transition-all`}
                />
              ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <button type="button" onClick={() => setShowAvail(!showAvail)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>Horaires de disponibilité</span>
              {showAvail ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {showAvail && (
              <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                {DAYS.map((d) => {
                  const avail = availability.find((a) => a.day === d.value)!
                  return (
                    <div key={d.value} className="flex items-center gap-3">
                      <button type="button" onClick={() => toggleDay(d.value)}
                        className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${avail.enabled ? "bg-red-600" : "bg-gray-200"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${avail.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                      <span className={`text-xs font-medium min-w-[2.5rem] ${avail.enabled ? "text-gray-700" : "text-gray-400"}`}>{d.label}</span>
                      {avail.enabled && (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input type="time" value={avail.start} onChange={(e) => updateTime(d.value, "start", e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                          <span className="text-xs text-gray-400">—</span>
                          <input type="time" value={avail.end} onChange={(e) => updateTime(d.value, "end", e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                      )}
                      {!avail.enabled && <span className="text-xs text-gray-300 flex-1">Indisponible</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors">
              {saving ? "Sauvegarde…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
