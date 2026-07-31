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

const getRegistrationForm = (eventId: number, playerId: number, ip: string) => {
    return `http://${ip || 'localhost'}:3000/register/event/${eventId}/${playerId}`
}

const useCalendarSelectedEventsList = () => {
    const { activePlayer } = useSelectedRolesContext()

    const eventStatus = (event: Event): EventStatus => {
        const now = new Date()
        const startAt = new Date(event.startAt)
        const endAt = new Date(event.endAt)

        const playersAssigned = event.playersAssigned ?? 0
        const minimumPlayers = event.minimumPlayers ?? 0

        const getTooltip = (): string => {
            return `assigned ${playersAssigned} minimum ${minimumPlayers}`
        }

        const assignedLessThanMinimum = playersAssigned < minimumPlayers
        const insufficientPlayersWarning = assignedLessThanMinimum ? 'Insufficient Players' : ''
        if (startsWithinNextHour(event.startAt)) {
            return {
                color: assignedLessThanMinimum ? 'red' : 'blue',
                title: `Upcoming in an hour. ${insufficientPlayersWarning} (${playersAssigned} assigned, ${minimumPlayers} minimum)`,
                tooltip: getTooltip(),
                state: assignedLessThanMinimum ? 'invalid' : 'valid',
            }
        }

        if (now < startAt) {
            return {
                color: assignedLessThanMinimum ? 'red' : 'blue',
                title: `Upcoming. ${insufficientPlayersWarning} (${playersAssigned} assigned, ${minimumPlayers} minimum)`,
                tooltip: getTooltip(),
                state: 'valid',
            }
        }

        if (now >= startAt && now <= endAt) {
            return {
                color: assignedLessThanMinimum ? 'red' : 'green',
                title: assignedLessThanMinimum ? `Insufficient Players. Haven't met the minimum requirement.` : 'Ongoing',
                tooltip: getTooltip(),
                state: assignedLessThanMinimum ? 'invalid' : 'valid',
            }
        }

        return {
            color: 'gray',
            title: assignedLessThanMinimum ? 'Insufficient Players. Wasn\'t able to meet the minimum requirement.' : 'Past',
            tooltip: getTooltip(),
            state: 'past',
        }
    }

    const signupForEvent = useCallback(
        async (eventId: number) => {
            if (!activePlayer) {
                return false
            }

            try {
                const response = await fetch(`/api/events/assign/${eventId}/${activePlayer.id}`, {
                    method: 'POST',
                })
                if (!response?.ok) {
                    return false
                }

                return true
            } catch {
                return false
            }
        },
        [activePlayer],
    )

    return {
        eventStatus,
        signupForEvent,
        getRegistrationForm,
    }
}

export default useCalendarSelectedEventsList
export type { EventStatus }