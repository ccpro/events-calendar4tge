'use client'

import { useEffect, useState } from 'react'
import { PageShell } from '../common'

type EventRegistrationFormProps = {
    eventId: string
    playerId: string
}

const EventRegistrationForm = ({ eventId, playerId }: EventRegistrationFormProps) => {
    const [status, setStatus] = useState<string>('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleAssign = async () => {
        setIsSubmitting(true)
        setStatus('')

        try {
            const response = await fetch(`/api/events/assign/${eventId}/${playerId}`, {
                method: 'POST',
            })

            const data = await response.json().catch(() => null)

            if (!response.ok) {
                throw new Error(data?.error ?? `Request failed with status ${response.status}`)
            }

            setStatus(
                `Success: ${data?.success ? 'Player assigned to the event. You may close the page.' : 'Assignment completed.'}`,
            )
        } catch (error) {
            setStatus(
                error instanceof Error ? error.message : 'Unable to assign player to this event.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        handleAssign()
    }, [])

    return (
        <PageShell eyebrow="Registration" title="Event Registration" maxWidth="720px">
            {status ? (
                <p
                    style={{
                        marginTop: '1rem',
                        color: status.startsWith('Success') ? 'green' : 'red',
                    }}
                >
                    {status}
                </p>
            ) : (
                'Assigning...'
            )}
        </PageShell>
    )
}

export default EventRegistrationForm
