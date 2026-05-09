'use client'
import { fetchReports } from "@/services/reportServices";
import { useRouter } from "next/navigation"
import { deleteReport } from "@/services/reportServices";
import { toast } from "@/lib/utils/toast";
import type { Report } from "@/types/report";
import { ReportCard } from "@/components/ReportCard";

export function ReportsList({ reports, setStatistic, refresh }: Record<string, any>) {
    const router = useRouter()

    const handleDeleteReport = async(id: number, status: string) => {
        try {
            await deleteReport(id);
            setStatistic((prev: any)=>{
                return {
                    ...prev,
                    total: prev.total - 1,
                    count: {
                        ...prev.count,
                        [status]: prev.count[status] - 1
                    }
                }
            })
            toast.success("Laporan berhasil dihapus.")
            refresh()
        } catch (error) {
            toast.error("Gagal menghapus laporan. Silakan coba lagi nanti." + error)
        }
    }

    const handleViewDetail = (ticket: string) => {
        console.log('harusnya di push')
        router.push(`laporan/${ticket}`)
    }

    const handleEditReport = (id: number, ticket: string) => {
        console.log('harusnya di push')
        router.push(`laporan/${ticket}/edit`)
    }

    if(!reports) return null
        return reports.map((report: Report, index: number)=>{
            return (
                <ReportCard
                    key={report.id}
                    mode="user"
                    report={report}
                    onEdit={handleEditReport}
                    onView={handleViewDetail}
                    onDelete={handleDeleteReport}
                />
            )
        })
}
