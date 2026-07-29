'use client'

import { useEffect, useState } from 'react'
import { useOrganizerContext } from '@/context/Organizer/OrganizerContext'
import { Game } from '@/app/common/types'

const OrganizerGames = () => {
    const { activeOrganizer } = useOrganizerContext()
    const [games, setGames] = useState<Game[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const controller = new AbortController()

        const loadGames = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch('/api/games', { signal: controller.signal })

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                const data = await response.json()
                setGames(data.games ?? [])
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return
                }

                setGames([])
                setError(err instanceof Error ? err.message : 'Unable to load games')
            } finally {
                setLoading(false)
            }
        }

        loadGames()

        return () => controller.abort()
    }, [activeOrganizer?.id])

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Games</h2>
            <p style={{ opacity: 0.9, marginBottom: '0.75rem' }}>
                {activeOrganizer
                    ? `Showing all games and highlighting the ones belonging to ${activeOrganizer.name}.`
                    : 'Select an organizer to highlight the games assigned to them.'}
            </p>

            {loading ? (
                <p style={{ opacity: 0.75 }}>Loading games...</p>
            ) : error ? (
                <p style={{ opacity: 0.9, color: '#ffb4b4' }}>{error}</p>
            ) : games.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {games.map((game) => {
                        const isAssigned = Boolean(game.isAssigned)

                        return (
                            <div
                                key={game.id}
                                style={{
                                    padding: '0.9rem 1rem',
                                    borderRadius: '12px',
                                    border: isAssigned
                                        ? '2px solid #fff'
                                        : '1px solid rgba(255,255,255,0.2)',
                                    background: isAssigned
                                        ? 'rgba(255,255,255,0.15)'
                                        : 'rgba(255,255,255,0.08)',
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>
                                    {isAssigned ? '✅ ' : ''}
                                    {game.name}
                                </div>
                                <div
                                    style={{
                                        opacity: 0.8,
                                        fontSize: '0.9rem',
                                        marginTop: '0.25rem',
                                    }}
                                >
                                    {game.description || 'No description provided.'}
                                </div>
                                <div
                                    style={{
                                        opacity: 0.7,
                                        fontSize: '0.8rem',
                                        marginTop: '0.35rem',
                                    }}
                                >
                                    Template: {game.template}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <p style={{ opacity: 0.75 }}>No games found.</p>
            )}
        </div>
    )
}

export default OrganizerGames
