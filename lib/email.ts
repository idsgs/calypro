import { Resend } from "resend"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function sendBookingConfirmation({
  guestEmail,
  guestName,
  hostName,
  eventName,
  startTime,
  duration,
  cancelToken,
}: {
  guestEmail: string
  guestName: string
  hostName: string
  eventName: string
  startTime: Date
  duration: number
  cancelToken: string
}) {
  if (!resend) return
  const dateStr = format(startTime, "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })
  const cancelUrl = `${process.env.NEXTAUTH_URL}/cancel/${cancelToken}`

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@calpro.fr",
    to: guestEmail,
    subject: `✅ Confirmation : ${eventName} avec ${hostName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Rendez-vous confirmé</h2>
        <p>Bonjour ${guestName},</p>
        <p>Votre rendez-vous <strong>${eventName}</strong> avec <strong>${hostName}</strong> est confirmé.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>📅 Date :</strong> ${dateStr}</p>
          <p style="margin: 8px 0 0;"><strong>⏱ Durée :</strong> ${duration} minutes</p>
        </div>
        <p><a href="${cancelUrl}" style="color: #6b7280; font-size: 14px;">Annuler ce rendez-vous</a></p>
        <hr />
        <p style="color: #9ca3af; font-size: 12px;">Cal.pro — Réservation en ligne</p>
      </div>
    `,
  })
}

export async function sendBookingReminder({
  guestEmail,
  guestName,
  hostName,
  eventName,
  startTime,
  hoursUntil,
}: {
  guestEmail: string
  guestName: string
  hostName: string
  eventName: string
  startTime: Date
  hoursUntil: number
}) {
  if (!resend) return
  const dateStr = format(startTime, "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@calpro.fr",
    to: guestEmail,
    subject: `⏰ Rappel : ${eventName} dans ${hoursUntil}h`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Rappel de rendez-vous</h2>
        <p>Bonjour ${guestName},</p>
        <p>Rappel : vous avez un rendez-vous <strong>${eventName}</strong> avec <strong>${hostName}</strong> dans <strong>${hoursUntil} heure${hoursUntil > 1 ? "s" : ""}</strong>.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>📅 Date :</strong> ${dateStr}</p>
        </div>
        <hr />
        <p style="color: #9ca3af; font-size: 12px;">Cal.pro — Réservation en ligne</p>
      </div>
    `,
  })
}

export async function sendHostNotification({
  hostEmail,
  hostName,
  guestName,
  guestEmail,
  guestPhone,
  eventName,
  startTime,
  duration,
  paymentMethod,
  price,
}: {
  hostEmail: string
  hostName: string
  guestName: string
  guestEmail: string
  guestPhone?: string | null
  eventName: string
  startTime: Date
  duration: number
  paymentMethod: string
  price?: number | null
}) {
  if (!resend) return
  const dateStr = format(startTime, "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })
  const priceStr = price && price > 0 ? `${(price / 100).toFixed(0)}€` : "Gratuit"
  const paymentStr = price && price > 0
    ? (paymentMethod === "manual" ? "Paiement sur place" : "Paiement Stripe")
    : "Gratuit"

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "noreply@calpro.fr",
    to: hostEmail,
    subject: `Nouvelle réservation : ${guestName} — ${eventName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Nouvelle réservation</h2>
        <p>Bonjour ${hostName},</p>
        <p><strong>${guestName}</strong> vient de réserver <strong>${eventName}</strong>.</p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0;"><strong>Date :</strong> ${dateStr}</p>
          <p style="margin: 8px 0 0;"><strong>Durée :</strong> ${duration} minutes</p>
          <p style="margin: 8px 0 0;"><strong>Client :</strong> ${guestName}</p>
          <p style="margin: 8px 0 0;"><strong>Email :</strong> ${guestEmail}</p>
          ${guestPhone ? `<p style="margin: 8px 0 0;"><strong>Téléphone :</strong> ${guestPhone}</p>` : ""}
          <p style="margin: 8px 0 0;"><strong>Montant :</strong> ${priceStr} — ${paymentStr}</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px;">Cal.pro — Réservation en ligne</p>
      </div>
    `,
  })
}
