'use client'

import { Organizer } from '@/common/types'
import { useMemo, useState } from 'react'
import { OrganizerContext } from './OrganizerContext'

const STORAGE_KEY = 'active-organizer'

export const OrganizerProvider = ({ children }: { children: React.ReactNode }) => {
    const [activeOrganizer, setActiveOrganizerState] = useState<Organizer | null>(() => {
        if (typeof window === 'undefined') {
            return null
        }

        try {
            const storedOrganizer = window.localStorage.getItem(STORAGE_KEY)
            return storedOrganizer ? JSON.parse(storedOrganizer) : null
        } catch {
            return null
        }
    })

    const setActiveOrganizer = (organizer: Organizer | null) => {
        setActiveOrganizerState(organizer)

        if (typeof window !== 'undefined') {
            if (organizer) {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(organizer))
            } else {
                window.localStorage.removeItem(STORAGE_KEY)
            }
        }
    }

    const value = useMemo(
        () => ({
            activeOrganizer,
            setActiveOrganizer,
        }),
        [activeOrganizer],
    )

    return <OrganizerContext.Provider value={value}>{children}</OrganizerContext.Provider>
}
