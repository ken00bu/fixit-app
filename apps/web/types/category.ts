export type Priority = {
    id: number
    name: string
    slaHours: number,
    created_at?: string
    weight?: number
}

export type Category = {
    id: number
    name: string
    priority: Priority
}

export type Categories = Category[]