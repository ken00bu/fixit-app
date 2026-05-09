'use client'
import { toast } from "@/lib/utils/toast";
import { createReport } from "@/services/reportServices";
import type { Category } from "@/types/category";
import type { Faculty, Building } from "@/types/location";
import Form from "../../../components/Form";
import type { FormValues } from "@/types/form";
import { getIdByName } from "@/app/dashboard/_utils/getIdByName";
import { Center, Card, Flex } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMediaQuery } from '@mantine/hooks';

export default function NewReport() {
    const router = useRouter()
    const isMobile = useMediaQuery(`(max-width: 768px)`);
    const handleSendReport = async(formValues: FormValues, buildingData: Building[], categoryData: Category[], reset: ()=>void) => {

        try {
            const { category, building, ...rest } = formValues
            const form = {
                ...rest,
                categoryId: getIdByName(category, categoryData),
                buildingId: getIdByName(building, buildingData)
            }
            await createReport(form)
            toast.success('Laporan berhasil dikirim', 'Terima kasih telah melaporkan masalah ini, admin kami akan segera menindaklanjuti laporan Anda.')
            reset()
            router.refresh()
        } catch (error) {
            toast.error('Laporan gagal dikirim', `Maaf, terjadi kesalahan saat mengirim laporan Anda. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }

    }
 

    return (
        <Flex miw={'99vw'} justify={'center'} align={'center'} py={20}>
            <Card maw={'80vw'} radius={20} p={{base: 0, sm: 40}} w={'100%'}>
                    <Form onSubmit={handleSendReport} />
            </Card>
        </Flex>
)}