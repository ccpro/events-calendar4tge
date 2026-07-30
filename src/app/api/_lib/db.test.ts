import Database from 'better-sqlite3'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('database bootstrap', () => {
    const originalCwd = process.cwd()
    let tempDir: string

    beforeEach(() => {
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'events-calendar-db-'))
        process.chdir(tempDir)
        vi.resetModules()
    })

    afterEach(() => {
        process.chdir(originalCwd)

        try {
            fs.rmSync(tempDir, { recursive: true, force: true })
        } catch {
            // ignore Windows temp-directory cleanup races in CI/local runs
        }
    })

    it('migrates the legacy player column without throwing', async () => {
        const dbPath = path.join(tempDir, 'dev.db')
        const db = new Database(dbPath)

        db.exec(`
            CREATE TABLE game_event (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                organizer INTEGER NOT NULL,
                gameType INTEGER NOT NULL,
                createdAt datetime NOT NULL default (datetime('now')),
                startAt datetime NOT NULL default (datetime('now')),
                playerCapacity INTEGER NOT NULL,
                player INTEGER
            )
        `)
        db.close()

        await expect(import('./db')).resolves.toBeDefined()
    })
})
