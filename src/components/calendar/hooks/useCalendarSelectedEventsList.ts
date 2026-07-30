import { useCallback } from 'react'
import type { Event } from '@/common/types'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import { startsWithinNextHour } from '@/app/common/dateUtils'

type EventState = 'valid' | 'invalid' | 'past'

type EventStatus = {
    color: string
    title: string
    tooltip: string
    state: EventState
}

const useCalendarSelectedEventsList = (onRefresh?: () => void) => {
    const { activePlayer } = useSelectedRolesContext()

    const eventStatus = (event: Event): EventStatus => {
        const now = new Date()
        const startAt = new Date(event.startAt)
        const endAt = new Date(event.endAt)

        const getTooltip = (event: Event): string => {
            return `assigned ${event.playersAssigned} minimum ${event.minimumPlayers}`
        }

        const assignedLessThanMinimum = event.playersAssigned < event.minimumPlayers
        const insufficientPlayersWarning = assignedLessThanMinimum ? 'Insufficient Players' : ''
        if (startsWithinNextHour(event.startAt)) {
            return {
                color: assignedLessThanMinimum ? 'red' : 'blue',
                title: `Upcoming in an hour. ${insufficientPlayersWarning} (${event.playersAssigned} assigned, min ${event.minimumPlayers})`,
                tooltip: getTooltip(event),
                state: assignedLessThanMinimum ? 'invalid' : 'valid',
            }
        }

        if (now < startAt) {
            return {
                color: assignedLessThanMinimum ? 'red' : 'blue',
                title: `Upcoming. ${insufficientPlayersWarning} (${event.playersAssigned} assigned, min ${event.minimumPlayers})`,
                tooltip: getTooltip(event),
                state: assignedLessThanMinimum ? 'invalid' : 'valid',
            }
        }

        if (now >= startAt && now <= endAt) {
            return {
                color: assignedLessThanMinimum ? 'red' : 'green',
                title: assignedLessThanMinimum ? `Insufficient Players. Haven't met the minimum requirement.` : 'Ongoing',
                tooltip: getTooltip(event),
                state: assignedLessThanMinimum ? 'invalid' : 'valid',
            }
        }

        return {
            color: 'gray',
            title: assignedLessThanMinimum ? 'Insufficient Players. Wasn\'t able to meet the minimum requirement.' : 'Past',
            tooltip: getTooltip(event),
            state: 'past',
        }
    }

    const signupForEvent = useCallback(
        async (eventId: number) => {
            if (!activePlayer) {
                return
            }

            try {
                const response = await fetch(`/api/events/assign/${eventId}/${activePlayer.id}`, {
                    method: 'POST',
                })
                if (!response.ok) {
                    return
                }

                await onRefresh?.()
            } catch {
                // ignore signup failures for now
            }
        },
        [activePlayer, onRefresh],
    )

    return {
        eventStatus,
        signupForEvent,
    }
}

export default useCalendarSelectedEventsList
export type { EventStatus }