import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const booking = await prisma.booking.findFirst({
    where: { id, eventType: { userId: session.user.id } },
  })
  if (!booking)
    return NextResponse.json({ error: "Introuvable" }, { status: 404 })

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: "paid" },
  })

  return NextResponse.json(updated)
}
