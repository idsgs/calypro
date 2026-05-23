import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { stripe } from "@/lib/stripe"
import { sendBookingConfirmation, sendHostNotification } from "@/lib/email"
import { addMinutes } from "date-fns"
import { z } from "zod"

const bookingSchema = z.object({
  eventTypeId: z.string(),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().optional(),
  startTime: z.string(),
  customFields: z.record(z.string(), z.string()).optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["stripe", "manual"]).default("manual"),
})

export async function POST(req: NextRequest) {
  try {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 })
  }
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { eventTypeId, guestName, guestEmail, guestPhone, startTime, customFields, notes, paymentMethod } =
    parsed.data

  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    include: { user: { select: { id: true, name: true, email: true } } },
  })
  if (!eventType)
    return NextResponse.json({ error: "Événement introuvable" }, { status: 404 })

  const start = new Date(startTime)
  const end = addMinutes(start, eventType.duration)

  // Prevent double-booking
  const conflict = await prisma.booking.findFirst({
    where: {
      eventTypeId,
      status: { not: "cancelled" },
      OR: [
        { startTime: { gte: start, lt: end } },
        { endTime: { gt: start, lte: end } },
        { startTime: { lte: start }, endTime: { gte: end } },
      ],
    },
  })
  if (conflict)
    return NextResponse.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 })

  const booking = await prisma.booking.create({
    data: {
      eventTypeId,
      guestName,
      guestEmail,
      guestPhone,
      startTime: start,
      endTime: end,
      customFields: customFields ? (customFields as Record<string, string>) : undefined,
      notes,
    },
  })

  // Stripe Checkout Session
  if (eventType.price && eventType.price > 0 && paymentMethod === "stripe") {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: eventType.name },
          unit_amount: eventType.price,
        },
        quantity: 1,
      }],
      mode: "payment",
      customer_email: guestEmail,
      success_url: `${baseUrl}/booking/success?booking_id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/cancel?booking_id=${booking.id}`,
      metadata: { bookingId: booking.id },
    })

    await prisma.paymentIntent.create({
      data: {
        bookingId: booking.id,
        stripePaymentId: session.id,
        amount: eventType.price,
      },
    })

    return NextResponse.json({ booking, checkoutUrl: session.url }, { status: 201 })
  }

  // Paiement manuel avec prix : statut "pending_payment"
  if (eventType.price && eventType.price > 0 && paymentMethod === "manual") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "pending_payment" },
    })
  }

  // Fire-and-forget emails (don't block the response)
  sendBookingConfirmation({
    guestEmail,
    guestName,
    hostName: eventType.user.name || "Votre hôte",
    eventName: eventType.name,
    startTime: start,
    duration: eventType.duration,
    cancelToken: booking.cancelToken!,
  }).catch(console.error)

  if (eventType.user.email) {
    sendHostNotification({
      hostEmail: eventType.user.email,
      hostName: eventType.user.name || "Vous",
      guestName,
      guestEmail,
      guestPhone,
      eventName: eventType.name,
      startTime: start,
      duration: eventType.duration,
      paymentMethod,
      price: eventType.price,
    }).catch(console.error)
  }

  return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    console.error("[POST /api/bookings]", err)
    const msg = err instanceof Error ? err.message : "Erreur interne"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  const bookings = await prisma.booking.findMany({
    where: {
      eventType: { userId: session.user.id },
      ...(status ? { status } : {}),
      ...(from || to
        ? {
            startTime: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {}),
            },
          }
        : {}),
    },
    include: { eventType: { select: { name: true, color: true } }, payment: true },
    orderBy: { startTime: "asc" },
  })

  return NextResponse.json(bookings)
}
