import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import PlayerView from './PlayerView'
import { SelectedRolesContext } from '../../context/SelectedRoles/SelectedRolesContext'

const mockContextValue = {
    activeOrganizer: null,
    setActiveOrganizer: vi.fn(),
    activePlayer: null,
    setActivePlayer: vi.fn(),
}

describe('PlayerView', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('registers a player and refreshes the player list', async () => {
        const fetchMock = vi.mocked(fetch)
        let playerRequestCount = 0

        fetchMock.mockImplementation((input: RequestInfo | URL) => {
            const url = typeof input === 'string' ? input : input.toString()

            if (url.includes('/api/ip')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ ip: '192.168.1.10' }),
                } as Response)
            }

            if (url.includes('/api/player')) {
                playerRequestCount += 1

                return Promise.resolve({
                    ok: true,
                    json: async () =>
                        playerRequestCount > 1
                            ? {
                                  players: [
                                      {
                                          id: 3,
                                          uuid: 'new-player',
                                          name: 'Player 3',
                                          createdAt: '2024-01-01T00:00:00.000Z',
                                      },
                                  ],
                              }
                            : { players: [] },
                } as Response)
            }

            if (url.includes('/api/events')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ events: [] }),
                } as Response)
            }

            if (url.includes('/api/register_player/')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        created: true,
                        player: {
                            id: 3,
                            uuid: 'new-player',
                            name: 'Player 3',
                            createdAt: '2024-01-01T00:00:00.000Z',
                        },
                    }),
                } as Response)
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({}),
            } as Response)
        })

        render(
            <SelectedRolesContext.Provider value={mockContextValue}>
                <PlayerView />
            </SelectedRolesContext.Provider>,
        )

        fireEvent.click(await screen.findByRole('button', { name: /register new player/i }))

        const registrationButton = await screen.findByRole('button', { name: /register player/i })
        fireEvent.click(registrationButton)

        await waitFor(() => {
            expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/api/register_player/'))
        })

        await waitFor(() => {
            expect(screen.getByText('Player 3')).toBeInTheDocument()
        })
    })
})
