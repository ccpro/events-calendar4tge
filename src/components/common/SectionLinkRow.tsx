'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type SectionLinkRowProps = {
    background?: string
    links: Array<{
        href: string
        label: string
        color?: string
        background?: string
        className?: string
    }>
    color?: string
    className?: string
    children?: ReactNode
}

const SectionLinkRow = ({
    links,
    color = 'white',
    background = 'transparent',
    className,
    children,
}: SectionLinkRowProps) => {
    return (
        <div
            className={className}
            style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}
        >
            {children}
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={link.className}
                    style={
                        link.className
                            ? undefined
                            : {
                                  color: link.color ?? color,
                                  background: link.background ?? background,
                                  textDecoration: 'underline',
                              }
                    }
                >
                    {link.label}
                </Link>
            ))}
        </div>
    )
}

export default SectionLinkRow
