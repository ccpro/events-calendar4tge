'use client'

import Link from 'next/link'
import GameList from './GameList'

const GamesView = () => {
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
                    Games
                </p>
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>Available Games</h1>
                <Link
                    href="/games/new"
                    style={{
                        display: 'inline-block',
                        marginBottom: '1rem',
                        color: '#fff',
                        textDecoration: 'underline',
                    }}
                >
                    Add new game
                </Link>
                <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
                    Browse the full game catalog from this dedicated view.
                </p>

                <GameList />

                <div
                    style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
                >
                    <Link href="/" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Back home
                    </Link>
                    <Link href="/games/type" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Available Games
                    </Link>
                    <Link href="/organizer" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Go to organizer view
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default GamesView
