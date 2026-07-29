'use client'

import { SectionLinkRow } from '@/components/common'
import { useGameTypeForm } from './hooks/useGameTypeForm'

const GamesAddNewType = () => {
    const { form, errors, submitting, message, updateField, handleSubmit } = useGameTypeForm()

    return (
        <main style={{ minHeight: '100vh', padding: '3rem', fontFamily: 'var(--font-geist-sans)' }}>
            <section
                style={{
                    maxWidth: '720px',
                    margin: '0 auto',
                    padding: '2rem',
                    borderRadius: '24px',
                    background: '#111',
                    color: '#fff',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                }}
            >
                <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', opacity: 0.75 }}>
                    Game Types
                </p>
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>Add New Game Type</h1>
                <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
                    Create a reusable game template for future events.
                </p>

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
                            <span style={{ color: '#ffb4b4', fontSize: '0.9rem' }}>
                                {errors.name}
                            </span>
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
                        {submitting ? 'Creating...' : 'Create Game Type'}
                    </button>
                </form>

                <SectionLinkRow
                    color="#fff"
                    links={[
                        { href: '/games/type', label: 'Back to game types' },
                        { href: '/games', label: 'Back to games list' },
                        { href: '/', label: 'Back home' },
                    ]}
                />
            </section>
        </main>
    )
}

export default GamesAddNewType
