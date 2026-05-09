type StatisticCount = {
    pending: number
    progress: number
    done: number
    rejected: number,
    rejectedByTechnician: number | null
}
 
type Statistic = {
    total: number
    count: StatisticCount
}

export type { Statistic, StatisticCount }