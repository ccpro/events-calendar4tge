'use client'

import { SectionLinkRow } from '@/components/common'
import PageShell from '@/components/common/PageShell'
import EventList from './EventList'

const EventView = () => {
    return (
        <PageShell
            eyebrow="Events"
            title="Available Events"
            description="Browse the full event catalog from this dedicated view."
            links={[
                { href: '/', label: 'Back home' },
                { href: '/games', label: 'Available games' },
                { href: '/organizer', label: 'Go to organizer view' },
                { href: '/calendar', label: 'Open calendar view' },
            ]}
        >
            <SectionLinkRow
                color="#111"
                links={[{ href: '/events/new', label: 'Add new event' }]}
            />
            <EventList viewType="list" />
        </PageShell>
    )
}

export default EventView
