'use client'

import { Organizer } from '@/common/types'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import { useEffect, useState } from 'react'

const OrganizerList = () => {
    const { activeOrganizer, setActiveOrganizer } = useSelectedRolesContext()
    const [organizers, setOrganizers] = useState<Organizer[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadOrganizers = async () => {
            try {
                const response = await fetch('/api/organizer')

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                const data = await response.json()
                setOrganizers(data.organizers ?? [])
                setError(null)
            } catch (err) {
                setOrganizers([])
                setError(err instanceof Error ? err.message : 'Unable to load organizers')
            }
        }

        loadOrganizers()
    }, [])

    return (
        <>
            <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
                Select an organizer to activate their workspace.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Organizers</h2>
                {error ? (
                    <p style={{ opacity: 0.9, color: '#312222' }}>{error}</p>
                ) : organizers.length > 0 ? (
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        {organizers.map((organizer) => {
                            const isActive = organizer.id === activeOrganizer?.id

                            return (
                                <button
                                    key={organizer.id}
                                    type="button"
                                    onClick={() => setActiveOrganizer(organizer)}
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.85rem 1rem',
                                        borderRadius: '12px',
                                        border: isActive
                                            ? '2px solid #290909'
                                            : '1px solid rgba(0,0,0,0.2)',
                                        background: isActive
                                            ? 'rgba(255,255,255,0.15)'
                                            : 'rgba(255,255,255,0.08)',
                                        color: '#160505',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{ fontWeight: 600 }}>
                                        {isActive ? '✅ ' : ''}
                                        {organizer.name}
                                    </div>
                                    <div
                                        style={{
                                            opacity: 0.8,
                                            fontSize: '0.9rem',
                                            marginTop: '0.25rem',
                                        }}
                                    >
                                        {organizer.uuid}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <p style={{ opacity: 0.75 }}>No organizers found.</p>
                )}
            </div>
        </>
    )
}

export default OrganizerList
