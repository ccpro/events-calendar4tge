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

type GameType = {
    id: number
    name: string
    description: string | null
    template: string
    createdAt: string
}

export type { Organizer, Player, Game, GameType }