'use client'

import PageShell from '@/components/common/PageShell'
import CalendarView from './CalendarView'

const CalendarPageView = () => {
    return (
        <PageShell
            eyebrow="Calendar"
            title="Event Calendar"
            description="Review scheduled events by day in a calendar view."
            links={[
                { href: '/', label: 'Back home' },
                { href: '/events', label: 'Go to events' },
            ]}
        >
            <CalendarView />
        </PageShell>
    )
}

export default CalendarPageView
