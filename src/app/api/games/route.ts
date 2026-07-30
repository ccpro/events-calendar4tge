import { NextResponse } from 'next/server'
import db from 'api_lib/db'

export async function GET() {
    try {
        const gameTypes = db
            .prepare(`
                SELECT id, name, description, template, createdAt, durationInMins, minimumPlayers, format
                FROM game_type
                ORDER BY createdAt DESC
            `)
            .all()

        return NextResponse.json({ gameTypes })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null)
        const name = typeof body?.name === 'string' ? body.name.trim() : ''
        const description = typeof body?.description === 'string' ? body.description.trim() : ''
        const template = typeof body?.template === 'string' ? body.template.trim() : ''
        const duration = body?.durationInMins ?? 10
        const minimumPlayers = body?.minimumPlayers ?? 2

        if (!name || !template) {
            return NextResponse.json({ error: 'Name and template are required.' }, { status: 400 })
        }

        if (name.length < 2) {
            return NextResponse.json({ error: 'Name must be at least 2 characters long.' }, { status: 400 })
        }

        if (!/^[a-z0-9-]+$/i.test(template)) {
            return NextResponse.json({ error: 'Template can only contain letters, numbers, and hyphens.' }, { status: 400 })
        }

        const result = db
            .prepare(`
                INSERT INTO game_type (name, description, template, durationInMins, minimumPlayers, format)
                VALUES (?, ?, ?, ?, ?, ?)
            `)
            .run(name, description || null, template, duration, minimumPlayers, body?.format ?? null)

        const gameType = db
            .prepare(`
                SELECT id, name, description, template, createdAt, durationInMins, minimumPlayers, format
                FROM game_type
                WHERE id = ?
            `)
            .get(result.lastInsertRowid)

        return NextResponse.json({ gameType }, { status: 201 })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
