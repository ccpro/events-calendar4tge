import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isDateNewerThanNow } from './dateUtils'

describe('isDateNewerThanNow', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns true when the provided date is after now', () => {
        expect(isDateNewerThanNow('2024-01-01T00:00:01.000Z')).toBe(true)
    })

    it('returns false when the provided date is before or equal to now', () => {
        expect(isDateNewerThanNow('2023-12-31T23:59:59.000Z')).toBe(false)
        expect(isDateNewerThanNow('2024-01-01T00:00:00.000Z')).toBe(false)
    })
})
