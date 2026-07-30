'use client'

import { Game } from '@/app/common/types'
import PageShell from '@/components/common/PageShell'
import { useEffect, useState } from 'react'

const GameView = () => {
    const [games, setGames] = useState<Game[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadGames = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch('/api/games')

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                const data = await response.json()
                setGames(data.gameTypes ?? [])
            } catch (err) {
                setGames([])
                setError(err instanceof Error ? err.message : 'Unable to load game types')
            } finally {
                setLoading(false)
            }
        }

        loadGames()
    }, [])

    return (
        <PageShell
            eyebrow="game types"
            title="Available Games"
            description="Browse the available game templates that can drive event properties."
            links={[
                { href: '/events', label: 'Back to events list' },
                { href: '/games/new', label: 'Add new game' },
                { href: '/', label: 'Back home' },
            ]}
        >
            {loading ? (
                <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading game types...</p>
            ) : error ? (
                <p style={{ marginTop: '1rem', opacity: 0.9, color: '#ffb4b4' }}>{error}</p>
            ) : games.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.25rem' }}>
                    {games.map((template) => (
                        <div
                            key={template.id}
                            style={{
                                padding: '0.9rem 1rem',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.08)',
                            }}
                        >
                            <div style={{ fontWeight: 600 }}>
                                {template.name} (created: {template.createdAt})
                            </div>
                            <div
                                style={{
                                    opacity: 0.8,
                                    fontSize: '0.9rem',
                                    marginTop: '0.25rem',
                                }}
                            >
                                {template.description}
                            </div>
                            <div
                                style={{
                                    opacity: 0.7,
                                    fontSize: '0.8rem',
                                    marginTop: '0.35rem',
                                }}
                            >
                                Template: {template.template}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ marginTop: '1rem', opacity: 0.75 }}>No game types found.</p>
            )}
        </PageShell>
    )
}

export default GameView
