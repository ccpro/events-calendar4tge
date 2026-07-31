'use client'

import { Organizer, Player } from '@/common/types'
import { useEffect, useMemo, useState } from 'react'
import { SelectedRolesContext } from './SelectedRolesContext'

const STORAGE_KEY_ORGANIZER = 'active-organizer'
const STORAGE_KEY_PLAYER = 'active-player'

export const SelectedRolesProvider = ({ children }: { children: React.ReactNode }) => {
    // start null on both server and client to avoid a hydration mismatch, then hydrate from localStorage after mount
    const [activeOrganizer, setActiveOrganizerState] = useState<Organizer | null>(null)
    const [activePlayer, setActivePlayerState] = useState<Player | null>(null)

    useEffect(() => {
        try {
            const storedOrganizer = window.localStorage.getItem(STORAGE_KEY_ORGANIZER)
            if (storedOrganizer) {
                setActiveOrganizerState(JSON.parse(storedOrganizer))
            }
        } catch {
            // ignore malformed storage
        }

        try {
            const storedPlayer = window.localStorage.getItem(STORAGE_KEY_PLAYER)
            if (storedPlayer) {
                setActivePlayerState(JSON.parse(storedPlayer))
            }
        } catch {
            // ignore malformed storage
        }
    }, [])

    const setActiveOrganizer = (organizer: Organizer | null) => {
        setActiveOrganizerState(organizer)

        if (typeof window !== 'undefined') {
            if (organizer) {
                window.localStorage.setItem(STORAGE_KEY_ORGANIZER, JSON.stringify(organizer))
            } else {
                window.localStorage.removeItem(STORAGE_KEY_ORGANIZER)
            }
        }
    }
    const setActivePlayer = (player: Player | null) => {
        setActivePlayerState(player)

        if (typeof window !== 'undefined') {
            if (player) {
                window.localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(player))
            } else {
                window.localStorage.removeItem(STORAGE_KEY_PLAYER)
            }
        }
    }

    const value = useMemo(
        () => ({
            activeOrganizer,
            setActiveOrganizer,
            activePlayer,
            setActivePlayer,
        }),
        [activeOrganizer, activePlayer],
    )

    return <SelectedRolesContext.Provider value={value}>{children}</SelectedRolesContext.Provider>
}
