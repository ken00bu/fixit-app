'use client'
import { ReportCard } from "@/components/ReportCard";
import AssignTechnicianModal from "@/components/AssignTechnicianModal";
import React, { useEffect, useState } from "react";
import ReportNoteModal from "@/components/RejectReportModal";
import type { Statistic } from "@/types/statistic";
import { rejectReport, reopenReport } from "@/services/reportServices";
import { toast } from "@/lib/utils/toast";
import ViewTechnicianModal from "@/components/ViewTechnicianModal";
import UpdateSLAModal from "@/components/UpdateSLAModal";
import { useRouter } from "next/navigation"
import type { Report } from "@/types/report";

type ModalType = 'assign' | 'reject' | 'updateNote' | 'viewtechnician' | 'reopenReport' | 'updateSLA' |null

export default function ReportsList({ reports, reportRefresh }: { reports: Report[], reportRefresh: ()=>void }) {
    const [ currentReport, setCurrentReport ] = useState<number | null>()
    const [ currentTechnician, setCurrentTechnician ] = useState<number | null>()
    const [ activeModal, setActiveModal ] = useState<ModalType>(null)
    const [ note, setNote ] = useState<string>('')
    const router = useRouter()
    // logic
    const openModal = (type: ModalType, reportId: number | undefined, technicianId?: number) => {
        console.log(`open modal ${type} with reportId ${reportId} and technicianId ${technicianId}`)
        setActiveModal(type)
        technicianId && setCurrentTechnician(technicianId)
        reportId && setCurrentReport(reportId)
    }

    const closeModal = () => {
        setActiveModal(null)
        setCurrentReport(null)
        setCurrentTechnician(null)
    }

    // modal helpers
    const openAssignTechnicianModal = (reportId: number) => {
        openModal('assign', reportId)
    }

    const openRejectReportModal = (reportId: number) => {
        openModal('reject', reportId)
    }

    const openViewTechnicianModal = (technicianId: number, reportId: number, technicianNote?: string | null) => {
        openModal('viewtechnician', reportId, technicianId)
        setNote(technicianNote || '')
    }

    const openReopenReportModal = (reportId: number) => {
        openModal('reopenReport', reportId)
    }

    const openUpdateSLAModal = (reportId: number) => {
        openModal('updateSLA', reportId)
    }

    // modal handlers
    const handleRejectReport = async(adminNote: string | undefined) => {
        try {
            await rejectReport(currentReport as number, adminNote)
            toast.success("Laporan Ditolak", "Status laporan telah diperbarui")
            reportRefresh()
            closeModal()
        } catch (error) {
            toast.error("Gagal Menolak Laporan", "Silakan coba beberapa saat lagi")
        }
    }

    const handleViewDetail = (ticket: string) => {
        console.log('harusnya di push')
        router.push(`laporan/${ticket}`)
    }

    const handlerReopenReport = async(adminNote: string | undefined) => {
        try {
            await reopenReport(currentReport as number, adminNote)
            toast.success("Laporan Dibuka Kembali", "Status laporan telah diperbarui")
            reportRefresh()
            closeModal()
        } catch (error) {
            toast.error("Gagal Update Laporan", "Silakan coba beberapa saat lagi " + (error instanceof Error ? error.message : 'Unknown error'))
        }
    }
    

    useEffect(()=>{
        console.log(`active modal: ${activeModal}, technicianId: ${currentTechnician}`)
    }, [activeModal])

    if (!reports) return null

    return (
        <>
            {
                reports.map((report: any) => (
                    <ReportCard 
                        mode="admin" 
                        key={report.id} 
                        report={report} 
                        onAssignTechnician={openAssignTechnicianModal} 
                        onReject={openRejectReportModal}
                        onView={handleViewDetail}
                        onViewTechnicianDetail={openViewTechnicianModal}
                        onReopen={openReopenReportModal}
                        onSlaChange={openUpdateSLAModal}
                    />
                ))
            }
            {
                activeModal  &&
                <div style={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {
                        (activeModal === 'assign' && currentReport) &&
                        <AssignTechnicianModal reportId={currentReport} toggle={closeModal} reportRefresh={reportRefresh}/>
                        
                    }
                    {
                        activeModal === 'reject' &&
                        <ReportNoteModal toggle={closeModal} onSubmit={handleRejectReport} onSubmitLabel="Konfirmasi"/>
                    }
                    {
                        activeModal === 'viewtechnician' && currentTechnician  &&
                        <ViewTechnicianModal openAssignTechnicianModal={openAssignTechnicianModal} toggle={closeModal} technicianId={currentTechnician} reportId={currentReport} note={note}/>
                    }
                    {
                        activeModal === 'updateNote' &&
                        <ReportNoteModal toggle={closeModal} onSubmit={()=> console.log('tes')} onSubmitLabel="Update catatan"/>
                    }
                    {
                        activeModal === 'reopenReport' &&
                        <ReportNoteModal toggle={closeModal} onSubmit={handlerReopenReport} onSubmitLabel="Buka kembali"/>
                    }
                    {
                        (activeModal === 'updateSLA' && currentReport) &&
                        <UpdateSLAModal toggle={closeModal} reportId={currentReport}/>
                    }
                </div>
            }
        </>
    )
}