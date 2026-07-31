'use client'

import PageShell from '@/components/common/PageShell'
import { SectionLinkRow } from '@/components/common'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import { useEventForm } from './hooks/useEventForm'

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.25)',
    background: 'black',
    color: 'white',
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

                    {visibleFieldKeys.map((fieldKey) => {
                        const field = selectedTemplateFields[fieldKey]
                        const label = field?.name || fieldKey

                        if (fieldKey === 'startAt') {
                            return (
                                <label key={fieldKey} style={{ display: 'grid', gap: '0.35rem' }}>
                                    <span style={{ fontWeight: 600 }}>{label}</span>
                                    <input
                                        type="datetime-local"
                                        value={form.startAt}
                                        onChange={(event) =>
                                            updateField('startAt', event.target.value)
                                        }
                                        style={inputStyle}
                                    />
                                    {errors.startAt ? (
                                        <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                            {errors.startAt}
                                        </span>
                                    ) : null}
                                </label>
                            )
                        }

                        if (fieldKey === 'playerCapacity') {
                            return (
                                <label key={fieldKey} style={{ display: 'grid', gap: '0.35rem' }}>
                                    <span
                                        style={{ fontWeight: 600 }}
                                    >{`${label} (minimum 2 players)`}</span>
                                    <input
                                        type="number"
                                        min={2}
                                        max={30}
                                        value={form.playerCapacity}
                                        onChange={(event) =>
                                            updateField('playerCapacity', event.target.value)
                                        }
                                        style={inputStyle}
                                    />
                                    {errors.playerCapacity ? (
                                        <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                            {errors.playerCapacity}
                                        </span>
                                    ) : null}
                                </label>
                            )
                        }

                        if (fieldKey === 'durationInMins') {
                            return (
                                <label key={fieldKey} style={{ display: 'grid', gap: '0.35rem' }}>
                                    <span style={{ fontWeight: 600 }}>{label}</span>
                                    <input
                                        type="number"
                                        min={1}
                                        value={form.durationInMins}
                                        onChange={(event) =>
                                            updateField('durationInMins', event.target.value)
                                        }
                                        style={inputStyle}
                                    />
                                    {errors.durationInMins ? (
                                        <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                            {errors.durationInMins}
                                        </span>
                                    ) : null}
                                </label>
                            )
                        }

                        if (fieldKey === 'format') {
                            const formatOptions = getFormatOptions()
                            return (
                                <label key={fieldKey} style={{ display: 'grid', gap: '0.35rem' }}>
                                    <span style={{ fontWeight: 600 }}>{label}</span>
                                    <select
                                        value={form.format}
                                        onChange={(event) =>
                                            updateField('format', event.target.value)
                                        }
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
                                    {errors.format ? (
                                        <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                            {errors.format}
                                        </span>
                                    ) : null}
                                </label>
                            )
                        }

                        return null
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
