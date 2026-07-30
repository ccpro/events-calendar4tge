import Link from 'next/link'
import { useEffect, useState } from 'react'
import { QRCode } from 'react-qr-code'

type GeneratePlayerAccountWithQrCodeProps = {
    onRegister?: () => void
}

// crypto.randomUUID requires a secure context; fall back for LAN/HTTP dev access
const generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
        const random = (Math.random() * 16) | 0
        const value = char === 'x' ? random : (random & 0x3) | 0x8
        return value.toString(16)
    })
}

const GeneratePlayerAccountWithQrCode = ({ onRegister }: GeneratePlayerAccountWithQrCodeProps) => {
    const [ip, setIp] = useState('')
    const [error, setError] = useState<string | undefined>(undefined)
    const [isRegistering, setIsRegistering] = useState(false)
    const [uuid] = useState(() =>
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : generateUuid(),
    )

    useEffect(() => {
        const loadData = async () => {
            try {
                const [ipResponse] = await Promise.all([fetch('/api/ip')])
                const ipData = await ipResponse.json()
                setIp(ipData.ip)
            } catch {
                setError('Failed to fetch IP address.')
            }
        }

        loadData()
    }, [])

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>
    }

    const qr_registration_link = ip ? `http://${ip}:3000/api/register_player/${uuid}` : ''

    const handleRegister = async () => {
        if (!uuid) {
            return
        }

        setIsRegistering(true)

        try {
            const response = await fetch(`/api/register_player/${uuid}`)
            if (response.ok) {
                onRegister?.()
            }
        } catch {
            // ignore registration errors and let the UI surface the link as fallback
        } finally {
            setIsRegistering(false)
        }
    }

    return (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
            {qr_registration_link ? (
                <Link href={qr_registration_link} onClick={handleRegister}>
                    {qr_registration_link}
                </Link>
            ) : (
                <span style={{ opacity: 0.7 }}>Loading registration link...</span>
            )}
            <button
                type="button"
                onClick={handleRegister}
                disabled={isRegistering}
                style={{
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid black',
                    background: 'black',
                    color: 'white',
                    cursor: 'pointer',
                }}
            >
                {isRegistering ? 'Registering...' : 'Register player'}
            </button>
            <QRCode
                value={qr_registration_link || 'https://example.com'}
                size={256}
                bgColor="white"
                fgColor="black"
                level="H"
            />
        </div>
    )
}

export default GeneratePlayerAccountWithQrCode
