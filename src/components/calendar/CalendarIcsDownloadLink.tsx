import { createEvents } from 'ics'
import type { Event } from '@/common/types'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import Image from 'next/image'

type IcsAttendee = {
    name: string
    email: string
}

const CalendarIcsDownloadLink = () => {
    const { activePlayer } = useSelectedRolesContext()
    const downloadEvents = async () => {
        const response = await fetch(`/api/events?playerId=${activePlayer?.id}`)
        if (!response.ok) {
            throw new Error('Unable to load events')
        }

        const data = await response.json().catch(() => null)
        const events = Array.isArray(data?.events) ? data.events : []
        const now = new Date()
        return events.filter((event: { startAt?: string }) => {
            if (typeof event.startAt !== 'string' || !event.startAt) {
                return false
            }

            return new Date(event.startAt) >= now
        })
    }

    const fixNameForEmail = (name: string): string => {
        return name?.replaceAll(' ', '-').toLowerCase() || 'attendee'
    }

    const getAttendees = async (eventId: number): Promise<IcsAttendee[]> => {
        const response = await fetch(`/api/players/${eventId}`)
        if (!response.ok) {
            return []
        }

        const data = await response.json().catch(() => null)
        const players = Array.isArray(data?.players) ? data.players : []

        return players.map((player: { name?: string }) => ({
            name: player.name || 'Attendee',
            email: `${fixNameForEmail(player.name || 'Attendee')}@cardgames.com`,
        }))
    }

    const handleDownload = async () => {
        // Date arrays formatted as [Year, Month, Day, Hour, Minute]
        // Note: Month is 1-indexed in this library (1 = January, 12 = December)
        const upcomingEvents = await downloadEvents()
        const eventsWithAttendees = await Promise.all(
            upcomingEvents.map(async (event: Event) => ({
                ...event,
                attendees: await getAttendees(event.id),
            })),
        )

        createEvents(
            eventsWithAttendees.map((event: Event & { attendees: IcsAttendee[] }) => ({
                start: [
                    new Date(event.startAt).getFullYear(),
                    new Date(event.startAt).getMonth() + 1,
                    new Date(event.startAt).getDate(),
                    new Date(event.startAt).getHours(),
                    new Date(event.startAt).getMinutes(),
                ],
                duration: { minutes: event.durationInMins || 30 },
                title: event.name || 'Untitled Event',
                description: event.description || '',
                location: 'online',
                url: `http://whatever.com/event/${event.id}`,
                status: event.isAssigned ? 'CONFIRMED' : 'TENTATIVE',
                busyStatus: 'BUSY',
                categories: ['card games'],
                organizer: {
                    name: event.organizerName || '',
                    email: `${fixNameForEmail(event.organizerName || 'Organizer')}@cardgames.com`,
                },
                attendees: event.attendees ?? [],
            })),
            (error, value) => {
                if (error) {
                    console.error(error)
                    return
                }

                // Generate blob and trigger browser download
                const blob = new Blob([value], { type: 'text/calendarcharset=utf-8' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')

                link.href = url
                link.download = 'game-events-invite.ics'
                document.body.appendChild(link)
                link.click()

                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            },
        )
    }

    return (
        <button onClick={handleDownload} style={{ cursor: 'pointer' }}>
            <Image
                src="/calendar.svg"
                alt="Download calendar"
                title="Download calendar"
                width="32"
                height="32"
            />
        </button>
    )
}

export default CalendarIcsDownloadLink
