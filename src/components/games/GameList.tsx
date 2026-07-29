'use client'

import { useEffect, useState } from 'react'

type Game = {
    id: number
    name: string
    description: string | null
    template: string
    createdAt: string
    isAssigned: number | boolean
}

const GameList = () => {
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
                setGames(data.games ?? [])
            } catch (err) {
                setGames([])
                setError(err instanceof Error ? err.message : 'Unable to load games')
            } finally {
                setLoading(false)
            }
        }

        loadGames()
    }, [])

    if (loading) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading games...</p>
    }

    if (error) {
        return <p style={{ marginTop: '1rem', opacity: 0.9, color: '#ffb4b4' }}>{error}</p>
    }

    if (games.length === 0) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>No games found.</p>
    }

    return (
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.25rem' }}>
            {games.map((game) => (
                <div
                    key={game.id}
                    style={{
                        padding: '0.9rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(255,255,255,0.08)',
                    }}
                >
                    <div style={{ fontWeight: 600 }}>{game.name}</div>
                    <div style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        {game.description || 'No description provided.'}
                    </div>
                    <div style={{ opacity: 0.7, fontSize: '0.8rem', marginTop: '0.35rem' }}>
                        Template: {game.template}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default GameList
