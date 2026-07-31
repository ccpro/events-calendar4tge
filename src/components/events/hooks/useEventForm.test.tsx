import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useEventForm } from './useEventForm'

describe('useEventForm', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('loads games from the API response into the dropdown options', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    organizers: [
                        {
                            id: 1,
                            name: 'Organizer 1',
                            uuid: 'uuid-1',
                            roleType: 1,
                            createdAt: '2024-01-01T00:00:00.000Z',
                        },
                    ],
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    games: [
                        {
                            id: 7,
                            name: 'Magic',
                            description: null,
                            template: 'mtg-template',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            durationInMins: 60,
                            minPlayers: 2,
                            format: 'standard',
                        },
                    ],
                }),
            } as Response)

        const { result } = renderHook(() => useEventForm())

        await waitFor(() => {
            expect(result.current.games).toHaveLength(1)
        })

        expect(result.current.games[0]?.name).toBe('Magic')
    })

    it('uses the selected game minimum players as the default player capacity', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ organizers: [] }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    games: [
                        {
                            id: 7,
                            name: 'Magic',
                            description: null,
                            template: 'mtg-template',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            durationInMins: 60,
                            minPlayers: 4,
                            format: 'standard',
                        },
                    ],
                }),
            } as Response)

        const { result } = renderHook(() => useEventForm())

        await waitFor(() => {
            expect(result.current.games).toHaveLength(1)
        })

        result.current.updateField('gameType', '7')

        expect(result.current.form.playerCapacity).toBe('4')
    })

    it('uses the selected game duration as the default event duration', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ organizers: [] }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    games: [
                        {
                            id: 7,
                            name: 'Magic',
                            description: null,
                            template: 'mtg-template',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            durationInMins: 90,
                            minPlayers: 4,
                            format: 'standard',
                        },
                    ],
                }),
            } as Response)

        const { result } = renderHook(() => useEventForm())

        await waitFor(() => {
            expect(result.current.games).toHaveLength(1)
        })

        act(() => {
            result.current.updateField('gameType', '7')
        })

        await waitFor(() => {
            expect(result.current.form.durationInMins).toBe('90')
        })
    })

    it('splits a selected game format string into selectable dropdown options', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ organizers: [] }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    games: [
                        {
                            id: 7,
                            name: 'Magic',
                            description: null,
                            template: 'mtg-template',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            durationInMins: 60,
                            minPlayers: 2,
                            format: 'Standard|Commander|Modern',
                        },
                    ],
                }),
            } as Response)

        const { result } = renderHook(() => useEventForm())

        await waitFor(() => {
            expect(result.current.games).toHaveLength(1)
        })

        act(() => {
            result.current.updateField('gameType', '7')
        })

        await waitFor(() => {
            expect(result.current.form.format).toBe('Standard')
        })

        expect(result.current.getFormatOptions()).toEqual(['Standard', 'Commander', 'Modern'])
    })

    it('updates the minimum players and capacity from the selected game', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ organizers: [] }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    games: [
                        {
                            id: 7,
                            name: 'Magic',
                            description: null,
                            template: 'mtg-template',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            durationInMins: 60,
                            minimumPlayers: 4,
                            format: 'Standard',
                        },
                    ],
                }),
            } as Response)

        const { result } = renderHook(() => useEventForm())

        await waitFor(() => {
            expect(result.current.games).toHaveLength(1)
        })

        act(() => {
            result.current.updateField('gameType', '7')
        })

        expect(result.current.form.playerCapacity).toBe('4')
    })
})
