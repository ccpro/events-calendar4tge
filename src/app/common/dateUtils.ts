const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Use true for AM/PM
    }).format(date)
    return formatted
}

const isDateNewerThanNow = (dateString: string): boolean => {
    const targetDate = new Date(dateString)
    return targetDate.getTime() > Date.UTC(
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
    const targetDate = new Date(dateString)
    const now = new Date()
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)

    return targetDate.getTime() >= now.getTime() && targetDate.getTime() <= oneHourFromNow.getTime()
}

export { formatDate, isDateNewerThanNow, isSameDay, startsWithinNextHour }