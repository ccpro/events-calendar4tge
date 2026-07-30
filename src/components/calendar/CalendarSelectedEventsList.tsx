'use client'

import { formatDate } from '@/app/common/dateUtils'
import type { Event } from '@/app/common/types'
import styles from '@/app/globals.module.css'
import { SubmitButton } from '../common'
import useCalendarSelectedEventsList from './hooks/useCalendarSelectedEventsList'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'

type CalendarSelectedEventsListProps = {
    events: Event[]
    onRefresh?: () => void
}

const CalendarSelectedEventsList = ({ events, onRefresh }: CalendarSelectedEventsListProps) => {
    const { eventStatus, signupForEvent } = useCalendarSelectedEventsList(onRefresh)
    const { activePlayer } = useSelectedRolesContext()
    if (events.length === 0) {
        return <p className={styles.calendarEmptyState}>No events scheduled for this day.</p>
    }
    return (
        <div className={styles.calendarEventTableWrapper}>
            <table className={styles.calendarEventTable} aria-label="Selected day events">
                <thead>
                    <tr>
                        <th>Game Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Signup</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event) => {
                        const status = eventStatus(event)
                        return (
                            <tr key={event.id}>
                                <td title={event.description ?? ''}>{event.name}</td>
                                <td>{formatDate(event.startAt)}</td>
                                <td>{formatDate(event.endAt)}</td>
                                <td title={status.tooltip} style={{ color: status.color }}>
                                    {status.title}
                                </td>
                                <td>
                                    <SubmitButton
                                        disabled={!status.valid || event.isAssigned}
                                        cta_text_enabled="Book"
                                        cta_text_disabled="Booked"
                                        onClick={() => signupForEvent(event.id)}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default CalendarSelectedEventsList
