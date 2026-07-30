'use client'

import { Organizer, Player } from '@/common/types'
import { createContext, useContext } from 'react'

type SelectedRolesContextValue = {
    activeOrganizer: Organizer | null
    setActiveOrganizer: (organizer: Organizer | null) => void
    activePlayer: Player | null
    setActivePlayer: (player: Player | null) => void
}

export const SelectedRolesContext = createContext<SelectedRolesContextValue | undefined>(undefined)

export const useSelectedRolesContext = () => {
    const context = useContext(SelectedRolesContext)

    if (!context) {
        throw new Error('useSelectedRolesContext must be used within SelectedRolesProvider')
    }

    return context
}
