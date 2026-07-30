import { NextResponse } from 'next/server'
import db from 'api_lib/db'
import { ORGANIZER_ROLE_TYPE } from '@/app/common/constants'

export async function GET() {
    try {
        const organizers = db
            .prepare(`
                SELECT id, uuid, name, createdAt
                FROM role
                WHERE roleType = ?
                ORDER BY createdAt DESC
            `)
            .all(ORGANIZER_ROLE_TYPE)

        return NextResponse.json({ organizers })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
