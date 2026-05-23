import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, name: true, image: true, timezone: true },
  })
  if (!user)
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 })

  const eventTypes = await prisma.eventType.findMany({
    where: { userId: user.id, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      duration: true,
      price: true,
      color: true,
    },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({
    name: user.name,
    image: user.image,
    timezone: user.timezone,
    username,
    eventTypes,
  })
}
