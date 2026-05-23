import { prisma } from "@/lib/prisma"
import { addMinutes, format, parseISO, isAfter, isBefore, setHours, setMinutes, startOfDay } from "date-fns"

export interface TimeSlot {
  start: string
  end: string
  available: boolean
}

export async function getAvailableSlots(
  eventTypeId: string,
  date: string
): Promise<TimeSlot[]> {
  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    include: { availability: true },
  })
  if (!eventType) return []

  const targetDate = parseISO(date)
  const dayOfWeek = targetDate.getDay()

  const dayAvailability = eventType.availability.find(
    (a) => a.dayOfWeek === dayOfWeek
  )
  if (!dayAvailability) return []

  const [startHour, startMin] = dayAvailability.startTime.split(":").map(Number)
  const [endHour, endMin] = dayAvailability.endTime.split(":").map(Number)

  const dayStart = setMinutes(setHours(startOfDay(targetDate), startHour), startMin)
  const dayEnd = setMinutes(setHours(startOfDay(targetDate), endHour), endMin)

  // Fetch existing bookings for this day
  const existingBookings = await prisma.booking.findMany({
    where: {
      eventTypeId,
      status: { not: "cancelled" },
      startTime: {
        gte: dayStart,
        lt: dayEnd,
      },
    },
  })

  const slots: TimeSlot[] = []
  const slotDuration = eventType.duration + eventType.bufferAfter

  let current = dayStart
  while (isBefore(addMinutes(current, eventType.duration), dayEnd) ||
         format(addMinutes(current, eventType.duration), "HH:mm") === format(dayEnd, "HH:mm")) {
    const slotEnd = addMinutes(current, eventType.duration)

    const isBooked = existingBookings.some((booking) => {
      const bStart = booking.startTime
      const bEnd = booking.endTime
      return (
        (isAfter(current, bStart) || format(current, "HH:mm") === format(bStart, "HH:mm")) &&
        isBefore(current, bEnd)
      )
    })

    const isPast = isBefore(current, new Date())

    slots.push({
      start: current.toISOString(),
      end: slotEnd.toISOString(),
      available: !isBooked && !isPast,
    })

    current = addMinutes(current, slotDuration)

    if (!isBefore(current, dayEnd)) break
  }

  return slots
}
