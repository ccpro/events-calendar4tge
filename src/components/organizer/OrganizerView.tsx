'use client'

import PageShell from '@/components/common/PageShell'
import OrganizerList from './OrganizerList'
import EventList from '../events/EventList'

const OrganizerView = () => {
    return (
        <PageShell
            eyebrow="Role"
            title="Store Organizers"
            links={[
                { href: '/', label: 'home' },
                { href: '/player', label: 'Switch to player view' },
                { href: '/calendar', label: 'Calendar view' },
                { href: '/events', label: 'Events' },
                { href: '/games', label: 'Games' },
            ]}
        >
            <OrganizerList />
            <EventList viewType="organizer" />
        </PageShell>
    )
}

export default OrganizerView
