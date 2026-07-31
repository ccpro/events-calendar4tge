'use client'

import { useCallback, useState } from 'react'
import PageShell from '@/components/common/PageShell'
import { Modal } from '@/components/common'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import GeneratePlayerAccountWithQrCode from './GeneratePlayerAccountWithQrCode'
import PlayerList from './PlayerList'
import EventList from '../events/EventList'

const PlayerView = () => {
    const { activeOrganizer, activePlayer } = useSelectedRolesContext()
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)

    const [playerListRefreshKey, setPlayerListRefreshKey] = useState(0)

    // PlayerList currently refreshes when the onRefresh callback identity changes.
    const triggerPlayerListRefresh = useCallback(() => undefined, [])

    const handleRegistered = useCallback(async () => {
        try {
            setPlayerListRefreshKey((value) => value + 1)
            setIsRegisterOpen(false)
        } catch (error) {
            console.error('Failed to register player', error)
        }
    }, [])

    return (
        <PageShell
            eyebrow="Role"
            title="Players"
            links={[
                { href: '/', label: 'home', color: 'black' },
                { href: '/organizer', label: 'Switch to organizer view', color: 'black' },
                { href: '/calendar', label: 'Calendar view' },
            ]}
        >
            {activeOrganizer && (
                <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
                    <b>Active organizer:</b> <i>{activeOrganizer.name}</i>
                </p>
            )}
            {activePlayer && (
                <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
                    <b>Active player:</b> <i>{activePlayer.name}</i>
                </p>
            )}

            <div style={{ marginTop: '1.5rem' }}>
                <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    style={{
                        padding: '0.65rem 1.1rem',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'black',
                        color: 'white',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Register new player
                </button>
            </div>

            <PlayerList onRefresh={triggerPlayerListRefresh} />

            <Modal
                open={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                title="Register new player"
            >
                <GeneratePlayerAccountWithQrCode onRegister={handleRegistered} />
            </Modal>
        </PageShell>
    )
}

export default PlayerView
