'use client'
import { ReportCard } from "@/components/ReportCard";
import React, { useEffect, useState } from "react";
import { toast } from "@/lib/utils/toast";
import { useRouter } from "next/navigation"
import type { Report } from "@/types/report";
import TechnicianConfirmModal from "@/components/TechnicianConfirmModal";
import { useUserContext } from "@/components/UserProvider";
import { markDone, rejectByTechnician, requestSlaExtension } from "@/services/reportServices";
import { useAppContext } from "./NavBarShell";

type ModalType = 'slaChange' | 'markDone' | 'rejectByTechnician' | null

export default function ReportsList({ reports }: { reports: Report[] }) {
    const { refreshKey, reportRefresh } = useAppContext();
    const [ currentReport, setCurrentReport ] = useState<number | null>()
    const [ activeModal, setActiveModal ] = useState<ModalType>(null)
    const [ note, setNote ] = useState<string>('')
    const router = useRouter()
    // logic
    const openModal = (type: ModalType, reportId: number | undefined, technicianId?: number) => {
        console.log(`open modal ${type} with reportId ${reportId} and technicianId ${technicianId}`)
        setActiveModal(type)
        reportId && setCurrentReport(reportId)
    }

    const closeModal = () => {
        setActiveModal(null)
        setCurrentReport(null)
    }

    const handleViewDetail = (ticket: string) => {
        console.log('harusnya di push')
        router.push(`laporan/${ticket}`)
    }

    //mark done logic
    const handleMarkDone = (reportId: number) => {
        openModal('markDone', reportId)
    }

    const handleDone = async() => {
        if(!currentReport) return
        try {
            await markDone(currentReport)
            reportRefresh()
            closeModal()
            toast.success('Laporan berhasil ditandai selesai', 'Terima kasih telah menyelesaikan laporan ini, admin kami akan segera memverifikasi penyelesaian laporan Anda.')
        } catch (error) {
            toast.error('Gagal menandai laporan sebagai selesai', `Maaf, terjadi kesalahan saat menandai laporan ini sebagai selesai. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            console.log(`error marking report ${currentReport} as done: ${error}`)
        }
    }

    //reject by technician logic
    const handleReject = (reportId: number) => {
        openModal('rejectByTechnician', reportId)
    }

    const handleRejectByTechnician = async(technicianNote: string = '') => {
        if(!currentReport) return
        try {
            await rejectByTechnician(currentReport, technicianNote)
            reportRefresh()
            closeModal()
            toast.success('Laporan berhasil ditolak', 'Terima kasih telah menolak laporan ini, admin kami akan segera memverifikasi penolakan laporan Anda.')
        } catch (error) {
            toast.error('Gagal menolak laporan', `Maaf, terjadi kesalahan saat menolak laporan ini. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            console.log(`error rejecting report ${currentReport} by technician: ${error}`)
        }
    }

    //ajukan perpanjangan sla logic
    const handleRequestSlaExtension = (reportId: number) => {
        openModal('slaChange', reportId)
    }

    const handleRequestSlaExtensionSubmit = async(note: string = '') => {
        if(!currentReport) return
        try {
            await requestSlaExtension(currentReport, note)
            reportRefresh()
            closeModal()
            toast.success('Berhasil mengajukan perpanjangan SLA', 'Permintaan perpanjangan SLA Anda telah diajukan, admin kami akan segera memverifikasi permintaan Anda.')
        } catch (error) {
            toast.error('Gagal mengajukan perpanjangan SLA', `Maaf, terjadi kesalahan saat mengajukan perpanjangan SLA. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            console.log(`error requesting sla extension for report ${currentReport}: ${error}`)
        }
    }

    if (!reports) return null

    return (
        <>
            {
                reports.map((report: any) => (
                    <ReportCard 
                        mode="technician" 
                        key={report.id} 
                        report={report} 
                        onView={handleViewDetail}
                        onMarkDone={handleMarkDone}
                        onRejectByTechnician={handleReject}
                        onRequestSlaExtension={handleRequestSlaExtension}
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
                    {activeModal === 'markDone' && 
                    <TechnicianConfirmModal
                        toggle={closeModal}
                        onSubmit={handleDone}
                        title="Konfirmasi Penyelesaian Laporan"
                        description="Apakah Anda yakin laporan ini sudah selesai dikerjakan?"
                        placeholder="Contoh: Pipa sudah diganti, keran sudah berfungsi normal."
                        submitLabel="Selesaikan Laporan"
                    />}
                    {activeModal === 'rejectByTechnician' && 
                    <TechnicianConfirmModal
                        withTextArea
                        color="red"
                        toggle={closeModal}
                        onSubmit={handleRejectByTechnician}
                        title="Konfirmasi Penolakan Laporan"
                        description="Apakah Anda yakin ingin menolak laporan ini?"
                        placeholder="Contoh: Pipa sudah diganti, keran sudah berfungsi normal."
                        submitLabel="Tolak Laporan"
                    />}
                    {activeModal === 'slaChange' && 
                    <TechnicianConfirmModal
                        withTextArea
                        toggle={closeModal}
                        onSubmit={handleRequestSlaExtensionSubmit}
                        title="Ajukan Perpanjangan SLA"
                        description="Apakah Anda yakin ingin mengajukan perpanjangan SLA untuk laporan ini?"
                        placeholder="Contoh: Butuh tambahan 2 hari karena kesulitan mendapatkan suku cadang."
                        submitLabel="Ajukan Perpanjangan"
                    />}
                </div>
            }
        </>
    )
}