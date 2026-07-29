'use client'

import Link from 'next/link'
import { useState } from 'react'
import OrganizerList from './OrganizerList'

type Organizer = {
    id: number
    uuid: string
    name: string
    createdAt: string
}

export default function OrganizerView() {
    const [activeOrganizer, setActiveOrganizer] = useState<Organizer | null>(null)

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
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>Store Organizer</h1>
                <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
                    Select an organizer to activate their workspace.
                </p>

                {activeOrganizer && (
                    <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)' }}>
                        <strong>Active organizer:</strong> {activeOrganizer.name}
                    </div>
                )}

                <OrganizerList
                    activeOrganizerId={activeOrganizer?.id}
                    onSelectOrganizer={setActiveOrganizer}
                />

                <div
                    style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
                >
                    <Link href="/" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Back home
                    </Link>
                    <Link href="/player" style={{ color: '#fff', textDecoration: 'underline' }}>
                        Switch to player view
                    </Link>
                </div>
            </section>
        </main>
    )
}
