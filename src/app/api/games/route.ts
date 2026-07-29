import { NextResponse } from 'next/server'
import db from '../_lib/db'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const organizerId = searchParams.get('organizerId')

        const games = db
            .prepare(`
                SELECT gt.id, gt.name, gt.description, gt.template, gt.createdAt,
                       CASE WHEN ge.organizer IS NOT NULL THEN 1 ELSE 0 END AS isAssigned
                FROM game_type gt
                LEFT JOIN game_event ge ON ge.gameType = gt.id AND ge.organizer = ?
                GROUP BY gt.id, gt.name, gt.description, gt.template, gt.createdAt
                ORDER BY gt.createdAt DESC
            `)
            .all(organizerId ? Number(organizerId) : null)

        return NextResponse.json({ games })
    }
    catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
