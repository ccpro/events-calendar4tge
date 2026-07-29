'use client'

import { Organizer } from '@/app/common/types'
import { useEffect, useState } from 'react'

type OrganizerListProps = {
    activeOrganizerId?: number | null
    onSelectOrganizer?: (organizer: Organizer) => void
}

const OrganizerList = ({ activeOrganizerId, onSelectOrganizer }: OrganizerListProps) => {
    const [organizers, setOrganizers] = useState<Organizer[]>([])

    useEffect(() => {
        const loadOrganizers = async () => {
            try {
                const response = await fetch('/api/organizer')
                const data = await response.json()
                setOrganizers(data.organizers ?? [])
            } catch {
                setOrganizers([])
            }
        }

        loadOrganizers()
    }, [])

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.75rem' }}>Organizers</h2>
            {organizers.length > 0 ? (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {organizers.map((organizer) => {
                        const isActive = organizer.id === activeOrganizerId

                        return (
                            <button
                                key={organizer.id}
                                type="button"
                                onClick={() => onSelectOrganizer?.(organizer)}
                                style={{
                                    textAlign: 'left',
                                    padding: '0.85rem 1rem',
                                    borderRadius: '12px',
                                    border: isActive
                                        ? '2px solid #fff'
                                        : '1px solid rgba(255,255,255,0.2)',
                                    background: isActive
                                        ? 'rgba(255,255,255,0.15)'
                                        : 'rgba(255,255,255,0.08)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ fontWeight: 600 }}>{organizer.name}</div>
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
    )
}

export default OrganizerList
