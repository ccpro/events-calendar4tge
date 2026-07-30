const formatDate = (dateString: string): string => {
    const dateUtc = new Date(dateString)
    const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use true for AM/PM
    }).format(dateUtc)
    return formatted
}

const isDateNewerThanNow = (dateString: string): boolean => {
    const targetDateUtc = new Date(dateString)
    return targetDateUtc.getTime() > Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        new Date().getUTCHours(),
        new Date().getUTCMinutes(),
        new Date().getUTCSeconds(),
        new Date().getUTCMilliseconds(),
    )
}

const isSameDay = (left: Date | null, right: Date | null): boolean => {
    if (!left || !right) {
        return false
    }

    return (
        left.getFullYear() === right.getFullYear() &&
        left.getMonth() === right.getMonth() &&
        left.getDate() === right.getDate()
    )
}

const startsWithinNextHour = (dateString: string): boolean => {
    const targetDateUtc = new Date(dateString)
    const now = new Date()
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

    return targetDateUtc.getTime() >= now.getTime() && targetDateUtc.getTime() <= oneHourFromNow.getTime()
}

export { formatDate, isDateNewerThanNow, isSameDay, startsWithinNextHour }