'use client'
import { Flex, Card, TextInput, em, Pagination, Select, Text, ThemeIcon } from "@mantine/core";
import { toast } from "@/lib/utils/toast";
import { useMediaQuery, useToggle } from "@mantine/hooks";
import { IconSearch, IconFilter, IconSortAscending2, IconSortDescending2, IconAlertCircle, IconClockExclamation } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { fetchReports } from "@/services/reportServices";
import { ITEMS_PER_PAGE } from "@/config/config";
import { Statistic } from "@/types/statistic";
import ReportsList from "./ReportsList";
import { fetchCategories } from "@/services/categoriesServices";
import type { Report } from "@/types/report";
import { Category } from "@/types/category";
import { useAppContext } from "./NavBarShell";

const statusOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'progress', label: 'Diproses' },
    { value: 'done', label: 'Selesai' },
    { value: 'rejected', label: 'Ditolak' },
    { value: 'rejected_by_technician', label: 'Ditolak oleh teknisi' },
];

const slaOptions = [
    { value: 'all', label: 'Semua' },
    { value: 'on_time', label: 'Tepat Waktu' },
    { value: 'possibly_late', label: 'Mungkin Terlambat' },
    { value: 'late', label: 'Terlambat' },
]

const categoryOptionsDefault = [
    { value: 'all', label: 'Semua' },
]

export default function ReportsLayout({ statistic}: { statistic: Statistic; }) {

    const { refreshKey, reportRefresh } = useAppContext();
    const [status, setStatus] = useState('all');
    const [sla, setSla] = useState('all');
    const [ sortBy, toggleSortBy ] = useToggle<'weight' | 'createdAt'>(['weight', 'createdAt'])
    const [ sortOrder, toggleSortOrder ] = useToggle<'asc' | 'desc'>(['asc', 'desc'])
    const [category, setCategory] = useState('all');
    const [ categoryOptions, setCategoryOptions ] = useState<{ value: string; label: string }[]>(categoryOptionsDefault)
    const [reports, setReports] = useState<Report[]>()
    const [ categories, setCategories ] = useState<Category[]>()
    const [ total, setTotal ] = useState(0)
    const [page, setPage] = useState(1)
    const [ search, setSearch ] = useState('')


    useEffect(() => {
        console.log('sort by:', sortBy)
        const handleFetchReports = async () => {
            try {
                const { total, reports } = await fetchReports(status, page, search, sla, category, sortBy, sortOrder)
                setReports(reports)
                setTotal(total)
            } catch (error) {
                toast.error(`Gagal memuat laporan. Silakan coba lagi nanti. ${error}`)
            }
        }
        const timer = setTimeout(() => {
            handleFetchReports()
        }, 100) 

        return () => clearTimeout(timer) 

    }, [status, page, search, sla, category, sortBy, sortOrder, refreshKey])


    useEffect(() => {
        const handleFetchCategories = async () => {
            try {

                const categories: Category[] = await fetchCategories()
                setCategoryOptions(prev => ([
                    ...categoryOptionsDefault,
                    ...categories.map((c: Category) => ({ value: c.name, label: c.name }))
                ]))
                setCategories(categories)
            } catch (error) {
                toast.error(`Gagal memuat kategori. Silakan coba lagi nanti. ${error}`)
            }
        }
        handleFetchCategories()
    }, [])


    if (!reports || !statistic || !categories || categories.length <= 1) return null

    return (
        <Flex direction={'column'} gap={30} mb={100}>
            <Card flex={1} p={20} radius={15}>
                <Flex gap={10} justify={'space-between'} direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }}>
                    <Flex direction={{ base: 'column', md: 'row' }}  gap={20} align={{ base: 'stretch', sm: 'flex-end' }} wrap='wrap'>
                        <Flex direction="column" gap={10}>
                            <Text size="sm" fw={500} c="dimmed">Progres Laporan</Text>
                            <Select
                                variant='filled'
                                leftSection={<IconFilter size={20} />}
                                data={statusOptions}
                                value={status}
                                onChange={(val) => setStatus(val || 'all')}
                                placeholder="Filter status"
                                size="md"
                                radius={10}
                                w={{ base: '100%', md: 220 }}
                                allowDeselect={false}
                            />
                        </Flex>
                        <Flex direction="column" gap={10}>
                            <Text size="sm" fw={500} c="dimmed">Ketepatan Waktu</Text>
                            <Select
                                variant='filled'
                                leftSection={<IconFilter size={20} />}
                                data={slaOptions}
                                value={sla}
                                onChange={(val) => setSla(val || 'all')}
                                placeholder="Filter status"
                                size="md"
                                radius={10}
                                w={{ base: '100%', md: 220 }}
                                allowDeselect={false}
                            />
                        </Flex>
                        <Flex direction="column" gap={10}>
                            <Text size="sm" fw={500} c="dimmed">Kategori</Text>
                            <Select
                                variant='filled'
                                leftSection={<IconFilter size={20} />}
                                data={categoryOptions}
                                value={category}
                                onChange={(val) => setCategory(val || 'all')}
                                placeholder="Filter status"
                                size="md"
                                radius={10}
                                w={{ base: '100%', md: 220 }}
                                allowDeselect={false}
                            />
                        </Flex>
                    </Flex>
                    <Flex direction={'row'} gap={{base: 0, sm: 5}} align={'flex-end'} wrap='wrap'>
                        <Flex direction="column" gap={10} >
                            <Text size="sm" fw={500} c="dimmed">Urutkan</Text>
                            <ThemeIcon
                                variant="light"
                                color={sortBy === 'weight' ? 'red' : 'blue'}
                                size={44}
                                radius="md"
                            >
                                {
                                    sortBy === 'weight' ? 
                                        <IconAlertCircle size={20} onClick={() => toggleSortBy()} style={{ cursor: 'pointer' }} /> 
                                            :
                                        <IconClockExclamation size={20} onClick={() => toggleSortBy()} style={{ cursor: 'pointer' }} />
                                }
                            </ThemeIcon> 
                        </Flex>
                        <Flex direction="column" gap={10} >
                            <ThemeIcon
                                variant="light"
                                size={44}
                                radius="md"
                            >
                                {
                                    sortOrder === 'asc' ? 
                                        <IconSortAscending2 size={20} onClick={() => toggleSortOrder()} style={{ cursor: 'pointer' }} /> 
                                            :
                                        <IconSortDescending2 size={20} onClick={() => toggleSortOrder()} style={{ cursor: 'pointer' }} />
                                }
                            </ThemeIcon> 
                        </Flex>
                        <TextInput mt={{base: 15, sm: 0}} ml={{base: 0, sm: 10}} leftSection={<IconSearch size={20} />} placeholder="Cari laporan" size="md" radius={10} w={{ base: '100%', md: 300 }} value={search} onChange={(e) => setSearch(e.target.value)} />
                    </Flex>
                </Flex>
            </Card>
                                
            <Flex gap={{ base: 10, sm: 30 }} direction={{ base: 'column', sm: 'row' }} wrap='wrap'>
                {reports.length > 0 ? (
                    <ReportsList reports={reports} reportRefresh={reportRefresh} />
                ) : (
                    <Flex direction="column" align="center" justify="center" w="100%" py={60} gap={10}>
                        <Text size="lg" fw={600} c="dimmed">Tidak ada laporan ditemukan</Text>
                        <Text size="sm" c="dimmed">Coba ubah filter atau kata kunci pencarian</Text>
                    </Flex>
                )}
            </Flex>
            <Pagination total={Math.ceil(total / Number(ITEMS_PER_PAGE))} color="#137FEC" value={page} size={'lg'} onChange={setPage} />
        </Flex>
    )
}