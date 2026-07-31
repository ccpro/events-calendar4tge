'use client'

import type { Event } from '@/common/types'

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
                border: '1px solid black',
                background: disabled ? 'black' : 'transparent',
                color: disabled ? 'white' : 'black',
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: 'fit-content',
            }}
        >
            {disabled ? cta_text_disabled : cta_text_enabled}
        </button>
    )
}

export default SubmitButton
