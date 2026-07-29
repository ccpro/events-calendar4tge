'use client'

import Link from 'next/link'
import PageShell from '@/components/common/PageShell'
import GameList from './GameList'

const GamesView = () => {
    return (
        <PageShell
            eyebrow="Games"
            title="Available Games"
            description="Browse the full game catalog from this dedicated view."
            links={[
                { href: '/', label: 'Back home' },
                { href: '/games/type', label: 'Available Games' },
                { href: '/organizer', label: 'Go to organizer view' },
            ]}
        >
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
            <GameList />
        </PageShell>
    )
}

export default GamesView
