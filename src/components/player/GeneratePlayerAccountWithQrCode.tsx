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
    const [uuid] = useState(() => generateUuid())

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
                <Link href={qr_registration_link} onClick={onRegister}>
                    {qr_registration_link}
                </Link>
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
