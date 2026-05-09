'use client'
import { Flex, Group, Card, FloatingIndicator, UnstyledButton, TextInput, em, Pagination } from "@mantine/core";
import { toast } from "@/lib/utils/toast";
import { useMediaQuery, useToggle } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import classes from '../Technician.module.css'
import { getTechnicianStatusLabel } from "@/lib/utils/getTechnicianStatusLabel";
import { ITEMS_PER_PAGE } from "@/config/config";
import { fetchTechnicianPagination } from "@/services/usersServices";
import TechniciansList from "./TechniciansList";
import type { Technician } from "@/types/technician";

export default function Layout({ statistic, setStatistic, error }: { statistic: any; setStatistic: React.Dispatch<React.SetStateAction<any>>; error: boolean }) {

    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [ refreshKey, reportRefresh ] = useToggle()
    const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
    const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
    const [ search, setSearch ] = useState('')
    const [status, setStatus] = useState(0);
    const [technicians, setTechnicians] = useState<Technician[]>()
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState(1) 
    const data = ['Semua', 'Ditugaskan'];

    if (error) toast.error("Gagal memuat statistic laporan. Silakan coba lagi nanti.")

    // requirement mantine, jangan dihapus
    const setControlRef = (index: number) => (node: HTMLButtonElement) => {
        controlsRefs[index] = node;
        setControlsRefs(controlsRefs);
    };

    const controls = data.map((item, index) => (
        <UnstyledButton
            key={item}
            className={classes.control}
            ref={setControlRef(index)}
            onClick={() => setStatus(index)}
            mod={{ status: status === index }}
            flex={isMobile ? 1 : ''}
            miw={{base: '', sm: '7rem'}}
            >
            <span className={classes.controlLabel}>{item}</span>
        </UnstyledButton>
    ));

    // fetch data setiap kali status atau page berubah
    useEffect(()=>{
        const handleFetchtechnicians = async() => {
            try {
                const { total, technicians } = await fetchTechnicianPagination(getTechnicianStatusLabel[status], page, ITEMS_PER_PAGE, undefined, search)
                setTechnicians(technicians)
                setTotal(total)
            } catch (error: any) {
                if(!error.toString().includes('Technicians not found')){
                    toast.error('Gagal mengambil data', `Gagal mengambil data teknisi silahkan coba lagi nanti ${error}`)
                }
            }
        }
        const timer = setTimeout(()=>{
            handleFetchtechnicians()
        }, 100)
        return () => clearTimeout(timer)
    }, [status, page, search, refreshKey])

    useEffect(()=>{
        setPage(1)
    }, [status])

    if(!technicians || !statistic) return null

    return (
        <Flex direction={'column'} gap={30}>
            <Card flex={1}>
            <Flex gap={10} justify={{base: '', sm: 'space-between'}} direction={{base: 'column', md: 'row'}}>
                <Group>
                <div className={classes.root} ref={setRootRef} style={{backgroundColor: '#F1F5F9', width: '100%', overflow: `${isMobile ? 'scroll' : ''}`}}>
                    {controls}
                    <FloatingIndicator
                        target={controlsRefs[status]}
                        parent={rootRef}
                        className={classes.indicator}
                    />
                </div>
                </Group>
                <TextInput leftSection={<IconSearch size={20}/>} placeholder="Cari laporan" size="lg" radius={10} value={search} onChange={(e) => setSearch(e.target.value)} />
            </Flex>
            </Card>

            {/* data yang ditampilkan */}
            <Flex gap={{base: 10, sm: 30}} direction={{base: 'column', sm: 'row'}} wrap='wrap'>
                <TechniciansList technicians={technicians}/>
            </Flex>
            <Pagination total={Math.ceil(total / Number(ITEMS_PER_PAGE))} color="#137FEC" value={page} size={'lg'} onChange={setPage}/>
        </Flex>
    )
}