'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Event } from '@/app/common/types'
import { formatDate, isSameDay } from '@/app/common/dateUtils'
import styles from '@/app/globals.module.css'

const getDayKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

const CalendarView = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [calendarMonth, setCalendarMonth] = useState(
        () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    )
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch('/api/events')
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
        }

        void loadEvents()
    }, [])

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

        for (let index = 0; index < firstDayIndex; index += 1) {
            const date = new Date(firstDayOfMonth)
            date.setDate(1 - firstDayIndex + index)
            days.push({ date, inMonth: false })
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day)
            days.push({ date, inMonth: true })
        }

        const remaining = 42 - days.length
        for (let day = 1; day <= remaining; day += 1) {
            const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, day)
            days.push({ date, inMonth: false })
        }

        return days
    }, [calendarMonth])

    const eventDates = useMemo(
        () => new Set(events.map((event) => getDayKey(new Date(event.startAt)))),
        [events],
    )
    const selectedDayEvents = useMemo(
        () =>
            events.filter((event) => {
                const eventDate = new Date(event.startAt)
                return selectedDate ? isSameDay(selectedDate, eventDate) : false
            }),
        [events, selectedDate],
    )

    if (loading) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading events...</p>
    }

    if (error) {
        return <p style={{ marginTop: '1rem', opacity: 0.9, color: '#ffb4b4' }}>{error}</p>
    }

    return (
        <div className={styles.calendarShell}>
            <div className={styles.calendarHeader}>
                <button
                    type="button"
                    className={styles.calendarNavButton}
                    onClick={() =>
                        setCalendarMonth(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                        )
                    }
                >
                    Previous
                </button>
                <h3>
                    {calendarMonth.toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </h3>
                <button
                    type="button"
                    className={styles.calendarNavButton}
                    onClick={() =>
                        setCalendarMonth(
                            new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                        )
                    }
                >
                    Next
                </button>
            </div>
            <div className={styles.calendarGrid}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
                    <div key={label} className={styles.calendarWeekday}>
                        {label}
                    </div>
                ))}
                {calendarDays.map((day) => {
                    const isSelected = selectedDate ? isSameDay(day.date, selectedDate) : false
                    const hasEvents = eventDates.has(getDayKey(day.date))

                    return (
                        <button
                            key={`${day.date.toISOString()}-${day.inMonth ? 'in' : 'out'}`}
                            type="button"
                            className={`${styles.calendarDayButton} ${day.inMonth ? '' : styles.calendarDayButtonOutOfMonth} ${isSelected ? styles.calendarDayButtonSelected : ''} ${hasEvents ? styles.calendarDayButtonHasEvents : ''}`.trim()}
                            onClick={() => setSelectedDate(day.date)}
                            aria-label={`Select day ${day.date.getDate()}`}
                        >
                            <span>{day.date.getDate()}</span>
                            {hasEvents ? <span className={styles.calendarDayBadge} /> : null}
                        </button>
                    )
                })}
            </div>
            <div className={styles.calendarDayPanel}>
                <h3>
                    {selectedDate
                        ? selectedDate.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                          })
                        : 'Selected day'}
                </h3>
                {selectedDayEvents.length > 0 ? (
                    <ul className={styles.calendarEventList} aria-label="Selected day events">
                        {selectedDayEvents.map((event) => (
                            <li key={event.id} className={styles.calendarEventItem}>
                                <strong>{event.name}</strong>
                                <span>{formatDate(event.startAt)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={styles.calendarEmptyState}>No events scheduled for this day.</p>
                )}
            </div>
        </div>
    )
}

export default CalendarView
