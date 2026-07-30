import { randomUUID } from 'crypto'
import Database from 'better-sqlite3'
import path from 'path'

// Locate the database file at the root of your project
const dbPath = path.join(process.cwd(), 'dev.db')

export const organizerUuids = [randomUUID(), randomUUID()]

// Initialize the database connection
const db = new Database(dbPath, { verbose: console.log })

// populate db if it doesn't already exist
db.exec(`CREATE TABLE IF NOT EXISTS role (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid varchar(128) NOT NULL,
    name varchar(256) NOT NULL,
    createdAt datetime NOT NULL default (datetime('now')),
    roleType int NOT NULL CHECK (roleType IN (1, 2))
)`)
db.exec(`INSERT INTO role (uuid, name, roleType) SELECT '${organizerUuids[0]}', 'Organizer 1', 1 WHERE NOT EXISTS (SELECT 1 FROM role)
    UNION ALL
    SELECT '${organizerUuids[1]}', 'Organizer 2', 1 WHERE NOT EXISTS (SELECT 1 FROM role)
`)

db.exec(`CREATE TABLE IF NOT EXISTS game_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name varchar(256) NOT NULL,
    description TEXT,
    template varchar(256) NOT NULL,
    format varchar(128) NOT NULL,
    durationInMins INTEGER NOT NULL DEFAULT 60,
    minimumPlayers INTEGER NOT NULL DEFAULT 2,
    createdAt datetime NOT NULL default (datetime('now'))
)`)
db.exec(`INSERT INTO game_type (name, description, template,format,durationInMins,minPlayers)
    SELECT 'Magic: The Gathering', 'Classic trading card game with standard and commander formats.', 'mtg-template', 'standard,commander', 60, 2
    WHERE NOT EXISTS (SELECT 1 FROM game_type WHERE template = 'mtg-template')
    UNION ALL
    SELECT 'Pokémon TCG', 'Fast-paced card battles with standard and expanded play options.', 'pokemon-template', 'standard,expanded', 45, 2
    WHERE NOT EXISTS (SELECT 1 FROM game_type WHERE template = 'pokemon-template')
    UNION ALL
    SELECT 'One Piece Card Game', 'Anime-inspired card battles with arena-style events.', 'one-piece-template', 'arena-style', 30, 2
    WHERE NOT EXISTS (SELECT 1 FROM game_type WHERE template = 'one-piece-template')
`)

db.exec(`CREATE TABLE IF NOT EXISTS game_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer INTEGER NOT NULL REFERENCES role(id),
    gameType INTEGER NOT NULL REFERENCES game_type(id),
    createdAt datetime NOT NULL default (datetime('now')),
    startAt datetime NOT NULL default (datetime('now')),
    playerCapacity INTEGER NOT NULL CHECK (playerCapacity BETWEEN 1 AND 30),
    durationInMins INTEGER NOT NULL DEFAULT 60 CHECK (durationInMins >= 1)

)`)

// table alteration
const gameEventColumns = db.prepare(`PRAGMA table_info(game_event)`).all() as { name: string }[]
if (gameEventColumns.some((column) => column.name === 'player')) {
    try {
        db.exec(`ALTER TABLE game_event DROP COLUMN player`)
    } catch {
        // ignore legacy migration failures and keep the bootstrap moving
    }
}

if (!gameEventColumns.some((column) => column.name === 'durationInMins')) {
    if (gameEventColumns.some((column) => column.name === 'duration')) {
        db.exec(`ALTER TABLE game_event RENAME COLUMN duration TO durationInMins`)
    } else {
        db.exec(`ALTER TABLE game_event ADD COLUMN durationInMins INTEGER NOT NULL DEFAULT 60`)
    }
}

const gameEventPlayersTable = db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'game_event_players'`).get() as { name: string } | undefined
const gameEventPlayersSql = db.prepare(`SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'game_event_players'`).get() as { sql: string } | undefined

if (gameEventPlayersTable) {
    if (gameEventPlayersSql?.sql?.includes('REFERENCES player(id)')) {
        db.exec(`PRAGMA foreign_keys = OFF`)
        db.exec(`
            CREATE TABLE game_event_players_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gameEventId INTEGER NOT NULL REFERENCES game_event(id),
                playerId INTEGER NOT NULL REFERENCES role(id),
                addedAt datetime NOT NULL default (datetime('now'))
            )
        `)
        db.exec(`
            INSERT INTO game_event_players_new (id, gameEventId, playerId, addedAt)
            SELECT id, gameEventId, playerId, addedAt FROM game_event_players
        `)
        db.exec(`DROP TABLE game_event_players`)
        db.exec(`ALTER TABLE game_event_players_new RENAME TO game_event_players`)
        db.exec(`PRAGMA foreign_keys = ON`)
    }
}
else {
    db.exec(`
        CREATE TABLE game_event_players (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameEventId INTEGER NOT NULL REFERENCES game_event(id),
            playerId INTEGER NOT NULL REFERENCES role(id),
            addedAt datetime NOT NULL default (datetime('now'))
        )
    `)
}

db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_game_event_players_game_event_id_player_id
    ON game_event_players (gameEventId, playerId)`)

export default db