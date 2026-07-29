'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

type SectionLinkRowProps = {
    links: Array<{ href: string; label: string; color?: string }>
    color?: string
    children?: ReactNode
}

const SectionLinkRow = ({ links, color = '#fff', children }: SectionLinkRowProps) => {
    return (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {children}
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
    )
}

export default SectionLinkRow
