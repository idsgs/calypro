"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  isBefore,
  startOfDay,
} from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slot {
  start: string
  end: string
  available: boolean
}

interface Props {
  username: string
  slug: string
  onSelectSlot: (start: string) => void
}

export default function BookingCalendar({ username, slug, onSelectSlot }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })
  const firstDayOffset = (startOfMonth(currentMonth).getDay() + 6) % 7

  async function loadSlots(date: Date) {
    setSelectedDate(date)
    setLoadingSlots(true)
    const dateStr = format(date, "yyyy-MM-dd")
    const res = await fetch(`/api/public/${username}/${slug}/slots?date=${dateStr}`)
    const data = await res.json()
    setSlots(Array.isArray(data) ? data : [])
    setLoadingSlots(false)
  }

  const availableSlots = slots.filter((s) => s.available)

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            disabled={isBefore(endOfMonth(subMonths(currentMonth, 1)), startOfDay(new Date()))}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-400 py-2 border-b border-gray-100">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 p-2 gap-1">
        {Array.from({ length: firstDayOffset }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {days.map((day) => {
          const isPast = isBefore(day, startOfDay(new Date()))
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          return (
            <button
              key={day.toISOString()}
              disabled={isPast}
              onClick={() => loadSlots(day)}
              className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? "bg-red-600 text-white"
                  : isToday(day)
                  ? "border border-red-400 text-red-600"
                  : isPast
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-red-50"
              }`}
            >
              {format(day, "d")}
            </button>
          )
        })}
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div className="border-t border-gray-100 px-5 py-4">
          <p className="text-sm font-semibold text-gray-700 mb-3 capitalize">
            {format(selectedDate, "EEEE d MMMM", { locale: fr })}
          </p>
          {loadingSlots ? (
            <div className="flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : availableSlots.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              Aucun créneau disponible ce jour.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.start}
                  onClick={() => onSelectSlot(slot.start)}
                  className="py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                >
                  {format(new Date(slot.start), "HH:mm")}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
