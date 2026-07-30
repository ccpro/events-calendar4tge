'use client'

import PageShell from '@/components/common/PageShell'
import { SectionLinkRow, SubmitButton } from '@/components/common'
import { useSelectedRolesContext } from '@/context/SelectedRoles/SelectedRolesContext'
import { useEventForm } from './hooks/useEventForm'
import { formatDate } from '@/app/common/dateUtils'

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
        minCapacity,
        updateField,
        handleSubmit,
        submitForm,
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
                            <option value="">Event organizer</option>
                            {organizers.map((organizer) => (
                                <option key={organizer.id} value={organizer.id}>
                                    {organizer.name}
                                </option>
                            ))}
                        </select>
                        {errors.organizer ? (
                            <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
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
                            <option value="">Select a game for event</option>
                            {gameTypes.map((game) => (
                                <option key={game.id} value={game.id}>
                                    {game.name}
                                </option>
                            ))}
                        </select>
                        {errors.gameType ? (
                            <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
                                {errors.gameType}
                            </span>
                        ) : null}
                    </label>

                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Event start date</span>
                        <input
                            type="datetime-local"
                            value={form.startAt}
                            onChange={(event) => updateField('startAt', event.target.value)}
                            style={inputStyle}
                        />
                        {errors.startAt ? (
                            <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
                                {errors.startAt}
                            </span>
                        ) : null}
                    </label>

                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Duration in minutes</span>
                        <input
                            type="number"
                            min={1}
                            max={1440}
                            step={1}
                            value={form.durationInMins}
                            onChange={(event) => updateField('durationInMins', event.target.value)}
                            style={inputStyle}
                        />
                    </label>

                    <label style={{ display: 'grid', gap: '0.35rem' }}>
                        <span style={{ fontWeight: 600 }}>Event player capacity</span>
                        <input
                            type="number"
                            min={minCapacity}
                            max={30}
                            value={form.playerCapacity}
                            onChange={(event) => updateField('playerCapacity', event.target.value)}
                            style={inputStyle}
                        />
                        {errors.playerCapacity ? (
                            <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
                                {errors.playerCapacity}
                            </span>
                        ) : null}
                    </label>

                    {message ? (
                        <p
                            style={{
                                margin: 0,
                                color: message.includes('successfully') ? '#b8f5c0' : '#ffb4b4',
                            }}
                        >
                            {message}
                        </p>
                    ) : null}

                    <SubmitButton
                        disabled={submitting}
                        onClick={submitForm}
                        cta_text_enabled="Create Event"
                        cta_text_disabled="Creating..."
                    />
                </form>
            )}

            <SectionLinkRow
                color="#000"
                links={[
                    { href: '/events', label: 'Back to events' },
                    { href: '/', label: 'Back home' },
                ]}
            />
        </PageShell>
    )
}

export default EventAddNew
