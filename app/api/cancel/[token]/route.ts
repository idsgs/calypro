import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const booking = await prisma.booking.findUnique({ where: { cancelToken: token } })

  if (!booking)
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 })
  if (booking.status === "cancelled")
    return NextResponse.json({ error: "Déjà annulée" }, { status: 400 })

  await prisma.booking.update({ where: { id: booking.id }, data: { status: "cancelled" } })
  return NextResponse.json({ success: true })
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const booking = await prisma.booking.findUnique({
    where: { cancelToken: token },
    include: { eventType: { select: { name: true, duration: true } } },
  })

  if (!booking)
    return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  return NextResponse.json({
    id: booking.id,
    eventName: booking.eventType.name,
    guestName: booking.guestName,
    startTime: booking.startTime,
    status: booking.status,
  })
}
