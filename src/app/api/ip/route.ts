import os from 'node:os'
import { NextResponse } from 'next/server'

export async function GET() {
    const interfaces = os.networkInterfaces()
    const addresses = Object.values(interfaces)
        .flat()
        .filter((details): details is os.NetworkInterfaceInfo => Boolean(details))
        .filter((detail) => detail.family === 'IPv4' && !detail.internal)
        .map((detail) => detail.address)

    return NextResponse.json({
        ip: addresses[0] ?? '127.0.0.1',
    })

}
