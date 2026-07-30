import { FormEvent, useCallback, useState } from 'react'

type SubmitEventLike = Pick<FormEvent<HTMLFormElement>, 'preventDefault'>

export type GameTypeFormState = {
    name: string
    description: string
    template: string
    durationInMins: string
    minimumPlayers: string
    format: string
}

export type GameTypeFormErrors = Partial<Record<keyof GameTypeFormState, string>>

export const initialFormState: GameTypeFormState = {
    name: '',
    description: '',
    template: '',
    durationInMins: '60',
    minimumPlayers: '2',
    format: 'standard',
}

export const useGameTypeForm = () => {
    const [form, setForm] = useState<GameTypeFormState>(initialFormState)
    const [errors, setErrors] = useState<GameTypeFormErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const validate = useCallback(() => {
        const nextErrors: GameTypeFormErrors = {}
        const name = form.name.trim()
        const template = form.template.trim()

        if (!name) {
            nextErrors.name = 'Name is required.'
        } else if (name.length < 2) {
            nextErrors.name = 'Name must be at least 2 characters long.'
        }

        if (!template) {
            nextErrors.template = 'Template is required.'
        } else if (!/^[a-z0-9-]+$/i.test(template)) {
            nextErrors.template = 'Template can only contain letters, numbers, and hyphens.'
        }

        const durationInMins = Number(form.durationInMins)
        if (!Number.isInteger(durationInMins) || durationInMins < 1) {
            nextErrors.durationInMins = 'Duration must be at least 1 minute.'
        }

        const minimumPlayers = Number(form.minimumPlayers)
        if (!Number.isInteger(minimumPlayers) || minimumPlayers < 1) {
            nextErrors.minimumPlayers = 'Minimum players must be at least 1.'
        }

        return nextErrors
    }, [form.durationInMins, form.minimumPlayers, form.name, form.template])

    const updateField = useCallback((field: keyof GameTypeFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }))
        setErrors((current) => ({ ...current, [field]: undefined }))
    }, [])

    const handleSubmit = useCallback(
        async (event: SubmitEventLike) => {
            event.preventDefault()

            const nextErrors = validate()
            setErrors(nextErrors)

            if (Object.keys(nextErrors).length > 0) {
                setMessage(null)
                return
            }

            setSubmitting(true)
            setMessage(null)

            try {
                const response = await fetch('/api/games', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        description: form.description.trim() || null,
                        template: form.template.trim(),
                        durationInMins: Number(form.durationInMins),
                        minimumPlayers: Number(form.minimumPlayers),
                        format: form.format.trim() || null,
                    }),
                })

                const data = await response.json().catch(() => ({}))

                if (!response.ok) {
                    throw new Error(data.error || 'Unable to create game type')
                }

                setMessage('Game type created successfully.')
                setForm(initialFormState)
            } catch (error) {
                setMessage(error instanceof Error ? error.message : 'Unable to create game type')
            } finally {
                setSubmitting(false)
            }
        },
        [form.description, form.durationInMins, form.format, form.minimumPlayers, form.name, form.template, validate],
    )

    return {
        form,
        errors,
        submitting,
        message,
        validate,
        updateField,
        handleSubmit,
    }
}
