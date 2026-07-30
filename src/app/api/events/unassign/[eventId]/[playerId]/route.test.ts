import { randomUUID } from 'crypto'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import db from 'api_lib/db'
import { DELETE } from './route'

describe('DELETE /api/events/players/unassign/[eventId]/[playerId]', () => {
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

    it('removes a player from an event', async () => {
        const organizerRoleId = db
            .prepare('INSERT INTO role (uuid, name, roleType) VALUES (?, ?, 1)')
            .run(randomUUID(), `Test Organizer ${Date.now()}`)
            .lastInsertRowid as number

        const playerRoleId = db
            .prepare('INSERT INTO role (uuid, name, roleType) VALUES (?, ?, 2)')
            .run(randomUUID(), `Test Player ${Date.now()}`)
            .lastInsertRowid as number

        createdIds.roleIds.push(organizerRoleId, playerRoleId)

        const gameType = db.prepare('SELECT id FROM game_type ORDER BY id LIMIT 1').get() as { id: number }
        const eventId = db
            .prepare('INSERT INTO game_event (organizer, gameType, startAt, playerCapacity) VALUES (?, ?, ?, ?)')
            .run(organizerRoleId, gameType.id, '2026-08-01T10:00:00', 8)
            .lastInsertRowid as number
        createdIds.eventId = eventId

        db.prepare('INSERT INTO game_event_players (gameEventId, playerId) VALUES (?, ?)')
            .run(eventId, playerRoleId)

        const response = await DELETE(
            new Request(`http://localhost/api/events/players/unassign/123/456`),
            { params: Promise.resolve({ eventId: String(eventId), playerId: String(playerRoleId) }) } as never,
        )

        expect(response.status).toBe(200)
        const body = await response.json() as { success: boolean }
        expect(body.success).toBe(true)

        const remaining = db
            .prepare('SELECT 1 FROM game_event_players WHERE gameEventId = ? AND playerId = ?')
            .get(eventId, playerRoleId)

        expect(remaining).toBeUndefined()
    })
})
