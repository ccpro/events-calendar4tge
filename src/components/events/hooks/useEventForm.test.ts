import { act, renderHook, waitFor } from '@testing-library/react'
import { initialFormState, useEventForm } from './useEventForm'

const organizers = [{ id: 1, uuid: 'org-uuid', name: 'Organizer 1', createdAt: '' }]
const gameTypes = [{ id: 2, name: 'Magic', description: null, template: 'mtg-template', createdAt: '' }]

const mockOptionsFetch = (eventResponse?: Response) => {
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL) => {
        const url = String(input)

        if (url === '/api/organizer') {
            return Promise.resolve({ ok: true, json: async () => ({ organizers }) } as Response)
        }

        if (url === '/api/games') {
            return Promise.resolve({ ok: true, json: async () => ({ gameTypes }) } as Response)
        }

        if (url === '/api/events' && eventResponse) {
            return Promise.resolve(eventResponse)
        }

        return Promise.resolve({ ok: false, json: async () => ({}) } as Response)
    })
}

describe('useEventForm', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('loads organizers and game types on mount', async () => {
        mockOptionsFetch()

        const { result } = renderHook(() => useEventForm())

        await waitFor(() => expect(result.current.loadingOptions).toBe(false))

        expect(result.current.organizers).toEqual(organizers)
        expect(result.current.gameTypes).toEqual(gameTypes)
    })

    it('preselects the organizer when an initial organizer id is provided', async () => {
        mockOptionsFetch()

        const { result } = renderHook(() => useEventForm(1))

        expect(result.current.form.organizer).toBe('1')
        await waitFor(() => expect(result.current.loadingOptions).toBe(false))
        expect(result.current.form.organizer).toBe('1')
    })

    it('returns validation errors for an invalid form', async () => {
        mockOptionsFetch()

        const { result } = renderHook(() => useEventForm())
        await waitFor(() => expect(result.current.loadingOptions).toBe(false))

        act(() => {
            result.current.updateField('playerCapacity', '0')
        })

        expect(result.current.validate()).toEqual({
            organizer: 'Organizer is required.',
            gameType: 'Game type is required.',
            startAt: 'Start date is required.',
            playerCapacity: 'Player capacity must be between 1 and 30.',
        })
    })

    it('submits successfully and resets the form', async () => {
        mockOptionsFetch({ ok: true, json: async () => ({ event: { id: 9 } }) } as Response)

        const { result } = renderHook(() => useEventForm())
        await waitFor(() => expect(result.current.loadingOptions).toBe(false))

        act(() => {
            result.current.updateField('organizer', '1')
            result.current.updateField('gameType', '2')
            result.current.updateField('startAt', '2026-08-01T10:00')
        })

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>)
        })

        expect(fetch).toHaveBeenCalledWith('/api/events', expect.objectContaining({ method: 'POST' }))
        expect(result.current.message).toBe('Event created successfully.')
        expect(result.current.form).toEqual(initialFormState)
    })

    it('reports an API error when submission fails', async () => {
        mockOptionsFetch({ ok: false, json: async () => ({ error: 'Server exploded' }) } as Response)

        const { result } = renderHook(() => useEventForm())
        await waitFor(() => expect(result.current.loadingOptions).toBe(false))

        act(() => {
            result.current.updateField('organizer', '1')
            result.current.updateField('gameType', '2')
            result.current.updateField('startAt', '2026-08-01T10:00')
        })

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>)
        })

        expect(result.current.message).toBe('Server exploded')
    })
})
