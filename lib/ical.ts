import ical from "ical-generator"

export function generateICalEvent({
  summary,
  description,
  startTime,
  endTime,
  organizerName,
  organizerEmail,
  attendeeEmail,
  attendeeName,
}: {
  summary: string
  description?: string
  startTime: Date
  endTime: Date
  organizerName: string
  organizerEmail: string
  attendeeEmail: string
  attendeeName: string
}): string {
  const cal = ical({ name: "Cal.pro" })

  cal.createEvent({
    summary,
    description,
    start: startTime,
    end: endTime,
    organizer: { name: organizerName, email: organizerEmail },
    attendees: [{ name: attendeeName, email: attendeeEmail }],
  })

  return cal.toString()
}
