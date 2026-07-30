import { useEffect, useState } from 'react'
import { QRCode } from 'react-qr-code'
import { randomUUID } from 'crypto'
import { SubmitButton } from '../common'

type GeneratePlayerAccountWithQrCodeProps = {
    onRegister?: (http_link: string) => void
}

// i know that's is bad practice, but it's necessary for LAN/HTTP dev access
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
    const [uuid] = useState(() =>
        typeof crypto !== 'undefined' && 'randomUUID' in crypto ? randomUUID() : generateUuid(),
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

    return (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
            {qr_registration_link ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.95rem', wordBreak: 'break-all' }}>
                        {qr_registration_link}
                    </span>
                    <SubmitButton
                        disabled={false}
                        onClick={() => onRegister?.(qr_registration_link)}
                        cta_text_enabled="Register player"
                        cta_text_disabled="Register player"
                    />
                </div>
            ) : (
                <span style={{ opacity: 0.7 }}>Loading registration link...</span>
            )}
            <QRCode
                value={qr_registration_link || 'https://example.com'}
                size={256}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="H"
            />
        </div>
    )
}

export default GeneratePlayerAccountWithQrCode
