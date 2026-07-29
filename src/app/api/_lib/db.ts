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
    createdAt datetime NOT NULL default (datetime('now'))
)`)

db.exec(`CREATE TABLE IF NOT EXISTS game_event (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer INTEGER NOT NULL REFERENCES role(id),
    gameType INTEGER NOT NULL REFERENCES game_type(id),
    player INTEGER NOT NULL REFERENCES role(id),
    createdAt datetime NOT NULL default (datetime('now')),
    startAt datetime NOT NULL default (datetime('now')),
    playerCapacity INTEGER NOT NULL CHECK (playerCapacity BETWEEN 1 AND 30)
)`)

export default db