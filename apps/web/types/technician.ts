type Skill = {
    id: Number
    name: string
}

export type Technician = {
    id: number
    username: string
    skill: Skill
    phone_number?: string | null
    totalFinished?: number;
    totalWeight: number
    totalHours?: number;
    created_at?: string
    email?: string
}

export interface TechnicianResponse {
  total: number
  technicians: Technician[]
}