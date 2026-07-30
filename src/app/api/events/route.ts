import { NextResponse } from 'next/server'
import db from 'api_lib/db'

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => null)
        const organizer = Number(body?.organizer)
        const gameType = Number(body?.gameType)
        const startAt = typeof body?.startAt === 'string' ? body.startAt.trim() : ''
        const playerCapacity = Number(body?.playerCapacity)
        const duration = Number(body?.duration ?? 2)

        if (!Number.isInteger(organizer) || organizer <= 0) {
            return NextResponse.json({ error: 'A valid organizer is required.' }, { status: 400 })
        }

        if (!Number.isInteger(gameType) || gameType <= 0) {
            return NextResponse.json({ error: 'A valid game type is required.' }, { status: 400 })
        }

        if (!startAt) {
            return NextResponse.json({ error: 'Start date is required.' }, { status: 400 })
        }

        if (!Number.isInteger(playerCapacity) || playerCapacity < 1 || playerCapacity > 30) {
            return NextResponse.json({ error: 'Player capacity must be between 1 and 30.' }, { status: 400 })
        }
        if (!Number.isInteger(duration) || duration < 2) {
            return NextResponse.json({ error: 'Duration must be at least 2 minutes.' }, { status: 400 })
        }

        const result = db
            .prepare(`
                INSERT INTO game_event (organizer, gameType, startAt, playerCapacity,duration)
                VALUES (?, ?, ?, ?, ?)
            `)
            .run(organizer, gameType, startAt, playerCapacity, duration)

        const event = db
            .prepare(`
                SELECT
                    ge.id,
                    gt.name,
                    gt.description,
                    gt.template,
                    ge.createdAt,
                    ge.organizer,
                    ge.startAt,
                    ge.playerCapacity,
                    organizer_role.name AS organizerName,
                    ge.duration,
                    (SELECT COUNT(*) FROM game_event_players gep WHERE gep.gameEventId = ge.id) AS playersAssigned
                FROM game_event ge
                JOIN game_type gt ON gt.id = ge.gameType
                LEFT JOIN role organizer_role ON organizer_role.id = ge.organizer
                WHERE ge.id = ?
            `)
            .get(result.lastInsertRowid)

        return NextResponse.json({ event }, { status: 201 })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const playerIdParam = searchParams.get('playerId')
        let playerId: number | null = null

        if (playerIdParam !== null) {
            playerId = Number(playerIdParam)

            if (!Number.isInteger(playerId) || playerId <= 0) {
                playerId = 0
            }
        }

        const events = db
            .prepare(`
                SELECT
                    ge.id,
                    gt.name,
                    gt.description,
                    gt.template,
                    ge.createdAt,
                    ge.organizer as organizerId,
                    ge.startAt,
                    ge.playerCapacity,
                    organizer_role.name AS organizerName,
                    ge.duration,
                    (SELECT COUNT(*) FROM game_event_players gep WHERE gep.gameEventId = ge.id) AS playersAssigned,
                    EXISTS(
                        SELECT 1 FROM game_event_players gep2
                        WHERE gep2.gameEventId = ge.id AND gep2.playerId = ?
                    ) AS isAssigned
                FROM game_event ge
                JOIN game_type gt ON gt.id = ge.gameType
                LEFT JOIN role organizer_role ON organizer_role.id = ge.organizer
                ORDER BY ge.createdAt DESC
            `)
            .all(playerId)

        return NextResponse.json({ events })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
