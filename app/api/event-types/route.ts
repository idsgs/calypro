import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  duration: z.number().int().positive().default(30),
  bufferBefore: z.number().int().min(0).default(0),
  bufferAfter: z.number().int().min(0).default(0),
  price: z.number().int().min(0).optional().nullable(),
  color: z.string().default("blue"),
  availability: z
    .array(
      z.object({
        dayOfWeek: z.number().int().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
      })
    )
    .optional(),
  customFields: z
    .array(
      z.object({
        label: z.string(),
        type: z.enum(["text", "email", "textarea", "select", "checkbox"]),
        required: z.boolean().default(true),
        options: z.string().optional(),
        order: z.number().int().default(0),
      })
    )
    .optional(),
})

const defaultAvailability = [1, 2, 3, 4, 5].map((day) => ({
  dayOfWeek: day,
  startTime: "09:00",
  endTime: "17:00",
}))

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const eventTypes = await prisma.eventType.findMany({
    where: { userId: session.user.id, isActive: true },
    include: { availability: true, customFields: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(eventTypes)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { name, description, duration, bufferBefore, bufferAfter, price, color, availability, customFields } =
    parsed.data

  const baseSlug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
  let slug = baseSlug
  let count = 0
  while (await prisma.eventType.findUnique({ where: { userId_slug: { userId: session.user.id, slug } } })) {
    count++
    slug = `${baseSlug}-${count}`
  }

  const eventType = await prisma.eventType.create({
    data: {
      userId: session.user.id,
      name,
      slug,
      description,
      duration,
      bufferBefore,
      bufferAfter,
      price: price ?? null,
      color,
      availability: {
        create: availability ?? defaultAvailability,
      },
      customFields: customFields
        ? { create: customFields }
        : undefined,
    },
    include: { availability: true, customFields: true },
  })

  return NextResponse.json(eventType, { status: 201 })
}
