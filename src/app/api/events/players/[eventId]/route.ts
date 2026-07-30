import { NextRequest, NextResponse } from 'next/server'
import db from 'api_lib/db'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ eventId: string }> },
) {
    const { eventId: eventIdParam } = await context.params
    const eventId = Number(eventIdParam)

    if (!Number.isInteger(eventId) || eventId <= 0) {
        return NextResponse.json({ error: 'A valid eventId is required.' }, { status: 400 })
    }

    try {
        const event = db
            .prepare(`
                SELECT id
                FROM game_event
                WHERE id = ?
            `)
            .get(eventId)

        if (!event) {
            return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
        }

        const players = db
            .prepare(`
                SELECT
                    r.id,
                    r.name
                FROM game_event_players gep
                JOIN role r ON r.id = gep.playerId
                WHERE gep.gameEventId = ?
                ORDER BY r.name ASC
            `)
            .all(eventId)

        return NextResponse.json({ eventId, players })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
