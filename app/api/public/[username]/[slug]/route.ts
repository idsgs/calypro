import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  const { username, slug } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, name: true, image: true, timezone: true },
  })
  if (!user)
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })

  const eventType = await prisma.eventType.findUnique({
    where: { userId_slug: { userId: user.id, slug }, isActive: true },
    include: { customFields: { orderBy: { order: "asc" } } },
  })
  if (!eventType)
    return NextResponse.json({ error: "Événement introuvable" }, { status: 404 })

  return NextResponse.json({
    id: eventType.id,
    name: eventType.name,
    description: eventType.description,
    duration: eventType.duration,
    price: eventType.price,
    color: eventType.color,
    customFields: eventType.customFields,
    hostName: user.name,
    hostImage: user.image,
    hostTimezone: user.timezone,
  })
}
