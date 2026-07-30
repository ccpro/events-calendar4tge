'use client'

import { useEffect, useState } from 'react'
import type { Game } from '@/common/types'
import styles from '@/app/globals.module.css'
import { formatDate } from '@/app/common/dateUtils'

const GameList = () => {
    const [games, setGames] = useState<Game[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const loadGames = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch('/api/games')

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                const data = await response.json()
                setGames(data.gameTypes ?? [])
            } catch (err) {
                setGames([])
                setError(err instanceof Error ? err.message : 'Unable to load game types')
            } finally {
                setLoading(false)
            }
        }

        void loadGames()
    }, [])

    if (loading) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading game types...</p>
    }

    if (error) {
        return <p style={{ marginTop: '1rem', opacity: 0.9, color: '#ffb4b4' }}>{error}</p>
    }

    if (games.length === 0) {
        return <p style={{ marginTop: '1rem', opacity: 0.75 }}>No game types found.</p>
    }

    return (
        <div className={styles.tableShell}>
            <h2>Games</h2>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeadRow}>
                        <th className={styles.tableHeaderCell}>Name</th>
                        <th className={styles.tableHeaderCell}>Description</th>
                        <th className={styles.tableHeaderCell}>Template</th>
                        <th className={styles.tableHeaderCell}>Duration (mins)</th>
                        <th className={styles.tableHeaderCell}>Minimum Players</th>
                        <th className={styles.tableHeaderCell}>Format</th>
                        <th className={styles.tableHeaderCell}>Created (utc)</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((template) => (
                        <tr key={template.id} className={styles.tableBodyRow}>
                            <td className={styles.tableCell}>{template.name}</td>
                            <td className={styles.tableCell}>{template.description}</td>
                            <td className={styles.tableCell}>{template.template}</td>
                            <td className={styles.tableCell}>{template.durationInMins}</td>
                            <td className={styles.tableCell}>{template.minimumPlayers}</td>
                            <td className={styles.tableCell}>{template.format}</td>
                            <td className={styles.tableCell}>{formatDate(template.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default GameList
