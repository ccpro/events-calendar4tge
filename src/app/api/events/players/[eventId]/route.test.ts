import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import db from 'api_lib/db'
import { GET } from './route'

describe('GET /api/event/players/[eventId]', () => {
    const createdIds: { roleIds: number[]; eventId?: number } = { roleIds: [] }

    beforeEach(() => {
        createdIds.roleIds = []
        createdIds.eventId = undefined
    })

    afterEach(() => {
        if (createdIds.eventId) {
            db.prepare('DELETE FROM game_event_players WHERE gameEventId = ?').run(createdIds.eventId)
            db.prepare('DELETE FROM game_event WHERE id = ?').run(createdIds.eventId)
        }

        for (const roleId of createdIds.roleIds) {
            db.prepare('DELETE FROM role WHERE id = ?').run(roleId)
        }
    })

    it('returns the players assigned to an event', async () => {
        const organizerRoleId = db
            .prepare('INSERT INTO role (uuid, name, roleType) VALUES (?, ?, 1)')
            .run(randomUUID(), `Test Organizer ${Date.now()}`)
            .lastInsertRowid as number

        const playerNames = [`Test Player A ${Date.now()}`, `Test Player B ${Date.now()}`]
        const playerRoleIds = [
            db.prepare('INSERT INTO role (uuid, name, roleType) VALUES (?, ?, 2)').run(randomUUID(), playerNames[0]).lastInsertRowid as number,
            db.prepare('INSERT INTO role (uuid, name, roleType) VALUES (?, ?, 2)').run(randomUUID(), playerNames[1]).lastInsertRowid as number,
        ]

        createdIds.roleIds.push(organizerRoleId, ...playerRoleIds)

        const gameType = db.prepare('SELECT id FROM game_type ORDER BY id LIMIT 1').get() as { id: number }
        const eventId = db
            .prepare('INSERT INTO game_event (organizer, gameType, startAt, playerCapacity) VALUES (?, ?, ?, ?)')
            .run(organizerRoleId, gameType.id, '2026-08-01T10:00:00', 8)
            .lastInsertRowid as number
        createdIds.eventId = eventId

        db.prepare('INSERT INTO game_event_players (gameEventId, playerId) VALUES (?, ?), (?, ?)')
            .run(eventId, playerRoleIds[0], eventId, playerRoleIds[1])

        const response = await GET(
            new Request('http://localhost/api/event/players/123'),
            { params: Promise.resolve({ eventId: String(eventId) }) } as never,
        )

        expect(response.status).toBe(200)
        const body = await response.json() as { eventId: number; players: Array<{ id: number; name: string }> }
        expect(body.eventId).toBe(eventId)
        expect(body.players).toHaveLength(2)
        expect(body.players.map((player) => player.name)).toEqual(expect.arrayContaining(playerNames))
    })
})
