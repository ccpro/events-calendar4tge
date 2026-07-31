'use client'

import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import styles from '../../app/page.module.css'
import { SectionLinkRow } from '@/components/common'

const HomeView = () => {
    const { activeOrganizer, activePlayer } = useSelectedRolesContext()

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Event Calendar for Tabletop Game Events</h1>
                {activeOrganizer ? (
                    <h2 style={{ color: 'green' }}>
                        You are logged in as an organizer: {activeOrganizer.name}
                    </h2>
                ) : (
                    <h2 style={{ color: 'red' }}>
                        Don't forget to select organizer on the{' '}
                        <a href="/organizer">organizer page</a>.
                    </h2>
                )}
                {activePlayer ? (
                    <h2 style={{ color: 'green' }}>
                        You are logged in as a player: {activePlayer.name}
                    </h2>
                ) : (
                    <h2 style={{ color: 'red' }}>
                        Don't forget to select player on the <a href="/player">player page</a>.
                    </h2>
                )}
                <div className={styles.intro}>
                    <h2>To get started, choose a role:</h2>
                    <SectionLinkRow
                        className={styles.ctas}
                        links={[
                            {
                                href: '/organizer',
                                label: 'store organizer',
                                className: styles.primary,
                            },
                            { href: '/player', label: 'player', className: styles.secondary },
                        ]}
                    />
                    <h2>or review:</h2>
                    <SectionLinkRow
                        className={styles.ctas}
                        links={[
                            { href: '/calendar', label: 'calendar', className: styles.secondary },
                            { href: '/events', label: 'events', className: styles.secondary },
                            { href: '/games', label: 'games', className: styles.secondary },
                        ]}
                    />
                </div>
            </main>
        </div>
    )
}

export default HomeView
