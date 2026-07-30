'use client'

import PageShell from '@/components/common/PageShell'
import { SectionLinkRow } from '@/components/common'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import { useEventForm } from './hooks/useEventForm'

const inputStyle = {
    padding: '0.75rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.25)',
    background: '#1a1a1a',
    color: '#fff',
}

const EventAddNew = () => {
    const { activeOrganizer } = useSelectedRolesContext()
    const {
        form,
        errors,
        submitting,
        message,
        organizers,
        gameTypes,
        loadingOptions,
        updateField,
        handleSubmit,
        getFormatOptions,
    } = useEventForm(activeOrganizer?.id)

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
                        <span style={{ fontWeight: 600 }}>Game type</span>
                        <select
                            value={form.gameType}
                            onChange={(event) => updateField('gameType', event.target.value)}
                            style={inputStyle}
                        >
                            <option value="">Select a game type</option>
                            {gameTypes.map((gameType) => (
                                <option key={gameType.id} value={gameType.id}>
                                    {gameType.name}
                                </option>
                            ))}
                        </select>
                        {errors.gameType ? (
                            <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                {errors.gameType}
                            </span>
                        ) : null}
                    </label>

                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Start date</span>
                        <input
                            type="datetime-local"
                            value={form.startAt}
                            onChange={(event) => updateField('startAt', event.target.value)}
                            style={inputStyle}
                        />
                        {errors.startAt ? (
                            <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                {errors.startAt}
                            </span>
                        ) : null}
                    </label>

                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Player capacity</span>
                        <input
                            type="number"
                            min={1}
                            max={30}
                            value={form.playerCapacity}
                            onChange={(event) => updateField('playerCapacity', event.target.value)}
                            style={inputStyle}
                        />
                        {errors.playerCapacity ? (
                            <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                {errors.playerCapacity}
                            </span>
                        ) : null}
                    </label>

                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Duration (minutes)</span>
                        <input
                            type="number"
                            min={1}
                            value={form.durationInMins}
                            onChange={(event) => updateField('durationInMins', event.target.value)}
                            style={inputStyle}
                        />
                        {errors.durationInMins ? (
                            <span style={{ color: 'red', fontSize: '0.9rem' }}>
                                {errors.durationInMins}
                            </span>
                        ) : null}
                    </label>

                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Format</span>
                        <select
                            value={form.format}
                            onChange={(event) => updateField('format', event.target.value)}
                            style={inputStyle}
                            disabled={!form.gameType || getFormatOptions().length === 0}
                        >
                            <option value="">Select a format</option>
                            {getFormatOptions().map((formatOption) => (
                                <option key={formatOption} value={formatOption}>
                                    {formatOption}
                                </option>
                            ))}
                        </select>
                    </label>

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
                            background: submitting ? '#444' : '#fff',
                            color: submitting ? '#ccc' : '#111',
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
                color="#111"
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
