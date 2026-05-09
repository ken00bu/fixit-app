'use client'
import { toast } from "@/lib/utils/toast";
import { createReport, updateReport } from "@/services/reportServices";
import type { Category } from "@/types/category";
import type { Faculty, Building } from "@/types/location";
import Form from "@/components/Form";
import type { FormValues } from "@/types/form";
import { getIdByName } from "@/app/dashboard/_utils/getIdByName";
import { Center, Card, Flex } from "@mantine/core";
import { useParams } from "next/navigation";
import { useMediaQuery } from '@mantine/hooks';

export default function NewReport() {
    const { id } = useParams()
    const reportId = parseInt(String(id)?.slice(-5) )
    const isMobile = useMediaQuery(`(max-width: 768px)`);
    const handleUpdateReport = async(formValues: FormValues, buildingData: Building[], categoryData: Category[]) => {

        try {
            const { category, building, faculty, file, title, description, ...rest } = formValues
            const form = {
                title,
                description,
                ...(file instanceof File? { file } : undefined),
                id : reportId,
            }
            await updateReport(form)
            toast.success('Laporan berhasil diupdate', 'Terima kasih telah memperbaiki kesalahan ini, admin kami akan segera menindaklanjuti laporan Anda.')
        } catch (error) {
            toast.error('Laporan gagal diupdate', `Maaf, terjadi kesalahan saat mengupdate laporan Anda. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

    }
 

    return (
        <Flex miw={'99vw'} justify={'center'} align={'center'} py={20}>
            <Card maw={'80vw'} radius={20} p={{base: 0, sm: 40}} w={'100%'}>
                    <Form mode="edit" onSubmit={handleUpdateReport} reportId={reportId} />
            </Card>
        </Flex>
)}