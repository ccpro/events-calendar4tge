import { NextRequest, NextResponse } from 'next/server'
import db from 'api_lib/db'

export async function DELETE(
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

        const info = db.prepare(`
            DELETE FROM game_event_players
            WHERE gameEventId = ? AND playerId = ?
        `).run(eventId, playerId)

        if (info.changes === 0) {
            return NextResponse.json({ error: 'Player is not assigned to this event.' }, { status: 404 })
        }

        return NextResponse.json({ success: true })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
