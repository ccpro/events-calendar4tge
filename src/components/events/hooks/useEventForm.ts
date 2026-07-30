import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Organizer } from '@/common/types'
import { Game } from '@/common/types'

export type EventFormState = {
    organizer: string
    gameType: string
    startAt: string
    playerCapacity: string
    durationInMins: string
    format: string
}

export type EventFormErrors = Partial<Record<keyof EventFormState, string>>

export const initialFormState: EventFormState = {
    organizer: '',
    gameType: '',
    startAt: '',
    playerCapacity: '4',
    durationInMins: '60',
    format: '',
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
                setGameTypes(gameTypeData.gameTypes ?? gameTypeData.games ?? [])
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
        const durationInMins = Number(form.durationInMins)

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

        if (!Number.isInteger(durationInMins) || durationInMins < 1) {
            nextErrors.durationInMins = 'Duration must be at least 1 minute.'
        }

        return nextErrors
    }, [form.organizer, form.gameType, form.startAt, form.playerCapacity, form.durationInMins])

    const updateField = useCallback((field: keyof EventFormState, value: string) => {
        setForm((current) => {
            const nextState = { ...current, [field]: value }

            if (field === 'gameType') {
                const selectedGame = gameTypes.find((gameType) => String(gameType.id) === value)

                if (selectedGame) {
                    if (selectedGame.minimumPlayers !== undefined && (!current.playerCapacity || current.playerCapacity === String(initialFormState.playerCapacity))) {
                        nextState.playerCapacity = String(selectedGame.minimumPlayers)
                    }

                    if (selectedGame.durationInMins !== undefined) {
                        nextState.durationInMins = String(selectedGame.durationInMins)
                    }

                    if (selectedGame.format) {
                        const [firstFormat] = getFormatOptionsFromGame(selectedGame)
                        nextState.format = firstFormat ?? ''
                    }
                }
            }

            return nextState
        })
        setErrors((current) => ({ ...current, [field]: undefined }))
    }, [gameTypes])

    useEffect(() => {
        if (!form.gameType) {
            return
        }

        const selectedGame = gameTypes.find((gameType) => String(gameType.id) === form.gameType)

        if (selectedGame) {
            setForm((current) => {
                const nextState = { ...current }

                if (selectedGame.minimumPlayers !== undefined && (!current.playerCapacity || current.playerCapacity === String(initialFormState.playerCapacity))) {
                    nextState.playerCapacity = String(selectedGame.minimumPlayers)
                }

                if (selectedGame.durationInMins !== undefined && current.durationInMins === initialFormState.durationInMins) {
                    nextState.durationInMins = String(selectedGame.durationInMins)
                }

                if (selectedGame.format && (!current.format || current.format === initialFormState.format)) {
                    const [firstFormat] = getFormatOptionsFromGame(selectedGame)
                    nextState.format = firstFormat ?? ''
                }

                return nextState
            })
        }
    }, [form.gameType, gameTypes])

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
                        durationInMins: Number(form.durationInMins),
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

    const getFormatOptions = useCallback(() => {
        if (!form.gameType) {
            return []
        }

        const selectedGame = gameTypes.find((gameType) => String(gameType.id) === form.gameType)

        return selectedGame ? getFormatOptionsFromGame(selectedGame) : []
    }, [form.gameType, gameTypes])

    return {
        form,
        errors,
        submitting,
        message,
        organizers,
        gameTypes,
        loadingOptions,
        validate,
        updateField,
        handleSubmit,
        getFormatOptions,
    }
}

const getFormatOptionsFromGame = (game: Game): string[] => {
    if (!game.format) {
        return []
    }

    return game.format
        .split('|')
        .map((item) => item.trim())
        .filter(Boolean)
}
