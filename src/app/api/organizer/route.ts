import { NextResponse } from 'next/server'
import db from '../_lib/db'

export async function GET() {
    try {
        const organizers = db
            .prepare(`
                SELECT id, uuid, name, createdAt
                FROM role
                WHERE roleType = 1
                ORDER BY createdAt DESC
            `)
            .all()

        return NextResponse.json({ organizers })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
