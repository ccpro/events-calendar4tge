'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type PageShellProps = {
    title: string
    eyebrow?: string
    description?: ReactNode
    children: ReactNode
    links?: Array<{ href: string; label: string; color?: string }>
    background?: string
    color?: string
    maxWidth?: string
}

const PageShell = ({
    title,
    eyebrow,
    description,
    children,
    links = [],
    background = '#111',
    color = '#fff',
    maxWidth = '70rem',
}: PageShellProps) => {
    return (
        <main style={{ minHeight: '100vh', padding: '3rem', fontFamily: 'var(--font-geist-sans)' }}>
            <section
                style={{
                    maxWidth,
                    margin: '0 auto',
                    padding: '2rem',
                    borderRadius: '24px',
                    background,
                    color,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                }}
            >
                {eyebrow ? (
                    <p
                        style={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.2em',
                            opacity: 0.75,
                        }}
                    >
                        {eyebrow}
                    </p>
                ) : null}
                <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 1rem' }}>{title}</h1>
                {description ? (
                    <div style={{ lineHeight: 1.7, opacity: 0.9 }}>{description}</div>
                ) : null}

                {children}

                {links.length > 0 ? (
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            marginTop: '1.5rem',
                            flexWrap: 'wrap',
                        }}
                    >
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{ color: link.color ?? color, textDecoration: 'underline' }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                ) : null}
            </section>
        </main>
    )
}

export default PageShell
