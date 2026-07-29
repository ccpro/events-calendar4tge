import { NextResponse } from 'next/server'
import db from '../../_lib/db'

export async function GET() {
    try {
        const games = db
            .prepare(`
                SELECT
                    ge.id,
                    gt.name,
                    gt.description,
                    gt.template,
                    ge.createdAt,
                    ge.organizer,
                    ge.player,
                    ge.startAt,
                    ge.playerCapacity,
                    organizer_role.name AS organizerName,
                    player_role.name AS playerName
                FROM game_event ge
                JOIN game_type gt ON gt.id = ge.gameType
                LEFT JOIN role organizer_role ON organizer_role.id = ge.organizer
                LEFT JOIN role player_role ON player_role.id = ge.player
                ORDER BY ge.createdAt DESC
            `)
            .all()

        return NextResponse.json({ games })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
