import { http } from "../lib/http";
import { ITEMS_PER_PAGE } from "@/config/config";
import type { ReportResponse } from "../types/report";
import { TechnicianResponse } from "@/types/technician";

async function fetchTechnicians(orderBy?: 'weight' | null, page?: number, limit?: number, skill?: string, id?: number, filtered?: boolean): Promise<TechnicianResponse> {

    return await http('/users/technicians', {
        params: {
            ...(orderBy ? { orderBy } : undefined),
            ...( page && limit ? { page: page.toString(), limit: limit.toString() } : undefined ),
            ...( skill ? { skill } : undefined ),
            ...(id ? {id: id.toString()} : undefined),
            ...(filtered ? { filtered: 'true' } : undefined)
        }
    })
}

async function fetchTechnicianPagination(status?: string, page?: number, limit?: number, skill?: string, search?: string): Promise<TechnicianResponse> {
    return await http('/users/technicians', {
        params: {
            ...(status === 'assigned' ? { isAssigned: 'true' } : undefined),
            ...( page && limit ? { page: page.toString(), limit: limit.toString() } : undefined ),
            ...( skill ? { skill } : undefined ),
            ...( search ? { like: search } : undefined )
        }
    })
}

async function fetchTechnicianSummary(skill?: string){
    return await http('/users/technicians/summary', {
        params: {
            ...(skill ? {skill} : undefined)
        },
        cache: 'no-store'
    },
)}

async function createTechnician({ username, email, password, skillId }: { username: string, email: string, password: string, skillId: number }) {
    return await http('/users/technicians', {
        method: 'POST',
        body: {
            username,
            email,
            password,
            skillId
        }
    });
}


export { fetchTechnicians, fetchTechnicianSummary, fetchTechnicianPagination, createTechnician }