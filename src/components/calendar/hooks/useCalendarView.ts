import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Event } from '@/common/types'
import { isSameDay } from '@/app/common/dateUtils'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'

export const useCalendarView = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [calendarMonth, setCalendarMonth] = useState(
        () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    )
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const { activePlayer } = useSelectedRolesContext()

    const getDayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

    const loadEvents = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`/api/events?playerId=${activePlayer?.id ?? ''}`)
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const data = await response.json()
            setEvents(data.events ?? [])
        } catch (err) {
            setEvents([])
            setError(err instanceof Error ? err.message : 'Unable to load events')
        } finally {
            setLoading(false)
        }
    }, [activePlayer?.id])

    useEffect(() => {
        void loadEvents()
    }, [loadEvents])

    useEffect(() => {
        if (!selectedDate && events.length > 0) {
            const firstEventDate = [...events]
                .map((event) => new Date(event.startAt))
                .sort((left, right) => left.getTime() - right.getTime())[0]

            if (firstEventDate) {
                setSelectedDate(
                    new Date(
                        firstEventDate.getFullYear(),
                        firstEventDate.getMonth(),
                        firstEventDate.getDate(),
                    ),
                )
            }
        }
    }, [events, selectedDate])

    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
        const daysInMonth = new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth() + 1,
            0,
        ).getDate()
        const firstDayIndex = firstDayOfMonth.getDay()
        const days: Array<{ date: Date; inMonth: boolean }> = []

        for (let index = 0;index < firstDayIndex;index += 1) {
            const date = new Date(firstDayOfMonth)
            date.setDate(1 - firstDayIndex + index)
            days.push({ date, inMonth: false })
        }

        for (let day = 1;day <= daysInMonth;day += 1) {
            const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
            days.push({ date, inMonth: true })
        }

        const remaining = 42 - days.length
        for (let day = 1;day <= remaining;day += 1) {
            const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, day)
            days.push({ date, inMonth: false })
        }

        return days
    }, [calendarMonth])

    const eventAmounts = useMemo(() => {
        const amounts = new Map<string, number>()

        events.forEach((event) => {
            const dayKey = getDayKey(new Date(event.startAt))
            amounts.set(dayKey, (amounts.get(dayKey) ?? 0) + 1)
        })

        return amounts
    }, [events])

    const selectedDayEvents = useMemo(
        () =>
            events.filter((event) => {
                const eventDate = new Date(event.startAt)
                return selectedDate ? isSameDay(selectedDate, eventDate) : false
            }),
        [events, selectedDate],
    )

    return {
        events,
        loading,
        error,
        calendarMonth,
        selectedDate,
        calendarDays,
        eventAmounts,
        selectedDayEvents,
        setCalendarMonth,
        setSelectedDate,
        getDayKey,
        refreshEvents: loadEvents,
    }
}
