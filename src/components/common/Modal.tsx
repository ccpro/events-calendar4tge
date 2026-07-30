'use client'

import { ReactNode } from 'react'

type ModalProps = {
    open: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

const Modal = ({ open, onClose, title, children }: ModalProps) => {
    if (!open) {
        return null
    }

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff',
                    color: '#111',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    minWidth: '320px',
                    maxWidth: '90vw',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        gap: '1rem',
                    }}
                >
                    {title ? <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h2> : <span />}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            border: 'none',
                            background: 'transparent',
                            fontSize: '1.5rem',
                            lineHeight: 1,
                            cursor: 'pointer',
                            color: '#111',
                        }}
                    >
                        &times;
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal
