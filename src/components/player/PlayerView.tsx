'use client'

import { useCallback } from 'react'
import PageShell from '@/components/common/PageShell'
import { useOrganizerContext } from '@/context/Organizer/OrganizerContext'
import GeneratePlayerAccountWithQrCode from './GeneratePlayerAccountWithQrCode'
import PlayerList from './PlayerList'

const PlayerView = () => {
    const { activeOrganizer } = useOrganizerContext()

    const loadPlayers = useCallback(() => {
        return undefined
    }, [])

    return (
        <PageShell
            eyebrow="Role"
            title="Players"
            background="#f5f5f5"
            color="#111"
            links={[
                { href: '/', label: 'Back home', color: '#111' },
                { href: '/organizer', label: 'Switch to organizer view', color: '#111' },
            ]}
        >
            {activeOrganizer && (
                <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
                    Active organizer: {activeOrganizer.name}
                </p>
            )}

            <PlayerList onRefresh={loadPlayers} />

            <div style={{ marginTop: '1.5rem' }}>
                <p style={{ fontWeight: 600 }}>register new player</p>
                <GeneratePlayerAccountWithQrCode onRegister={loadPlayers} />
            </div>
        </PageShell>
    )
}

export default PlayerView
