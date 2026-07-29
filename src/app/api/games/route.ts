import { NextResponse } from 'next/server'
import db from '../_lib/db'

export async function GET() {
    try {
        const games = db
            .prepare(`
                SELECT id, name, description, template, createdAt
                FROM game_type
                ORDER BY createdAt DESC
            `)
            .all()

        return NextResponse.json({ games })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
