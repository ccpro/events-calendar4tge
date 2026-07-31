'use client'

import { useEffect, useState } from 'react'
import { PageShell } from '../common'

type PlayerRegistrationFormProps = {
    uuid: string
}

const PlayerRegistrationForm = ({ uuid }: PlayerRegistrationFormProps) => {
    const [status, setStatus] = useState<string>('')

    const handleAssign = async () => {
        setStatus('')

        try {
            const response = await fetch(`/api/player/${uuid}`)

            const data = await response.json().catch(() => {})

            if (!response.ok) {
                console.log('response', response)
                throw new Error(data?.error ?? `Request failed with status ${response.status}`)
            }

            setStatus(
                `Success: ${data?.success ? 'Player assigned to the event. You may close the page.' : 'Assignment completed.'}`,
            )
        } catch (error) {
            setStatus(
                error instanceof Error ? error.message : 'Unable to assign player to this event.',
            )
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

export default PlayerRegistrationForm
