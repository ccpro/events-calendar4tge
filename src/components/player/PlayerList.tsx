'use client'

import { formatDate } from '@/app/common/dateUtils'
import { Player } from '@/common/types'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import { useEffect, useState } from 'react'
import { SubmitButton } from '../common'
import styles from '@/app/globals.module.css'

type PlayerListProps = {
    onRefresh?: () => void
}

const PlayerList = ({ onRefresh }: PlayerListProps) => {
    const { activePlayer, setActivePlayer } = useSelectedRolesContext()
    const [players, setPlayers] = useState<Player[]>([])
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const response = await fetch('/api/player')
                const data = await response.json()
                setPlayers(data.players ?? [])
            } catch {
                setPlayers([])
            }
        }

        loadPlayers()
    }, [refreshKey, onRefresh])

    useEffect(() => {
        if (onRefresh) {
            setRefreshKey((value) => value + 1)
        }
    }, [onRefresh])

    return (
        <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
            <h2>Players</h2>
            {players.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeadRow}>
                            <th className={styles.tableHeaderCell}>Name</th>
                            <th className={styles.tableHeaderCell}>UUID</th>
                            <th className={styles.tableHeaderCell}>Created (utc)</th>
                            <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>
                                []
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.id} className={styles.tableBodyRow}>
                                <td className={styles.tableCell}>{player.name}</td>
                                <td className={styles.tableCellMono}>{player.uuid}</td>
                                <td className={styles.tableCell}>{formatDate(player.createdAt)}</td>
                                <td className={styles.tableCellCentered}>
                                    <SubmitButton
                                        disabled={activePlayer?.id === player.id}
                                        onClick={() => setActivePlayer(player)}
                                        cta_text_enabled="Select"
                                        cta_text_disabled="Selected"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ opacity: 0.7 }}>No players found.</p>
            )}
        </div>
    )
}

export default PlayerList
