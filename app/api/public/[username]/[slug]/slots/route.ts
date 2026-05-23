import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAvailableSlots } from "@/lib/slots"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; slug: string }> }
) {
  const { username, slug } = await params
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")

  if (!date)
    return NextResponse.json({ error: "date requis (YYYY-MM-DD)" }, { status: 400 })

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const eventType = await prisma.eventType.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
    select: { id: true },
  })
  if (!eventType) return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const slots = await getAvailableSlots(eventType.id, date)
  return NextResponse.json(slots)
}
