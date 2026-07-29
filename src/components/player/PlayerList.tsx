'use client'

import { Player } from '@/common/types'
import { useEffect, useState } from 'react'

type PlayerListProps = {
    onRefresh?: () => void
}

const PlayerList = ({ onRefresh }: PlayerListProps) => {
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
            {players.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '0.5rem 0' }}>Name</th>
                            <th style={{ padding: '0.5rem 0' }}>UUID</th>
                            <th style={{ padding: '0.5rem 0' }}>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => (
                            <tr key={player.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem 0' }}>{player.name}</td>
                                <td style={{ padding: '0.5rem 0', fontFamily: 'monospace' }}>
                                    {player.uuid}
                                </td>
                                <td style={{ padding: '0.5rem 0' }}>
                                    {new Date(player.createdAt).toLocaleString()}
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
