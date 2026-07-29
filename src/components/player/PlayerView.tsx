'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import GeneratePlayerAccountWithQrCode from './GeneratePlayerAccountWithQrCode'
import PlayerList from './PlayerList'

const PlayerView = () => {
    const loadPlayers = useCallback(() => {
        // Trigger refresh in the child component
        return undefined
    }, [])

    return (
        <main style={{ minHeight: '100vh', padding: '3rem', fontFamily: 'var(--font-geist-sans)' }}>
            <section
                style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    padding: '2rem',
                    borderRadius: '24px',
                    background: '#f5f5f5',
                    color: '#111',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
            >
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.75 }}>
                    Role
                </p>
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>Players</h1>

                <PlayerList onRefresh={loadPlayers} />

                <div style={{ marginTop: '1.5rem' }}>
                    <p style={{ fontWeight: 600 }}>register new player</p>
                    <GeneratePlayerAccountWithQrCode onRegister={loadPlayers} />
                </div>
                <div
                    style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
                >
                    <Link href="/" style={{ color: '#111', textDecoration: 'underline' }}>
                        Back home
                    </Link>
                    <Link href="/organizer" style={{ color: '#111', textDecoration: 'underline' }}>
                        Switch to organizer view
                    </Link>
                </div>
            </section>
        </main>
    )
}

export default PlayerView
