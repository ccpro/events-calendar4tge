'use client'

import PageShell from '@/components/common/PageShell'
import OrganizerList from './OrganizerList'

const OrganizerView = () => {
    return (
        <PageShell
            eyebrow="Role"
            title="Store Organizers"
            links={[
                { href: '/', label: 'Back home' },
                { href: '/player', label: 'Switch to player view' },
                { href: '/games', label: 'Games list' },
            ]}
        >
            <OrganizerList />
        </PageShell>
    )
}

export default OrganizerView
