'use client'

import Link from 'next/link'
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
            ]}
        >
            <Link
                href="/events/new"
                style={{
                    display: 'inline-block',
                    marginBottom: '1rem',
                    color: '#fff',
                    textDecoration: 'underline',
                }}
            >
                Add new event
            </Link>
            <EventList viewType="organizer" />
        </PageShell>
    )
}

export default EventView
