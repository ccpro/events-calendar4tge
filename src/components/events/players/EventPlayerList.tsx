'use client'

import { SubmitButton } from '@/components/common'
import { useEffect, useState } from 'react'
import type { Event } from '@/common/types'

type EventPlayer = {
    id: number
    name: string
}

type EventPlayerListProps = {
    event: Event
    onChange?: (playerId: number) => void
}

const EventPlayerList = ({ event, onChange }: EventPlayerListProps) => {
    const [players, setPlayers] = useState<EventPlayer[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [removingId, setRemovingId] = useState<number | null>(null)

    const loadPlayers = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/events/players/${event.id}`)
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const data = await response.json()
            setPlayers(data.players ?? [])
        } catch (err) {
            setPlayers([])
            setError(err instanceof Error ? err.message : 'Unable to load players')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadPlayers()
    }, [event.id])

    const handleUnassign = async (playerId: number) => {
        setRemovingId(playerId)

        try {
            const response = await fetch(`/api/events/unassign/${event.id}/${playerId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json().catch(() => null)
                throw new Error(data?.error ?? `Request failed with status ${response.status}`)
            }

            await loadPlayers()
            onChange?.(playerId)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to unassign player')
        } finally {
            setRemovingId(null)
        }
    }

    if (loading) {
        return <p>Loading players...</p>
    }

    if (error) {
        return <p style={{ color: '#b91c1c' }}>{error}</p>
    }

    if (players.length === 0) {
        return <p>No players registered for this event yet.</p>
    }

    return (
        <div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', display: 'grid', gap: '0.5rem' }}>
                <h2>{event.name}</h2>
                {players.map((player) => (
                    <li key={player.id}>
                        <strong>{player.name}</strong>
                        <div style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                            <SubmitButton
                                disabled={removingId === player.id}
                                cta_text_enabled="Unassign"
                                cta_text_disabled="Removing"
                                onClick={() => handleUnassign(player.id)}
                            ></SubmitButton>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default EventPlayerList
