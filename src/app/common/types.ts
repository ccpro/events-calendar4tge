type Organizer = {
    id: number
    uuid: string
    name: string
    createdAt: string
}

type Player = {
    id: number
    uuid: string
    name: string
    createdAt: string
}

type Game = {
    id: number
    name: string
    description: string | null
    template: string
    createdAt: string
    isAssigned: number | boolean
}

type Event = {
    id: number
    name: string
    organizerId: number
    organizerName: string
    description: string | null
    template: string
    createdAt: string
    startAt: string
    playerCapacity: number
    playersAssigned: number
    isAssigned: number | boolean
}

export type { Organizer, Player, Game, Event }