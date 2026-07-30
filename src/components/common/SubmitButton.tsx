'use client'

import type { Event } from '@/app/common/types'

type SubmitButtonProps = {
    disabled: boolean
    onClick: () => void
    cta_text_enabled: string
    cta_text_disabled: string
}

const SubmitButton = ({
    disabled,
    onClick,
    cta_text_enabled,
    cta_text_disabled,
}: SubmitButtonProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #111',
                background: disabled ? '#111' : 'transparent',
                color: disabled ? '#fff' : '#111',
                cursor: disabled ? 'not-allowed' : 'pointer',
            }}
        >
            {disabled ? cta_text_disabled : cta_text_enabled}
        </button>
    )
}

export default SubmitButton
