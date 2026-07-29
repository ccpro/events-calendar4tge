import Link from 'next/link'
import styles from './page.module.css'

const Home = () => {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Event Calendar for Tabletop Game Events</h1>
                <div className={styles.intro}>
                    <h2>To get started, choose a role:</h2>
                    <div className={styles.ctas}>
                        <Link className={styles.primary} href="/organizer">
                            store organizer
                        </Link>
                        <Link className={styles.secondary} href="/player">
                            player
                        </Link>
                        <Link className={styles.secondary} href="/games">
                            games
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home
