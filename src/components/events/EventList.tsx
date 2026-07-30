'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Event } from '@/app/common/types'
import { formatDate, isDateNewerThanNow } from '@/app/common/dateUtils'
import { Modal, SubmitButton } from '@/components/common'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import EventPlayerList from './players/EventPlayerList'

type EventListProps = {
    viewType: 'organizer' | 'player'
}

const EventList = ({ viewType }: EventListProps) => {
    const [events, setEvents] = useState<Event[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [signingUpId, setSigningUpId] = useState<number | null>(null)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const { activePlayer } = useSelectedRolesContext()

    const loadEvents = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/events?playerId=${activePlayer?.id ?? 0}`)
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const data = await response.json()
            setEvents(data.events ?? [])
        } catch (err) {
            setEvents([])
            setError(err instanceof Error ? err.message : 'Unable to load events')
        } finally {
            setLoading(false)
        }
    }, [activePlayer])

    useEffect(() => {
        loadEvents()
    }, [loadEvents])

    const handleSignUp = async (eventId: number) => {
        if (!activePlayer) {
            return
        }

        setSigningUpId(eventId)

        try {
            const response = await fetch(`/api/events/assign/${eventId}/${activePlayer.id}`, { method: 'POST' })
            if (!response.ok) {
                const data = await response.json().catch(() => null)
                throw new Error(data?.error ?? `Request failed with status ${response.status}`)
            }

            await loadEvents()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to sign up for this event')
        } finally {
            setSigningUpId(null)
        }
    }

    const viewEventPlayers = (event: Event) => {
        setSelectedEvent(event)
    }

    if (loading) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading events...</p>
    }

    if (error) {
        return <p style={{ marginTop: '1rem', opacity: 0.9, color: '#ffb4b4' }}>{error}</p>
    }

    if (events.length === 0) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>No events found.</p>
    }

    return (
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.25rem' }}>
            <h2>Events</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                        <th style={{ padding: '0.5rem 0' }}>Name</th>
                        <th style={{ padding: '0.5rem 0' }}>Organizer</th>
                        <th style={{ padding: '0.5rem 0' }}>Template</th>
                        <th style={{ padding: '0.5rem 0' }}>Created</th>
                        <th style={{ padding: '0.5rem 0' }}>Start</th>
                        <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>
                            Capacity/Players
                        </th>
                        {viewType === 'player' && (
                            <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>Assigned</th>
                        )}
                        <th style={{ padding: '0.5rem 0', textAlign: 'center' }}>[]</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => (
                        <tr key={event.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.5rem 0' }}>{event.name}</td>
                            <td style={{ padding: '0.5rem 0' }}>{event.organizerName}</td>
                            <td style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                                {event.template}
                            </td>
                            <td style={{ padding: '0.5rem 0' }}>{formatDate(event.createdAt)}</td>
                            <td style={{ padding: '0.5rem 0' }}>{formatDate(event.startAt)}</td>
                            <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>
                                {event.playerCapacity}/{event.playersAssigned ?? 0}
                            </td>
                            {viewType === 'player' && (
                                <>
                                    <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>
                                        {event.isAssigned ? 'Yes' : 'No'}
                                    </td>
                                    <td style={{ padding: '0.5rem 0' }}>
                                        {event.isAssigned ? (
                                            <span style={{ color: 'blue' }}>assigned</span>
                                        ) : (
                                            <SubmitButton
                                                disabled={
                                                    !isDateNewerThanNow(event.startAt) ||
                                                    !activePlayer ||
                                                    signingUpId === event.id ||
                                                    event.playerCapacity <=
                                                        (event.playersAssigned ?? 0)
                                                }
                                                onClick={() => handleSignUp(event.id)}
                                                cta_text_enabled="Sign Up"
                                                cta_text_disabled={
                                                    !activePlayer
                                                        ? 'Select player'
                                                        : signingUpId === event.id
                                                          ? 'Signing up...'
                                                          : !isDateNewerThanNow(event.startAt)
                                                            ? 'Late'
                                                            : 'Full'
                                                }
                                            />
                                        )}
                                    </td>
                                </>
                            )}
                            {viewType === 'organizer' && (
                                <td style={{ padding: '0.5rem 0', textAlign: 'center' }}>
                                    <SubmitButton
                                        disabled={false}
                                        onClick={() => viewEventPlayers(event)}
                                        cta_text_enabled="View Players"
                                        cta_text_disabled="View Players"
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                open={selectedEvent !== null}
                onClose={() => setSelectedEvent(null)}
                title="Event players"
            >
                {selectedEvent !== null && (
                    <EventPlayerList event={selectedEvent} onChange={() => void loadEvents()} />
                )}
            </Modal>
        </div>
    )
}

export default EventList
