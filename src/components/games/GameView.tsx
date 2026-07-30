'use client'

import PageShell from '@/components/common/PageShell'
import GameList from './GameList'
import Link from 'next/link'

const GameView = () => {
    return (
        <PageShell
            eyebrow="game types"
            title="Available Games"
            description="Browse the available game templates that can drive event properties."
            links={[
                { href: '/', label: 'home' },
                { href: '/events', label: 'Back to events' },
            ]}
        >
            <Link href="/games/new" style={{ textDecoration: 'underline' }}>
                Add new game
            </Link>
            <GameList />
        </PageShell>
    )
}

export default GameView
