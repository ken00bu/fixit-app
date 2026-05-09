
function daysAgo(dateString: string): string {
    const created = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - created.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Hari ini"
    if (diffDays === 1) return "Kemarin"
    return `${diffDays} hari yang lalu`
}

export { daysAgo }
