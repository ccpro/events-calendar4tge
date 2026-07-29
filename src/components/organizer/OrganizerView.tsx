'use client'

import Link from 'next/link'
import OrganizerGames from './OrganizerGames'
import OrganizerList from './OrganizerList'

const OrganizerView = () => {
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
                    Role
                </p>
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>Store Organizers</h1>

                <OrganizerList />
                <OrganizerGames />

                <div
                    style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
                >
                    <Link href="/" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Back home
                    </Link>
                    <Link href="/player" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Switch to player view
                    </Link>
                    <Link href="/games" style={{ color: '#fff', textDecoration: 'underline' }}>
                        games list
                    </Link>
                </div>
            </section>
        </main>
    )
}
export default OrganizerView
