import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const eventType = await prisma.eventType.findFirst({
    where: { id, userId: session.user.id },
    include: { availability: true, customFields: { orderBy: { order: "asc" } } },
  })
  if (!eventType)
    return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  return NextResponse.json(eventType)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const existing = await prisma.eventType.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing)
    return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const body = await req.json()
  const { name, description, duration, bufferBefore, bufferAfter, price, color, isActive, availability } = body

  const updateData: Record<string, unknown> = {}
  if (name !== undefined) updateData.name = name
  if (description !== undefined) updateData.description = description
  if (duration !== undefined) updateData.duration = duration
  if (bufferBefore !== undefined) updateData.bufferBefore = bufferBefore
  if (bufferAfter !== undefined) updateData.bufferAfter = bufferAfter
  if (price !== undefined) updateData.price = price
  if (color !== undefined) updateData.color = color
  if (isActive !== undefined) updateData.isActive = isActive

  const eventType = await prisma.eventType.update({
    where: { id },
    data: updateData,
    include: { availability: true, customFields: true },
  })

  if (availability) {
    await prisma.availability.deleteMany({ where: { eventTypeId: id } })
    await prisma.availability.createMany({
      data: availability.map((a: { dayOfWeek: number; startTime: string; endTime: string }) => ({
        eventTypeId: id,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
    })
  }

  return NextResponse.json(eventType)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const existing = await prisma.eventType.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing)
    return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  await prisma.eventType.update({ where: { id }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
