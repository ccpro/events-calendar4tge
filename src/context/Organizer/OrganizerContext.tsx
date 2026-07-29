'use client'

import { Organizer } from '@/common/types'
import { createContext, useContext } from 'react'

type OrganizerContextValue = {
    activeOrganizer: Organizer | null
    setActiveOrganizer: (organizer: Organizer | null) => void
}

export const OrganizerContext = createContext<OrganizerContextValue | undefined>(undefined)

export const useOrganizerContext = () => {
    const context = useContext(OrganizerContext)

    if (!context) {
        throw new Error('useOrganizerContext must be used within OrganizerProvider')
    }

    return context
}
