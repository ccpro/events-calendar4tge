import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import EventList from './EventList'
import { SelectedRolesContext } from '../../context/SelectedRoles/SelectedRolesContext'

const mockContextValue = {
    activeOrganizer: null,
    setActiveOrganizer: vi.fn(),
    activePlayer: null,
    setActivePlayer: vi.fn(),
}

describe('EventList', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('opens a modal with event players when the organizer clicks View Players', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    events: [
                        {
                            id: 1,
                            name: 'Launch party',
                            organizerId: 10,
                            organizerName: 'Dina',
                            description: null,
                            template: 'launch',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            startAt: '2024-01-02T00:00:00.000Z',
                            playerCapacity: 10,
                            playersAssigned: 2,
                            isAssigned: false,
                        },
                    ],
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    eventId: 1,
                    players: [
                        {
                            id: 42,
                            name: 'Ada',
                            uuid: 'uuid-1',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            roleType: 'PLAYER',
                        },
                    ],
                }),
            } as Response)

        render(
            <SelectedRolesContext.Provider value={mockContextValue}>
                <EventList viewType="organizer" />
            </SelectedRolesContext.Provider>,
        )

        fireEvent.click(await screen.findByRole('button', { name: /view players/i }))

        await waitFor(() => {
            expect(screen.getByText('Event players')).toBeInTheDocument()
        })

        expect(await screen.findByText('Ada')).toBeInTheDocument()
    })

    it('refreshes the events list after unassigning a player from the modal', async () => {
        const fetchMock = vi.mocked(fetch)
        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    events: [
                        {
                            id: 1,
                            name: 'Launch party',
                            organizerId: 10,
                            organizerName: 'Dina',
                            description: null,
                            template: 'launch',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            startAt: '2024-01-02T00:00:00.000Z',
                            playerCapacity: 10,
                            playersAssigned: 2,
                            isAssigned: false,
                        },
                    ],
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    eventId: 1,
                    players: [
                        {
                            id: 42,
                            name: 'Ada',
                            uuid: 'uuid-1',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            roleType: 'PLAYER',
                        },
                    ],
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    events: [
                        {
                            id: 1,
                            name: 'Launch party',
                            organizerId: 10,
                            organizerName: 'Dina',
                            description: null,
                            template: 'launch',
                            createdAt: '2024-01-01T00:00:00.000Z',
                            startAt: '2024-01-02T00:00:00.000Z',
                            playerCapacity: 10,
                            playersAssigned: 1,
                            isAssigned: false,
                        },
                    ],
                }),
            } as Response)

        render(
            <SelectedRolesContext.Provider value={mockContextValue}>
                <EventList viewType="organizer" />
            </SelectedRolesContext.Provider>,
        )

        fireEvent.click(await screen.findByRole('button', { name: /view players/i }))

        await waitFor(() => {
            expect(screen.getByText('Ada')).toBeInTheDocument()
        })

        fireEvent.click(await screen.findByRole('button', { name: /unassign/i }))

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledTimes(5)
        })
    })

    it('shows a month calendar and reveals events for a selected day', async () => {
        const fetchMock = vi.mocked(fetch)
        const currentDate = new Date()
        const startAt = new Date(
            Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth(), 15, 18, 0),
        ).toISOString()

        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                events: [
                    {
                        id: 1,
                        name: 'Launch party',
                        organizerId: 10,
                        organizerName: 'Dina',
                        description: null,
                        template: 'launch',
                        createdAt: '2024-01-01T00:00:00.000Z',
                        startAt,
                        playerCapacity: 10,
                        playersAssigned: 2,
                        isAssigned: false,
                    },
                ],
            }),
        } as Response)

        render(
            <SelectedRolesContext.Provider value={mockContextValue}>
                <EventList viewType="list" />
            </SelectedRolesContext.Provider>,
        )

        const dayButton = await screen.findByRole('button', { name: /select day 15/i })
        fireEvent.click(dayButton)

        const agendaList = await screen.findByRole('list', { name: /selected day events/i })
        expect(agendaList).toBeInTheDocument()
        expect(
            within(agendaList).getByText('Launch party', { selector: 'strong' }),
        ).toBeInTheDocument()
    })
})
