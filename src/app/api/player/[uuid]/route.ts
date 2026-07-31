import { NextRequest, NextResponse } from "next/server"
import db from "../../_lib/db"

const createPlayer = (uuid: string) => {
    const existingPlayer = db
        .prepare(`
            SELECT id, uuid, name, createdAt
            FROM role
            WHERE uuid = ? AND roleType = 2
        `)
        .get(uuid)

    if (existingPlayer) {
        throw new Error('Player already registered')
    }

    const playerName = `Player ${uuid.slice(0, 8)}`
    const result = db.prepare(`
        INSERT INTO role (uuid, name, roleType)
        VALUES (?, ?, 2)
    `).run(uuid, playerName)

    const createdPlayer = db
        .prepare(`
            SELECT id, uuid, name, createdAt
            FROM role
            WHERE id = ?
        `)
        .get(result.lastInsertRowid)

    return { player: createdPlayer, created: true }
}

export async function GET(request: NextRequest, context: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await context.params

    if (!uuid) {
        return NextResponse.json({ error: 'UUID is required' }, { status: 400 })
    }

    try {
        const result = createPlayer(uuid)
        return NextResponse.json(result, { status: 201 })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 409 })
    }
}
