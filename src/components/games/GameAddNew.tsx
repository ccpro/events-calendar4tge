'use client'

import { PageShell, SectionLinkRow, SubmitButton } from '@/components/common'
import { useGameTypeForm } from './hooks/useGameTypeForm'

const GameAddNew = () => {
    const { form, errors, submitting, message, updateField, handleSubmit } = useGameTypeForm()

    return (
        <PageShell
            eyebrow="Game Types"
            title="Add New Game Type"
            description="Create a reusable game template for future events."
            links={[
                { href: '/', label: 'Back home' },
                { href: '/games', label: 'Back to games' },
                { href: '/events', label: 'Back to events' },
            ]}
            maxWidth="720px"
        >
            <form
                onSubmit={handleSubmit}
                style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}
            >
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Name</span>
                    <input
                        value={form.name}
                        onChange={(event) => updateField('name', event.target.value)}
                        placeholder="e.g. Magic: The Gathering"
                        style={{
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.25)',
                            background: '#1a1a1a',
                            color: '#fff',
                        }}
                    />
                    {errors.name ? (
                        <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>{errors.name}</span>
                    ) : null}
                </label>

                <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Description</span>
                    <textarea
                        value={form.description}
                        onChange={(event) => updateField('description', event.target.value)}
                        placeholder="Describe the game type"
                        rows={4}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.25)',
                            background: '#1a1a1a',
                            color: '#fff',
                            resize: 'vertical',
                        }}
                    />
                </label>

                <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Template</span>
                    <input
                        value={form.template}
                        onChange={(event) => updateField('template', event.target.value)}
                        placeholder="e.g. mtg-template"
                        style={{
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.25)',
                            background: '#1a1a1a',
                            color: '#fff',
                        }}
                    />
                    {errors.template ? (
                        <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
                            {errors.template}
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
                        style={{
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.25)',
                            background: '#1a1a1a',
                            color: '#fff',
                        }}
                    />
                    {errors.durationInMins ? (
                        <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
                            {errors.durationInMins}
                        </span>
                    ) : null}
                </label>

                <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Minimum players</span>
                    <input
                        type="number"
                        min={1}
                        value={form.minimumPlayers}
                        onChange={(event) => updateField('minimumPlayers', event.target.value)}
                        style={{
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.25)',
                            background: '#1a1a1a',
                            color: '#fff',
                        }}
                    />
                    {errors.minimumPlayers ? (
                        <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
                            {errors.minimumPlayers}
                        </span>
                    ) : null}
                </label>

                <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>
                        Format (use pipe <code>'|'</code> as format separator)
                    </span>
                    <input
                        value={form.format}
                        onChange={(event) => updateField('format', event.target.value)}
                        placeholder="e.g. Standard|Commander"
                        style={{
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.25)',
                            background: '#1a1a1a',
                            color: '#fff',
                        }}
                    />
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
                    cta_text_enabled="Create new game"
                    cta_text_disabled="Creating..."
                    onClick={() => handleSubmit({ preventDefault: () => undefined })}
                ></SubmitButton>
            </form>
        </PageShell>
    )
}

export default GameAddNew
