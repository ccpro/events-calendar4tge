import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Organizer } from '@/common/types'
import { Game } from '@/common/types'

type GameTemplateField = {
    order?: number
    name?: string
    type?: string
    min?: number,
    max?: number,
    defaultValue?: unknown
    options?: string[]
    required: boolean
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

const DEFAULT_GAME_TEMPLATE_FIELDS = {
    startAt: {
        order: 1,
        name: 'Start Date',
        type: 'datetime-local',
        required: true,
    },
    playerCapacity: {
        order: 2,
        name: 'Player Capacity',
        type: 'number',
        min: 2,
        max: 12,
        defaultValue: 4,
        required: true,
    },
    durationInMins: {
        order: 3,
        name: 'Duration',
        type: 'number',
        min: 15,
        max: 120,
        defaultValue: 60,
        required: true,
    },
    format: {
        order: 5,
        name: 'Format',
        type: 'select',
        options: ['Standard'],
        required: true,
    },
} as const satisfies Record<string, GameTemplateField>

const TEMPLATE_FIELD_KEYS = Object.keys(DEFAULT_GAME_TEMPLATE_FIELDS) as Array<keyof typeof DEFAULT_GAME_TEMPLATE_FIELDS>
type FieldKey = keyof EventFormState | (typeof TEMPLATE_FIELD_KEYS)[number]

const DEFAULT_GAME_TEMPLATE: GameTemplate = {
    id: 'default',
    name: 'Default',
    fields: DEFAULT_GAME_TEMPLATE_FIELDS,
}

export type EventFormErrors = Partial<Record<keyof EventFormState, string>>

type EventSubmitPayload = {
    organizer: number
    gameType: number
    [key: string]: string | number
}

type FormFieldValue = EventFormState[keyof EventFormState]

type TemplateFieldEntry = [string, GameTemplateField]

const getTemplateFieldEntries = (template: GameTemplate | undefined): TemplateFieldEntry[] => {
    const templateFields = (template?.fields ?? {}) as Record<string, GameTemplateField>
    return Object.entries(templateFields) as TemplateFieldEntry[]
}

const isTemplateFieldKey = (key: string): key is keyof EventFormState => {
    return key in initialFormState
}

const getFormValue = (form: EventFormState, key: string): FormFieldValue | undefined => {
    if (!isTemplateFieldKey(key)) {
        return undefined
    }

    return form[key]
}

const applyTemplateDefaults = (current: EventFormState, template: GameTemplate | undefined, force = false): EventFormState => {
    const nextState = { ...current }

    for (const [key, field] of getTemplateFieldEntries(template)) {
        if (!isTemplateFieldKey(key)) {
            continue
        }

        const fieldValue = field?.defaultValue ?? field?.['defaultValue']
        if (fieldValue === undefined || fieldValue === null) {
            continue
        }

        const shouldApplyDefault = force || !current[key] || current[key] === initialFormState[key]
        if (shouldApplyDefault) {
            nextState[key] = String(fieldValue) as EventFormState[typeof key]
        }
    }

    return nextState
}

// todo: populate initialFormState with template data/default values
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

    const getFormatOptionsFromGame = (game: Game | undefined, template: GameTemplate | undefined): string[] => {
        if (game?.format) {
            return game.format
                .split('|')
                .map((item) => item.trim())
                .filter(Boolean)
        }

        const formatField = template?.fields?.format
        const templateOptions = formatField?.options

        if (templateOptions && templateOptions.length > 0) {
            return templateOptions.map((item) => item.trim()).filter(Boolean)
        }

        return []
    }

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

        if (!form.organizer) {
            nextErrors.organizer = 'Organizer is required.'
        }

        if (!form.gameType) {
            nextErrors.gameType = 'Game type is required.'
        }

        for (const [key, field] of getTemplateFieldEntries(selectedTemplate)) {
            if (!isTemplateFieldKey(key)) {
                continue
            }

            const fieldValue = getFormValue(form, key)

            if (field?.required && !fieldValue) {
                nextErrors[key] = `${key} is required.`
            }

            if (field?.type === 'datetime-local' && field?.required) {
                const datetimeField = new Date(String(fieldValue ?? ''))
                const now = new Date()

                if (Number.isNaN(datetimeField.getTime())) {
                    nextErrors[key] = `${field?.name} is invalid.`
                } else if (datetimeField.getTime() < now.getTime()) {
                    nextErrors[key] = `${field?.name} cannot be in the past.`
                }
            }
            else if (field?.type === 'number' && field?.required) {
                const minValue = typeof field?.min === 'number' ? field.min : null
                const maxValue = typeof field?.max === 'number' ? field.max : null

                const value = Number(fieldValue ?? '')
                if (Number.isNaN(value)) {
                    nextErrors[key] = `${field?.name} must be a number.`
                } else {
                    if (minValue !== null && value < minValue) {
                        nextErrors[key] = `${field?.name} must be at least ${minValue}.`
                    }
                    if (maxValue !== null && value > maxValue) {
                        nextErrors[key] = `${field?.name} must be at most ${maxValue}.`
                    }
                }
            }
            else if (field?.type === 'select' && field?.required) {
                if (!fieldValue) {
                    nextErrors[key] = `${field?.name} is required.`
                }
            }
        }

        return nextErrors
    }, [getSelectedTemplate, games,
        form.organizer, form.gameType, form.startAt, form.format,
        ...Object.keys((getSelectedTemplate().fields ?? {}) as Record<string, GameTemplateField>)])

    const updateField = useCallback((field: FieldKey, value: string) => {
        setForm((current) => {
            const nextState = { ...current, [field]: value }

            if (field === 'gameType') {
                const selectedGame = games.find((gameType) => String(gameType.id) === value)
                const selectedTemplate = gameTemplates.find((template) => template.id === selectedGame?.template) ?? DEFAULT_GAME_TEMPLATE

                if (selectedGame) {
                    const nextStateWithDefaults = applyTemplateDefaults(
                        {
                            ...nextState,
                            durationInMins: selectedGame.durationInMins !== undefined ? String(selectedGame.durationInMins) : nextState.durationInMins,
                            format: selectedGame.format ? (getFormatOptionsFromGame(selectedGame, selectedTemplate)[0] ?? '') : nextState.format,
                        },
                        selectedTemplate,
                        true,
                    )

                    return nextStateWithDefaults
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

                if (selectedGame.durationInMins !== undefined && (!current.durationInMins || current.durationInMins === initialFormState.durationInMins)) {
                    nextState.durationInMins = String(selectedGame.durationInMins)
                }

                if (selectedGame.format && (!current.format || current.format === initialFormState.format)) {
                    const [firstFormat] = getFormatOptionsFromGame(selectedGame, selectedTemplate)
                    nextState.format = firstFormat ?? ''
                }

                return applyTemplateDefaults(nextState, selectedTemplate, false)
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

            const dataObject: EventSubmitPayload = {
                organizer: Number(form.organizer),
                gameType: Number(form.gameType),
            }

            for (const [key, field] of getTemplateFieldEntries(getSelectedTemplate())) {
                const fieldKey = key as keyof EventFormState

                if (field?.type === 'number' && field?.required) {
                    dataObject[key] = Number(form[fieldKey])
                }
                else {
                    dataObject[key] = form[fieldKey]
                }
            }

            try {
                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dataObject),
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
        gameTypes: games,
        gameTemplates,
        loadingOptions,
        validate,
        updateField,
        handleSubmit,
        getFormatOptions,
        getSelectedTemplate,
    }
}
