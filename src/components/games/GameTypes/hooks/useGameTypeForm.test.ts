import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { initialFormState, useGameTypeForm } from './useGameTypeForm'

describe('useGameTypeForm', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('returns validation errors for an invalid form', () => {
        const { result } = renderHook(() => useGameTypeForm())

        act(() => {
            result.current.updateField('name', 'A')
            result.current.updateField('template', 'bad template')
        })

        expect(result.current.validate()).toEqual({
            name: 'Name must be at least 2 characters long.',
            template: 'Template can only contain letters, numbers, and hyphens.',
        })
    })

    it('submits successfully and resets the form', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ gameType: { id: 1 } }),
        } as Response)

        const { result } = renderHook(() => useGameTypeForm())

        act(() => {
            result.current.updateField('name', 'Magic')
            result.current.updateField('description', 'A test game type')
            result.current.updateField('template', 'magic-template')
        })

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>)
        })

        expect(fetchMock).toHaveBeenCalledWith('/api/games/types', expect.objectContaining({
            method: 'POST',
        }))
        expect(result.current.message).toBe('Game type created successfully.')
        expect(result.current.form).toEqual(initialFormState)
    })

    it('reports an API error when submission fails', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: 'Server exploded' }),
        } as Response)

        const { result } = renderHook(() => useGameTypeForm())

        act(() => {
            result.current.updateField('name', 'Magic')
            result.current.updateField('template', 'magic-template')
        })

        await act(async () => {
            await result.current.handleSubmit({
                preventDefault: vi.fn(),
            } as unknown as React.FormEvent<HTMLFormElement>)
        })

        expect(result.current.message).toBe('Server exploded')
    })
})
