import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { sendBookingConfirmation } from "@/lib/email"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") || ""

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch {
    return NextResponse.json({ error: "Webhook invalide" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object
    const bookingId = session.metadata?.bookingId
    if (!bookingId) return NextResponse.json({ received: true })

    await prisma.paymentIntent.update({
      where: { stripePaymentId: session.id },
      data: { status: "succeeded" },
    })

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "paid" },
      include: { eventType: { include: { user: { select: { name: true } } } } },
    })

    sendBookingConfirmation({
      guestEmail: booking.guestEmail,
      guestName: booking.guestName,
      hostName: booking.eventType.user.name || "Votre hôte",
      eventName: booking.eventType.name,
      startTime: booking.startTime,
      duration: booking.eventType.duration,
      cancelToken: booking.cancelToken!,
    }).catch(console.error)
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object
    if (session.metadata?.bookingId) {
      await prisma.booking.update({
        where: { id: session.metadata.bookingId },
        data: { status: "cancelled" },
      }).catch(() => {})
    }
  }

  return NextResponse.json({ received: true })
}
