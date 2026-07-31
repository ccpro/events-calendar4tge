'use client'

import PageShell from '@/components/common/PageShell'
import { SectionLinkRow } from '@/components/common'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import { FieldKey, useEventForm } from './hooks/useEventForm'

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'black',
    color: 'white',
}

const renderField = ({
    fieldKey,
    label,
    field,
    form,
    errors,
    updateField,
    getFormatOptions,
}: {
    fieldKey: string
    label: string
    field: { type?: string; min?: number; max?: number } | undefined
    form: ReturnType<typeof useEventForm>['form']
    errors: ReturnType<typeof useEventForm>['errors']
    updateField: ReturnType<typeof useEventForm>['updateField']
    getFormatOptions: ReturnType<typeof useEventForm>['getFormatOptions']
}) => {
    const error = errors[fieldKey as keyof typeof errors]
    const value = form[fieldKey as keyof typeof form]
    const minValue = field?.min ?? 2
    const maxValue = field?.max ?? 30
    const fieldLabel =
        field?.type === 'number' ? `${label} (min ${minValue}, max ${maxValue})` : label

    if (field?.type === 'datetime-local') {
        return (
            <label key={fieldKey} style={{ display: 'grid', gap: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>{fieldLabel}</span>
                <input
                    type={field?.type}
                    value={value}
                    onChange={(event) => updateField(fieldKey as any, event.target.value)}
                    style={inputStyle}
                />
                {error ? <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span> : null}
            </label>
        )
    }

    if (field?.type === 'number') {
        return (
            <label key={fieldKey} style={{ display: 'grid', gap: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>{fieldLabel}</span>
                <input
                    type="number"
                    min={minValue}
                    max={maxValue}
                    value={value}
                    onChange={(event) => updateField(fieldKey as any, event.target.value)}
                    style={inputStyle}
                />
                {error ? <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span> : null}
            </label>
        )
    }

    if (field?.type === 'select') {
        const formatOptions = getFormatOptions()

        return (
            <label key={fieldKey} style={{ display: 'grid', gap: '0.35rem' }}>
                <span style={{ fontWeight: 600 }}>{fieldLabel}</span>
                <select
                    value={value}
                    onChange={(event) => updateField(fieldKey as any, event.target.value)}
                    style={inputStyle}
                    disabled={!form.gameType || formatOptions.length === 0}
                >
                    <option value="">Select a format</option>
                    {formatOptions.map((formatOption) => (
                        <option key={formatOption} value={formatOption}>
                            {formatOption}
                        </option>
                    ))}
                </select>
                {error ? <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span> : null}
            </label>
        )
    }

    console.error(`Unsupported field type: ${field?.type}`)

    return null
}

const EventAddNew = () => {
    const { activeOrganizer } = useSelectedRolesContext()
    const {
        form,
        errors,
        submitting,
        message,
        organizers,
        games,
        gameTemplates,
        loadingOptions,
        updateField,
        handleSubmit,
        getFormatOptions,
        getSelectedTemplate,
    } = useEventForm(activeOrganizer?.id)

    const selectedTemplateFields = (getSelectedTemplate?.() ?? {}).fields ?? {}
    const visibleFieldKeys = Object.entries(
        selectedTemplateFields as Record<string, { order?: number }>,
    )
        .sort(([, left], [, right]) => (left.order ?? 0) - (right.order ?? 0))
        .map(([key]) => key)

    const getGameOptionLabel = (game: { name: string; template?: string | null }) => {
        const matchingTemplate = gameTemplates.find((template) => template.id === game.template)
        const templateName = matchingTemplate?.name?.trim()

        return templateName ? `${game.name} (${templateName})` : `${game.name} (default-template)`
    }

    return (
        <PageShell
            eyebrow="Events"
            title="Add New Event"
            description="Schedule a new event for players to join."
        >
            {loadingOptions ? (
                <p style={{ marginTop: '1rem', opacity: 0.75 }}>Loading form options...</p>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}
                >
                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Organizer</span>
                        <select
                            value={form.organizer}
                            onChange={(event) => updateField('organizer', event.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Select an organizer</option>
                            {organizers.map((organizer) => (
                                <option key={organizer.id} value={organizer.id}>
                                    {organizer.name}
                                </option>
                            ))}
                        </select>
                        {errors.organizer ? (
                            <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                {errors.organizer}
                            </span>
                        ) : null}
                    </label>
                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Game</span>
                        <select
                            value={form.gameType}
                            onChange={(event) => updateField('gameType', event.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Select a game</option>
                            {games.map((game) => (
                                <option key={game.id} value={game.id}>
                                    {getGameOptionLabel(game)}
                                </option>
                            ))}
                        </select>
                        {errors.gameType ? (
                            <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                {errors.gameType}
                            </span>
                        ) : null}
                    </label>

                    {form.gameType &&
                        visibleFieldKeys.map((fieldKey) => {
                            const field = selectedTemplateFields[fieldKey]
                            const label = field?.name || fieldKey

                            return renderField({
                                fieldKey,
                                label,
                                field,
                                form,
                                errors,
                                updateField,
                                getFormatOptions,
                            })
                        })}
                    {message ? (
                        <p
                            style={{
                                margin: 0,
                                color: message.includes('successfully') ? 'green' : 'red',
                            }}
                        >
                            {message}
                        </p>
                    ) : null}
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            padding: '0.8rem 1rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: submitting ? '#444' : 'white',
                            color: submitting ? '#ccc' : 'black',
                            fontWeight: 700,
                            cursor: submitting ? 'not-allowed' : 'pointer',
                            width: 'fit-content',
                        }}
                    >
                        {submitting ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            )}

            <SectionLinkRow
                color="black"
                links={[
                    { href: '/', label: 'home' },
                    { href: '/events', label: 'Back to events' },
                    { href: '/calendar', label: 'Go to calendar' },
                ]}
            />
        </PageShell>
    )
}

export default EventAddNew
