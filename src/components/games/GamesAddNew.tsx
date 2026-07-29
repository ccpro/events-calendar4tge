'use client'

import Link from 'next/link'

const GamesAddNew = () => {
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
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>Add New Game</h1>
                <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
                    This form is not implemented yet. It will be used to create a new game entry.
                </p>

                <div
                    style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
                >
                    <Link href="/games" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Back to games list
                    </Link>
                    <Link href="/" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Back home
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default GamesAddNew
