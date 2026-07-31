import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrepare, mockRun } = vi.hoisted(() => ({
    mockPrepare: vi.fn(),
    mockRun: vi.fn(),
}))

vi.mock('api_lib/db', () => ({
    default: {
        prepare: mockPrepare,
    },
}))

import { DELETE } from './route'

describe('DELETE /api/events/unassign/[eventId]/[playerId]', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createContext = (eventId: string, playerId: string) => ({
        params: Promise.resolve({ eventId, playerId }),
    })

    it('returns a 400 response when the event id is invalid', async () => {
        const response = await DELETE(
            new NextRequest('http://localhost/api/events/unassign/abc/1'),
            createContext('abc', '1') as never,
        )

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: 'A valid eventId is required.' })
        expect(mockPrepare).not.toHaveBeenCalled()
    })

    it('returns a 400 response when the player id is invalid', async () => {
        const response = await DELETE(
            new NextRequest('http://localhost/api/events/unassign/7/abc'),
            createContext('7', 'abc') as never,
        )

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: 'A valid playerId is required.' })
        expect(mockPrepare).not.toHaveBeenCalled()
    })

    it('returns a 404 response when the player is not assigned to the event', async () => {
        mockPrepare.mockReturnValue({ run: mockRun })
        mockRun.mockReturnValue({ changes: 0 })

        const response = await DELETE(
            new NextRequest('http://localhost/api/events/unassign/7/3'),
            createContext('7', '3') as never,
        )

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Player is not assigned to this event.' })
        expect(mockRun).toHaveBeenCalledWith(7, 3)
    })

    it('returns success when the player is unassigned', async () => {
        mockPrepare.mockReturnValue({ run: mockRun })
        mockRun.mockReturnValue({ changes: 1 })

        const response = await DELETE(
            new NextRequest('http://localhost/api/events/unassign/7/3'),
            createContext('7', '3') as never,
        )

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({ success: true })
        expect(mockRun).toHaveBeenCalledWith(7, 3)
    })
})
