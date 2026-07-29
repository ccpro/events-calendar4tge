'use client'

import { GameType } from '@/app/common/types'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const GameTypeView = () => {
    const [games, setGames] = useState<GameType[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadGames = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch('/api/games/types')

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
        <main style={{ minHeight: '100vh', padding: '3rem', fontFamily: 'var(--font-geist-sans)' }}>
            <section
                style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    padding: '2rem',
                    borderRadius: '24px',
                    background: '#111',
                    color: '#fff',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                }}
            >
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.75 }}>
                    game types
                </p>
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>available Games</h1>
                <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
                    Browse the available game templates that can drive event properties.
                </p>

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

                <div
                    style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
                >
                    <Link href="/games" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Back to games list
                    </Link>
                    <Link
                        href="/games/type/new"
                        style={{ color: '#fff', textDecoration: 'underline' }}
                    >
                        Add new game type
                    </Link>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Back home
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default GameTypeView
