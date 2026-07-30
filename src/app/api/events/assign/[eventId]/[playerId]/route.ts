import { NextRequest, NextResponse } from 'next/server'
import db from 'api_lib/db'

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ eventId: string; playerId: string }> },
) {
    const { eventId: eventIdParam, playerId: playerIdParam } = await context.params
    const eventId = Number(eventIdParam)
    const playerId = Number(playerIdParam)

    if (!Number.isInteger(eventId) || eventId <= 0) {
        return NextResponse.json({ error: 'A valid eventId is required.' }, { status: 400 })
    }

    if (!Number.isInteger(playerId) || playerId <= 0) {
        return NextResponse.json({ error: 'A valid playerId is required.' }, { status: 400 })
    }

    try {
        const event = db
            .prepare(`
                SELECT
                    ge.id,
                    ge.playerCapacity,
                    (SELECT COUNT(*) FROM game_event_players gep WHERE gep.gameEventId = ge.id) AS playersAssigned
                FROM game_event ge
                WHERE ge.id = ?
            `)
            .get(eventId) as { id: number; playerCapacity: number; playersAssigned: number } | undefined

        if (!event) {
            return NextResponse.json({ error: 'Event not found.' }, { status: 404 })
        }

        const alreadySigned = db
            .prepare(`
                SELECT 1 FROM game_event_players
                WHERE gameEventId = ? AND playerId = ?
            `)
            .get(eventId, playerId)

        if (alreadySigned) {
            console.error(`Player ${playerId} is already signed up for event ${eventId}.`)
            return NextResponse.json({ error: 'Player is already signed up for this event.' }, { status: 409 })
        }

        if (event.playersAssigned >= event.playerCapacity) {
            console.error(`Event ${eventId} is already at capacity.`)
            return NextResponse.json({ error: 'This event is already at capacity.' }, { status: 409 })
        }

        db.prepare(`
            INSERT INTO game_event_players (gameEventId, playerId)
            VALUES (?, ?)
        `).run(eventId, playerId)

        return NextResponse.json({ success: true }, { status: 201 })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
