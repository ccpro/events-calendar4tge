import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockPrepare, mockGet, mockAll } = vi.hoisted(() => ({
    mockPrepare: vi.fn(),
    mockGet: vi.fn(),
    mockAll: vi.fn(),
}))

vi.mock('api_lib/db', () => ({
    default: {
        prepare: mockPrepare,
    },
}))

import { GET } from './route'

describe('GET /api/events/players/[eventId]', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const createContext = (eventId: string) => ({
        params: Promise.resolve({ eventId }),
    })

    it('returns a 400 response when the event id is invalid', async () => {
        const response = await GET(new NextRequest('http://localhost/api/events/players/abc'), createContext('abc') as never)

        expect(response.status).toBe(400)
        await expect(response.json()).resolves.toEqual({ error: 'A valid eventId is required.' })
        expect(mockPrepare).not.toHaveBeenCalled()
    })

    it('returns a 404 response when the event does not exist', async () => {
        mockPrepare.mockReturnValue({ get: mockGet, all: mockAll })
        mockGet.mockReturnValue(undefined)

        const response = await GET(new NextRequest('http://localhost/api/events/players/999'), createContext('999') as never)

        expect(response.status).toBe(404)
        await expect(response.json()).resolves.toEqual({ error: 'Event not found.' })
        expect(mockGet).toHaveBeenCalledTimes(1)
        expect(mockAll).not.toHaveBeenCalled()
    })

    it('returns the players for an existing event', async () => {
        mockPrepare.mockReturnValue({ get: mockGet, all: mockAll })
        mockGet.mockReturnValue({ id: 7 })
        mockAll.mockReturnValue([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }])

        const response = await GET(new NextRequest('http://localhost/api/events/players/7'), createContext('7') as never)

        expect(response.status).toBe(200)
        await expect(response.json()).resolves.toEqual({
            eventId: 7,
            players: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
        })
        expect(mockPrepare).toHaveBeenCalledTimes(2)
        expect(mockGet).toHaveBeenCalledTimes(1)
        expect(mockAll).toHaveBeenCalledWith(7)
    })
})
