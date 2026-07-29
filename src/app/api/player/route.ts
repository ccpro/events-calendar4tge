import { NextResponse } from 'next/server'
import db from '../_lib/db'

export async function GET() {
    try {
        const players = db.prepare(`
            SELECT id, uuid, name, createdAt
            FROM role
            WHERE roleType = 2
            ORDER BY createdAt DESC
        `)
            .all()

        return NextResponse.json({ players })
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
