'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Event } from '@/common/types'
import { formatDate, isDateNewerThanNow } from '@/app/common/dateUtils'
import { Modal, SubmitButton } from '@/components/common'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import styles from '@/app/globals.module.css'
import EventPlayerList from './players/EventPlayerList'

type EventListProps = {
    viewType: 'organizer' | 'player' | 'list'
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
            const response = await fetch(`/api/events/assign/${eventId}/${activePlayer.id}`, {
                method: 'POST',
            })
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

    const getSignUpButtonState = (event: Event) => {
        const isLate = !isDateNewerThanNow(event.startAt)
        const isFull = event.playerCapacity <= (event.playersAssigned ?? 0)
        const disabled = !activePlayer || signingUpId === event.id || isLate || isFull

        const ctaTextDisabled = !activePlayer
            ? 'Select player'
            : signingUpId === event.id
              ? 'Signing up...'
              : isLate
                ? 'Late'
                : 'Full'

        return { disabled, ctaTextDisabled }
    }

    if (loading) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading events...</p>
    }

    if (error) {
        return <p style={{ marginTop: '1rem', opacity: 0.9, color: '#ffb4b4' }}>{error}</p>
    }

    return (
        <div className={styles.tableShell}>
            <h2>Events</h2>
            {events.length === 0 ? (
                <p style={{ marginTop: '1rem', opacity: 0.75 }}>No events found.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeadRow}>
                            <th className={styles.tableHeaderCell}>Name</th>
                            <th className={styles.tableHeaderCell}>Organizer</th>
                            <th className={styles.tableHeaderCell}>Template</th>
                            <th className={styles.tableHeaderCell}>Created (utc)</th>
                            <th className={styles.tableHeaderCell}>Start (utc)</th>
                            <th className={styles.tableHeaderCell}>Capacity/Players</th>
                            {viewType === 'player' && (
                                <th className={styles.tableHeaderCell}>Assigned</th>
                            )}
                            {viewType !== 'list' && (
                                <th className={styles.tableHeaderCell}>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className={styles.tableBodyRow}>
                                <td className={styles.tableCell}>{event.name}</td>
                                <td className={styles.tableCell}>{event.organizerName}</td>
                                <td className={styles.tableCellMono}>{event.template}</td>
                                <td className={styles.tableCell}>{formatDate(event.createdAt)}</td>
                                <td className={styles.tableCell}>{formatDate(event.startAt)}</td>
                                <td className={styles.tableCellCentered}>
                                    {event.playerCapacity}/{event.playersAssigned ?? 0}
                                </td>
                                {viewType === 'player' && (
                                    <>
                                        <td className={styles.tableCellCentered}>
                                            {event.isAssigned ? 'Yes' : 'No'}
                                        </td>
                                        <td className={styles.tableCell}>
                                            {event.isAssigned ? (
                                                <span style={{ color: 'blue' }}>assigned</span>
                                            ) : (
                                                (() => {
                                                    const { disabled, ctaTextDisabled } =
                                                        getSignUpButtonState(event)

                                                    return (
                                                        <SubmitButton
                                                            disabled={disabled}
                                                            onClick={() => handleSignUp(event.id)}
                                                            cta_text_enabled="Sign Up"
                                                            cta_text_disabled={ctaTextDisabled}
                                                        />
                                                    )
                                                })()
                                            )}
                                        </td>
                                    </>
                                )}
                                {viewType === 'organizer' && (
                                    <td className={styles.tableActionCell}>
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
            )}

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
