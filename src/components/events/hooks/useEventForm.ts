import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Organizer } from '@/common/types'
import { Game } from '@/common/types'

type GameTemplateField = {
    order?: number
    name?: string
    type?: string
    defaultValue?: unknown
    options?: string[]
}

type GameTemplate = {
    id: string
    name?: string
    description?: string
    fields?: Record<string, GameTemplateField>
}

export type EventFormState = {
    organizer: string
    gameType: string
    startAt: string
    playerCapacity: string
    durationInMins: string
    format: string
}

type FieldKey = 'startAt' | 'playerCapacity' | 'durationInMins' | 'minimumPlayers' | 'format'

const DEFAULT_GAME_TEMPLATE: GameTemplate = {
    id: 'default',
    name: 'Default',
    fields: {
        "startAt": {
            order: 1,
            name: 'Start Date',
            type: 'datetime-utc',
        },
        "playerCapacity": {
            order: 2,
            name: 'Player Capacity',
            type: 'number',
            defaultValue: 4,
        },
        "durationInMins": {
            order: 3,
            name: 'Duration',
            type: 'number',
            defaultValue: 60,
        },
    },
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
    const [games, setGames] = useState<Game[]>([])
    const [gameTemplates, setGameTemplates] = useState<GameTemplate[]>([])
    const [loadingOptions, setLoadingOptions] = useState(false)

    useEffect(() => {
        const loadOptions = async () => {
            setLoadingOptions(true)

            try {
                const [organizerRes, gameTypeRes, gameTemplatesRes] = await Promise.all([
                    Promise.resolve(fetch('/api/organizer')).catch(() => undefined),
                    Promise.resolve(fetch('/api/games')).catch(() => undefined),
                    Promise.resolve(fetch('/api/games-templates')).catch(() => undefined),
                ])

                const organizerData = organizerRes ? await organizerRes.json().catch(() => ({})) : {}
                const gamesData = gameTypeRes ? await gameTypeRes.json().catch(() => ({})) : {}
                const gameTemplatesData = gameTemplatesRes ? await gameTemplatesRes.json().catch(() => ({})) : {}



                setOrganizers(organizerData.organizers ?? [])
                setGames(gamesData.games ?? gamesData.gameTypes ?? [])
                setGameTemplates(gameTemplatesData.templates ?? [])
            } catch {
                setOrganizers([])
                setGames([])
                setGameTemplates([])
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

    const getSelectedTemplate = useCallback((): GameTemplate => {
        if (!form.gameType) {
            return DEFAULT_GAME_TEMPLATE
        }

        const selectedGame = games.find((gameType) => String(gameType.id) === form.gameType)
        return gameTemplates.find((template) => template.id === selectedGame?.template) ?? DEFAULT_GAME_TEMPLATE
    }, [form.gameType, gameTemplates, games])

    const validate = useCallback(() => {
        const nextErrors: EventFormErrors = {}
        const selectedTemplate = getSelectedTemplate()
        const playerCapacity = Number(form.playerCapacity)
        const durationInMins = Number(form.durationInMins)

        if (!form.organizer) {
            nextErrors.organizer = 'Organizer is required.'
        }

        if (!form.gameType) {
            nextErrors.gameType = 'Game type is required.'
        }

        const templateFields = (selectedTemplate.fields ?? {}) as Record<string, GameTemplateField>

        if (templateFields['startAt']) {
            if (!form.startAt) {
                nextErrors.startAt = 'Start date is required.'
            } else {
                const selectedStartAt = new Date(form.startAt)
                const now = new Date()

                if (Number.isNaN(selectedStartAt.getTime())) {
                    nextErrors.startAt = 'Start date is invalid.'
                } else if (selectedStartAt.getTime() < now.getTime()) {
                    nextErrors.startAt = 'Start date cannot be in the past.'
                }
            }
        }

        if (templateFields['playerCapacity']) {
            if (!Number.isInteger(playerCapacity) || playerCapacity < 1 || playerCapacity > 30) {
                nextErrors.playerCapacity = 'Player capacity must be between 1 and 30.'
            }
        }

        if (templateFields.duration) {
            if (!Number.isInteger(durationInMins) || durationInMins < 1) {
                nextErrors.durationInMins = 'Duration must be at least 1 minute.'
            }
        }

        if (templateFields.format) {
            if (!form.format) {
                nextErrors.format = 'Format is required.'
            }
        }

        return nextErrors
    }, [form.organizer, form.gameType, form.startAt, form.playerCapacity, form.durationInMins, form.format, getSelectedTemplate])

    const updateField = useCallback((field: keyof EventFormState, value: string) => {
        setForm((current) => {
            const nextState = { ...current, [field]: value }

            if (field === 'gameType') {
                const selectedGame = games.find((gameType) => String(gameType.id) === value)
                const selectedTemplate = gameTemplates.find((template) => template.id === selectedGame?.template) ?? DEFAULT_GAME_TEMPLATE

                if (selectedGame) {

                    if (selectedGame.minimumPlayers !== undefined && (!current.playerCapacity || current.playerCapacity === String(initialFormState.playerCapacity))) {
                        nextState.playerCapacity = String(selectedGame.minimumPlayers)
                    }

                    if (selectedGame.durationInMins !== undefined) {
                        nextState.durationInMins = String(selectedGame.durationInMins)
                    }

                    if (selectedGame.format) {
                        const [firstFormat] = getFormatOptionsFromGame(selectedGame, selectedTemplate)
                        nextState.format = firstFormat ?? ''
                    }

                    if (selectedTemplate?.fields) {
                        const startDateField = selectedTemplate.fields?.['startAt']
                        const playerCapacityField = selectedTemplate.fields?.['playerCapacity']
                        const minimumPlayersField = selectedTemplate.fields?.['minimumPlayers']
                        const durationField = selectedTemplate.fields?.duration
                        const formatField = selectedTemplate.fields?.format

                        const startDateValue = startDateField?.defaultValue ?? startDateField?.['defaultValue']
                        const playerCapacityValue = playerCapacityField?.defaultValue ?? playerCapacityField?.['defaultValue']
                        const minimumPlayersValue = minimumPlayersField?.defaultValue ?? minimumPlayersField?.['defaultValue']
                        const durationValue = durationField?.defaultValue ?? durationField?.['defaultValue']
                        const formatValue = formatField?.defaultValue ?? formatField?.['defaultValue']

                        if (startDateValue !== undefined && startDateValue !== null) {
                            nextState.startAt = String(startDateValue)
                        }

                        if (playerCapacityValue !== undefined && playerCapacityValue !== null && (!nextState.playerCapacity || nextState.playerCapacity === String(initialFormState.playerCapacity))) {
                            nextState.playerCapacity = String(playerCapacityValue)
                        }

                        if (durationValue !== undefined && durationValue !== null && (!nextState.durationInMins || nextState.durationInMins === String(initialFormState.durationInMins))) {
                            nextState.durationInMins = String(durationValue)
                        }

                        if (formatValue !== undefined && formatValue !== null && (!nextState.format || nextState.format === initialFormState.format)) {
                            nextState.format = String(formatValue)
                        }
                    }
                }
            }

            return nextState
        })
        setErrors((current) => ({ ...current, [field]: undefined }))
    }, [gameTemplates, games])

    useEffect(() => {
        if (!form.gameType) {
            return
        }

        const selectedGame = games.find((gameType) => String(gameType.id) === form.gameType)
        const selectedTemplate = gameTemplates.find((template) => template.id === selectedGame?.template) ?? DEFAULT_GAME_TEMPLATE

        if (selectedGame) {
            setForm((current) => {
                const nextState = { ...current }

                if (selectedGame.minimumPlayers !== undefined && (!current.playerCapacity || current.playerCapacity === String(initialFormState.playerCapacity))) {
                    nextState.playerCapacity = String(selectedGame.minimumPlayers)
                }

                if (selectedGame.durationInMins !== undefined && (!current.durationInMins || current.durationInMins === initialFormState.durationInMins)) {
                    nextState.durationInMins = String(selectedGame.durationInMins)
                }

                if (selectedGame.format && (!current.format || current.format === initialFormState.format)) {
                    const [firstFormat] = getFormatOptionsFromGame(selectedGame, selectedTemplate)
                    nextState.format = firstFormat ?? ''
                }

                if (selectedTemplate?.fields) {
                    const startDateField = selectedTemplate.fields?.['startAt']
                    const playerCapacityField = selectedTemplate.fields?.['playerCapacity']
                    const minimumPlayersField = selectedTemplate.fields?.['minimumPlayers']
                    const durationField = selectedTemplate.fields?.duration
                    const formatField = selectedTemplate.fields?.format

                    const startDateValue = startDateField?.defaultValue ?? startDateField?.['defaultValue']
                    const playerCapacityValue = playerCapacityField?.defaultValue ?? playerCapacityField?.['defaultValue']
                    const minimumPlayersValue = minimumPlayersField?.defaultValue ?? minimumPlayersField?.['defaultValue']
                    const durationValue = durationField?.defaultValue ?? durationField?.['defaultValue']
                    const formatValue = formatField?.defaultValue ?? formatField?.['defaultValue']

                    if (startDateValue !== undefined && startDateValue !== null && (!current.startAt || current.startAt === initialFormState.startAt)) {
                        nextState.startAt = String(startDateValue)
                    }

                    if (playerCapacityValue !== undefined && playerCapacityValue !== null && (!nextState.playerCapacity || nextState.playerCapacity === String(initialFormState.playerCapacity))) {
                        nextState.playerCapacity = String(playerCapacityValue)
                    }

                    if (durationValue !== undefined && durationValue !== null && (!nextState.durationInMins || nextState.durationInMins === String(initialFormState.durationInMins))) {
                        nextState.durationInMins = String(durationValue)
                    }

                    if (formatValue !== undefined && formatValue !== null && (!nextState.format || nextState.format === initialFormState.format)) {
                        nextState.format = String(formatValue)
                    }
                }

                return nextState
            })
        }
    }, [form.gameType, gameTemplates, games])

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
                        format: form.format,
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

        const selectedGame = games.find((gameType) => String(gameType.id) === form.gameType)
        const selectedTemplate = gameTemplates.find((template) => template.id === selectedGame?.template) ?? DEFAULT_GAME_TEMPLATE

        return getFormatOptionsFromGame(selectedGame, selectedTemplate)
    }, [form.gameType, games, gameTemplates])

    return {
        form,
        errors,
        submitting,
        message,
        organizers,
        games,
        gameTemplates,
        loadingOptions,
        validate,
        updateField,
        handleSubmit,
        getFormatOptions,
        getSelectedTemplate,
    }
}

const getFormatOptionsFromGame = (game: Game | undefined, template: GameTemplate | undefined): string[] => {
    const formatField = template?.fields?.format
    const templateOptions = formatField?.options

    if (templateOptions && templateOptions.length > 0) {
        return templateOptions.map((item) => item.trim()).filter(Boolean)
    }

    if (!game?.format) {
        return []
    }

    return game.format
        .split('|')
        .map((item) => item.trim())
        .filter(Boolean)
}