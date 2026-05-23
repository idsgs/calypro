import { format } from "date-fns"
import { fr } from "date-fns/locale"

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const twilio = require("twilio")
  return twilio(sid, token)
}

export async function sendSmsReminder({
  phone,
  guestName,
  eventName,
  startTime,
  hoursUntil,
}: {
  phone: string
  guestName: string
  eventName: string
  startTime: Date
  hoursUntil: number
}) {
  const client = getTwilioClient()
  if (!client) return

  const timeStr = format(startTime, "HH:mm")
  const dateStr = format(startTime, "d MMMM", { locale: fr })
  const body = hoursUntil >= 24
    ? `Rappel Cal.pro : Bonjour ${guestName}, vous avez un RDV "${eventName}" demain ${dateStr} à ${timeStr}.`
    : `Rappel Cal.pro : Bonjour ${guestName}, votre RDV "${eventName}" commence dans 1h à ${timeStr}.`

  await client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  })
}
