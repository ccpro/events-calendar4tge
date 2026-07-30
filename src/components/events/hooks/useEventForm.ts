import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Organizer } from '@/common/types'
import { Game } from '@/app/common/types'

export type EventFormState = {
    organizer: string
    gameType: string
    startAt: string
    endAt: string
    durationInMins: string
    playerCapacity: string
}

export type EventFormErrors = Partial<Record<keyof EventFormState, string>>

export const initialFormState: EventFormState = {
    organizer: '',
    gameType: '',
    startAt: '',
    endAt: '',
    durationInMins: '60',
    playerCapacity: '4',
}

export const useEventForm = (initialOrganizerId?: number) => {
    const startingForm = initialOrganizerId
        ? { ...initialFormState, organizer: String(initialOrganizerId) }
        : initialFormState

    const [form, setForm] = useState<EventFormState>(startingForm)
    const [errors, setErrors] = useState<EventFormErrors>({})
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const [organizers, setOrganizers] = useState<Organizer[]>([])
    const [gameTypes, setGameTypes] = useState<Game[]>([])
    const [loadingOptions, setLoadingOptions] = useState(false)

    const selectedGame = gameTypes.find((game) => String(game.id) === form.gameType)
    const minCapacity = selectedGame ? Math.max(2, selectedGame.minPlayers) : 2

    useEffect(() => {
        const loadOptions = async () => {
            setLoadingOptions(true)

            try {
                const [organizerRes, gameTypeRes] = await Promise.all([
                    fetch('/api/organizer'),
                    fetch('/api/games'),
                ])

                const organizerData = await organizerRes.json().catch(() => ({}))
                const gameTypeData = await gameTypeRes.json().catch(() => ({}))

                setOrganizers(organizerData.organizers ?? [])
                setGameTypes(gameTypeData.games ?? [])
            } catch {
                setOrganizers([])
                setGameTypes([])
            } finally {
                setLoadingOptions(false)
            }
        }

        loadOptions()
    }, [])

    // keep the preselected organizer in sync if it becomes available after mount
    useEffect(() => {
        if (initialOrganizerId) {
            setForm((current) => ({ ...current, organizer: String(initialOrganizerId) }))
        }
    }, [initialOrganizerId])

    const validate = useCallback(() => {
        const nextErrors: EventFormErrors = {}
        const playerCapacity = Number(form.playerCapacity)

        if (!form.organizer) {
            nextErrors.organizer = 'Organizer is required.'
        }

        if (!form.gameType) {
            nextErrors.gameType = 'Game type is required.'
        }

        if (!form.startAt) {
            nextErrors.startAt = 'Start date is required.'
        }

        if (!Number.isInteger(playerCapacity) || playerCapacity < 1 || playerCapacity > 30) {
            nextErrors.playerCapacity = 'Player capacity must be between 1 and 30.'
        }

        if (selectedGame && playerCapacity < selectedGame.minPlayers) {
            nextErrors.playerCapacity = `Player capacity must be at least ${selectedGame.minPlayers} for this game.`
        }

        return nextErrors
    }, [form.organizer, form.gameType, form.startAt, form.playerCapacity, selectedGame])

    const updateField = useCallback((field: keyof EventFormState, value: string) => {
        setForm((current) => {
            const nextForm = { ...current, [field]: value }

            if (field === 'gameType' && value) {
                if (selectedGame) {
                    const minimumCapacity = String(Math.max(1, selectedGame.minPlayers))
                    nextForm.playerCapacity = current.playerCapacity && Number(current.playerCapacity) >= Number(minimumCapacity)
                        ? current.playerCapacity
                        : minimumCapacity
                    nextForm.durationInMins = String(selectedGame.durationInMins)
                }
            }

            if (field === 'durationInMins') {
                nextForm.durationInMins = value
            }

            if (field === 'playerCapacity') {
                const capacityValue = Number(value)

                if (selectedGame && Number.isInteger(capacityValue) && capacityValue < selectedGame.minPlayers) {
                    nextForm.playerCapacity = String(selectedGame.minPlayers)
                } else {
                    nextForm.playerCapacity = value
                }
            }

            if ((field === 'gameType' && value) || field === 'startAt') {
                const startAtValue = field === 'startAt' ? value : current.startAt

                if (selectedGame && startAtValue) {
                    const durationMinutes = Number(nextForm.durationInMins || selectedGame.durationInMins)
                    const startDate = new Date(startAtValue)

                    if (!Number.isNaN(startDate.getTime()) && Number.isFinite(durationMinutes)) {
                        startDate.setMinutes(startDate.getMinutes() + durationMinutes)
                        nextForm.endAt = startDate.toISOString().slice(0, 16)
                    }
                } else {
                    nextForm.endAt = ''
                }
            }

            return nextForm
        })
        setErrors((current) => ({ ...current, [field]: undefined }))
    }, [gameTypes, selectedGame])

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
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
                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        organizer: Number(form.organizer),
                        gameType: Number(form.gameType),
                        startAt: form.startAt,
                        playerCapacity: Number(form.playerCapacity),
                        duration: Number(form.durationInMins || 0),
                    }),
                })

                const data = await response.json().catch(() => ({}))

                if (!response.ok) {
                    throw new Error(data.error || 'Unable to create event')
                }

                setMessage('Event created successfully.')
                setForm(
                    initialOrganizerId
                        ? { ...initialFormState, organizer: String(initialOrganizerId) }
                        : initialFormState,
                )
            } catch (error) {
                setMessage(error instanceof Error ? error.message : 'Unable to create event')
            } finally {
                setSubmitting(false)
            }
        },
        [form, validate, initialOrganizerId],
    )

    const submitForm = useCallback(() => {
        const formElement = document.querySelector('form') as HTMLFormElement | null

        if (formElement) {
            formElement.requestSubmit()
        }
    }, [])

    return {
        form,
        errors,
        submitting,
        message,
        organizers,
        gameTypes,
        loadingOptions,
        minCapacity,
        validate,
        updateField,
        handleSubmit,
        submitForm,
    }
}
