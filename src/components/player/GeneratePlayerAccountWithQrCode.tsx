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

    const registration_form = `http://${ip}:3000/register/player/${uuid}`
    const registration_api = ip ? `http://${ip}:3000/api/player/${uuid}` : undefined

    const handleRegister = async () => {
        if (!uuid) {
            return
        }

        setIsRegistering(true)

        try {
            const response = await fetch(registration_api!)
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
            {registration_api ? (
                <Link href={registration_form} onClick={handleRegister}>
                    {registration_form}
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
                value={registration_form || 'https://example.com'}
                size={256}
                bgColor="white"
                fgColor="black"
                level="H"
            />
        </div>
    )
}

export default GeneratePlayerAccountWithQrCode
