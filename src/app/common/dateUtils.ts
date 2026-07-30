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
    return targetDate.getTime() > Date.now()
}

export { formatDate, isDateNewerThanNow }