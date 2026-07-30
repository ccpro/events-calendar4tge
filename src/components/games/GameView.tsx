'use client'

import PageShell from '@/components/common/PageShell'
import GameList from './GameList'

const GameView = () => {
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
            <GameList />
        </PageShell>
    )
}

export default GameView
