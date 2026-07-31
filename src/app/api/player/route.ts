import { NextResponse } from 'next/server'
import db from 'api_lib/db'
import { PLAYER_ROLE_TYPE } from '@/app/common/constants'

const GET = async () => {
    try {
        const players = db.prepare(`
            SELECT id, uuid, name, createdAt
            FROM role
            WHERE roleType = ${PLAYER_ROLE_TYPE}
            ORDER BY createdAt DESC`)
            .all()

        return NextResponse.json({ players })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export { GET }
