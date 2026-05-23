import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendSmsReminder } from "@/lib/sms"
import { sendBookingReminder } from "@/lib/email"
import { addHours } from "date-fns"

// Sécurisé par un secret header (Vercel Cron envoie automatiquement CRON_SECRET)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const now = new Date()
  const in24h = addHours(now, 24)
  const in1h = addHours(now, 1)

  // Fenêtre de 5 minutes pour éviter les doublons
  const window = 5 * 60 * 1000

  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["confirmed", "paid", "pending_payment"] },
      startTime: {
        gte: new Date(now.getTime()),
        lte: new Date(in24h.getTime() + window),
      },
    },
    include: {
      eventType: { include: { user: { select: { name: true } } } },
    },
  })

  let sent = 0
  for (const booking of bookings) {
    const diff = booking.startTime.getTime() - now.getTime()
    const hours = diff / (1000 * 60 * 60)

    // Rappel 24h
    if (hours >= 23.9 && hours <= 24.1) {
      sendBookingReminder({
        guestEmail: booking.guestEmail,
        guestName: booking.guestName,
        hostName: booking.eventType.user.name || "Votre hôte",
        eventName: booking.eventType.name,
        startTime: booking.startTime,
        hoursUntil: 24,
      }).catch(console.error)

      if (booking.guestPhone) {
        sendSmsReminder({
          phone: booking.guestPhone,
          guestName: booking.guestName,
          eventName: booking.eventType.name,
          startTime: booking.startTime,
          hoursUntil: 24,
        }).catch(console.error)
      }
      sent++
    }

    // Rappel 1h
    if (hours >= 0.9 && hours <= 1.1) {
      sendBookingReminder({
        guestEmail: booking.guestEmail,
        guestName: booking.guestName,
        hostName: booking.eventType.user.name || "Votre hôte",
        eventName: booking.eventType.name,
        startTime: booking.startTime,
        hoursUntil: 1,
      }).catch(console.error)

      if (booking.guestPhone) {
        sendSmsReminder({
          phone: booking.guestPhone,
          guestName: booking.guestName,
          eventName: booking.eventType.name,
          startTime: booking.startTime,
          hoursUntil: 1,
        }).catch(console.error)
      }
      sent++
    }
  }

  return NextResponse.json({ sent, checked: bookings.length })
}
