import styles from './page.module.css'
import { SectionLinkRow } from '@/components/common'

const Home = () => {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Event Calendar for Tabletop Game Events</h1>
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

export default Home
