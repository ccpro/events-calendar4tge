'use client'

import PageShell from '@/components/common/PageShell'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import CalendarView from './CalendarView'
import Link from 'next/link'
import CalendarIcsDownloadLink from './CalendarIcsDownloadLink'

const CalendarPageView = () => {
    const { activePlayer } = useSelectedRolesContext()

    return (
        <PageShell
            eyebrow="Calendar"
            title="Event Calendar"
            description="Review scheduled events by day in a calendar view."
            links={[
                { href: '/', label: 'home' },
                { href: '/player', label: 'Go to players' },
                { href: '/events', label: 'Go to events' },
            ]}
        >
            {activePlayer ? (
                <p style={{ marginBottom: '0.75rem' }}>
                    <b>Active player:</b> {activePlayer.name}
                </p>
            ) : (
                <p style={{ marginBottom: '0.75rem' }}>
                    <b>Active player:</b> not assigned.{' '}
                    <Link href="/player">Please select a player.</Link>
                </p>
            )}
            <CalendarIcsDownloadLink />
            <CalendarView />
        </PageShell>
    )
}

export default CalendarPageView
