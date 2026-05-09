import { http } from "../lib/http";
import { ITEMS_PER_PAGE } from "@/config/config";
import type { ReportResponse, Report } from "../types/report";
import { ReportStatus } from "../types/report";
import { SlaStatus } from "@/types/SlaStatus";

async function fetchReportStatistics(){
    return await http('/reports/statistics')
}

async function fetchReports(status: string, page: number, search?: string, sla?: string, category?: string, orderBy?: 'weight' | 'createdAt', sortOrder?: 'asc' | 'desc', limit?: number): Promise<ReportResponse> {
    console.log('fetching reports')
    return await http('/reports', {
        params: { 
            status, 
            limit: (limit || ITEMS_PER_PAGE).toString(), 
            page: page.toString(),
            ...(search ? { like: search } : undefined),
            ...(sla && sla !== 'all' ? { slaStatus: sla } : undefined),
            ...(category && category !== 'all' ? { category } : undefined),
            ...(orderBy ? { orderBy } : undefined),
            ...(sortOrder ? { sortOrder } : undefined),
         }
    })
}

async function fetchReportById(id: number): Promise<Report> {
    const report = await http('/reports', {
        params: { id: id.toString() }
    })

    return report.reports[0]
}

async function deleteReport(id: number){
    console.log('deleting report')
    return await http(`/reports/${id}`, {
        method: 'DELETE'
    })
}

async function createReport(form: Record<string, any>){
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
    })
    return await http('/reports/create', {
        method: 'POST',
        body: formData
    })
}

async function updateReport(form: Record<string, any>) {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, value);
    })
    return await http('/reports', {
        method: 'PATCH',
        body: formData
    })
}

async function assignTechnician(ReportId: number, techicianId: number) {
    const form = {
        id: ReportId,
        status: ReportStatus.PROGRESS,
        assignedTechnicianId: Number(techicianId)
    }
    return await updateReport(form)
}

async function rejectReport(id: number, note: string = "Admin belum menambahkan keterangan") {
    const form = {
        id,
        status: ReportStatus.REJECTED,
        adminNote: note
    }
    return await updateReport(form)
}

async function reopenReport(id: number, note: string = "Admin belum menambahkan keterangan") {
    const now = new Date()
    const form = {
        id,
        status: ReportStatus.PENDING,
        adminNote: note,
        reopenedAt: now,
        assignedTechnicianId: 'unassign',
        slaStatus: SlaStatus.ON_TIME
    }
    return await updateReport(form)
}

async function cancelReport(id: number, note: string = "Admin belum menambahkan keterangan") {
    const form = {
        id,
        status: ReportStatus.CANCELED,
        adminNote: note,
    }
    return await updateReport(form)
}

async function addSlaHours(id: number, sla:number) {
    const report = await fetchReportById(id)
    if(!report) return
    const slaDate = new Date(report.slaDate);
    slaDate.setDate(slaDate.getDate() + sla);
    const newSla = new Date(slaDate)
    console.log(`type of sla ${typeof newSla}`)
    const form = {
        id,
        slaDate: newSla
    }
    return await updateReport(form)
}

async function markDone(id: number) {
    const form = {
        id,
        status: ReportStatus.DONE,
    }
    return await updateReport(form)
}

async function rejectByTechnician(id: number, note: string = "Teknisi belum menambahkan keterangan") {
    const form = {
        id,
        status: ReportStatus.REJECTED_BY_TECHNICIAN,
        technicianNote: note
    }
    return await updateReport(form)
}

async function requestSlaExtension(id: number, note: string = "Teknisi belum menambahkan keterangan") {
    const form = {
        id,
        slaStatus: SlaStatus.POSSIBLY_LATE,
        technicianNote: note
    }
    return await updateReport(form)
}



export { 
    fetchReportStatistics, 
    fetchReports, 
    deleteReport, 
    createReport, 
    updateReport, 
    fetchReportById, 
    assignTechnician, 
    rejectReport, 
    reopenReport, 
    addSlaHours,
    cancelReport,
    markDone,
    rejectByTechnician,
    requestSlaExtension
}