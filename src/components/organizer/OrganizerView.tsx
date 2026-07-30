'use client'

import PageShell from '@/components/common/PageShell'
import OrganizerList from './OrganizerList'
import EventList from '../events/EventList'

const OrganizerView = () => {
    return (
        <PageShell
            eyebrow="Role"
            title="Store Organizers"
            background="#f5f5f5"
            color="#111"
            links={[
                { href: '/', label: 'Back home' },
                { href: '/player', label: 'Switch to player view' },
                { href: '/games', label: 'Games list' },
            ]}
        >
            <OrganizerList />
            <EventList viewType="organizer" />
        </PageShell>
    )
}

export default OrganizerView
