import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isDateNewerThanNow, isSameDay, startsWithinNextHour } from './dateUtils'

describe('isSameDay', () => {
    it('returns true for two dates that fall on the same calendar day', () => {
        expect(isSameDay(new Date('2024-01-01T08:00:00.000Z'), new Date('2024-01-01T20:00:00.000Z'))).toBe(true)
    })

    it('returns false for different days or missing values', () => {
        expect(isSameDay(new Date('2024-01-01T00:00:00.000Z'), new Date('2024-01-02T00:00:00.000Z'))).toBe(false)
        expect(isSameDay(null, new Date('2024-01-01T00:00:00.000Z'))).toBe(false)
        expect(isSameDay(new Date('2024-01-01T00:00:00.000Z'), null)).toBe(false)
    })
})

describe('startsWithinNextHour', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns true for a start time within the next hour', () => {
        expect(startsWithinNextHour('2024-01-01T00:30:00.000Z')).toBe(true)
    })

    it('returns false for a start time outside the next hour', () => {
        expect(startsWithinNextHour('2023-12-31T23:59:59.000Z')).toBe(false)
        expect(startsWithinNextHour('2024-01-01T01:00:01.000Z')).toBe(false)
    })
})

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
