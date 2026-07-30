'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/app/common/dateUtils'
import type { Event } from '@/common/types'
import styles from '@/app/globals.module.css'
import { Modal, SubmitButton } from '../common'
import useCalendarSelectedEventsList from './hooks/useCalendarSelectedEventsList'
import QRCode from 'react-qr-code'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'

type CalendarSelectedEventsListProps = {
    events: Event[]
    onRefresh?: () => void
}

const CalendarSelectedEventsList = ({ events, onRefresh }: CalendarSelectedEventsListProps) => {
    const { eventStatus, signupForEvent, getRegistrationForm } =
        useCalendarSelectedEventsList(onRefresh)
    const { activePlayer } = useSelectedRolesContext()
    const [pendingEvent, setPendingEvent] = useState<Event | null>(null)
    const [ip, setIp] = useState('')

    useEffect(() => {
        if (!pendingEvent) {
            return
        }

        const loadIp = async () => {
            try {
                const response = await fetch('/api/ip')

                if (!response?.ok) {
                    setIp('')
                    return
                }

                const data = await response.json().catch(() => ({}))
                setIp(typeof data.ip === 'string' ? data.ip : '')
            } catch {
                setIp('')
            }
        }

        void loadIp()
    }, [pendingEvent])

    const registrationForm =
        pendingEvent && activePlayer
            ? getRegistrationForm(pendingEvent.id, activePlayer.id, ip)
            : ''

    const handleCloseModal = () => {
        setPendingEvent(null)
        onRefresh?.()
    }

    const handleConfirmSignup = async () => {
        if (!pendingEvent) {
            return
        }

        const isSignedUp = await signupForEvent(pendingEvent.id)
        if (isSignedUp) {
            handleCloseModal()
        }
    }

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
                        <th>Duration</th>
                        <th>Format</th>
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
                                <td>{event.durationInMins} mins</td>
                                <td>{event.format}</td>
                                <td title={status.tooltip} style={{ color: status.color }}>
                                    {status.title}
                                </td>
                                <td>
                                    <SubmitButton
                                        disabled={status.state !== 'valid' || event.isAssigned}
                                        cta_text_enabled="Book"
                                        cta_text_disabled={
                                            status.state === 'past' ? 'Past' : 'Booked'
                                        }
                                        onClick={() => setPendingEvent(event)}
                                    />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Modal open={Boolean(pendingEvent)} onClose={handleCloseModal} title="Confirm signup">
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {registrationForm ? (
                        <>
                            <a
                                href={registrationForm}
                                target="_blank"
                                rel="noreferrer"
                                style={{ wordBreak: 'break-all' }}
                            >
                                {registrationForm}
                            </a>
                            <QRCode
                                value={registrationForm}
                                size={256}
                                bgColor="white"
                                fgColor="black"
                                level="H"
                            />
                        </>
                    ) : (
                        <p style={{ margin: 0 }}>Loading registration link...</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            style={{
                                padding: '0.5rem 0.9rem',
                                borderRadius: '8px',
                                border: '1px solid black',
                                background: 'transparent',
                                color: 'black',
                                cursor: 'pointer',
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmSignup}
                            style={{
                                padding: '0.5rem 0.9rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'black',
                                color: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default CalendarSelectedEventsList
