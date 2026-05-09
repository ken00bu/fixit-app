'use client'
import { Flex, Title, Group, Text, Card, Badge, Image, Button, TextInput, Pagination  } from "@mantine/core";
import { IconX, IconSearch } from "@tabler/icons-react";
import BetterButton from "./BetterButton";
import { useEffect, useState } from "react";
import { toast } from "@/lib/utils/toast";
import type { Technician } from "@/types/technician";
import { fetchTechnicians } from "@/services/usersServices";
import { fetchTechnicianSummary } from "@/services/usersServices";
import { fetchSkills } from "@/services/skillsService";
import { Skill } from "@/types/skill";
import { assignTechnician, fetchReportStatistics } from "@/services/reportServices";
import { useRouter } from "next/navigation";
import { Statistic } from "@/types/statistic";
import { getWorkloadStatus } from "@/lib/utils/getWorkloadStatus";

export default function AssignTechnicianModal({reportId, toggle, reportRefresh }: {reportId: number, toggle: ()=> void, reportRefresh: ()=> void}){
    const [ total, setTotal ] = useState<number>(0)
    const [ skill, setSkill ] = useState(0)
    const [ skillsData, setSkillsData ] = useState<Skill[] >([{ id: 0, name: 'all' }])
    const [ techniciansData, setTechniciansData ] = useState<Technician[] | null>(null)
    const [ page, setPage ] = useState<number>(1)
    const router = useRouter()
    
    // fetch skills sekali saja
    useEffect(() => {
        const handleFetchSkills = async () => {
            try {
                const skills = await fetchSkills()
                setSkillsData([{ id: 0, name: 'all' }, ...skills])
            } catch (error) {
                toast.error('Gagal Mengambil Data', `Gagal mengambil data skills`)
            }
        }
        handleFetchSkills()
    }, [])

    // fetch technicians setiap kali skill atau page berubah
    useEffect(() => {
        if (skillsData === null) return
        const handleFetchTechnicians = async () => {
            try {
                const { total, technicians } = await fetchTechnicians('weight', page, 4, skillsData[skill].name, undefined, true)
                setTechniciansData(technicians)
                setTotal(total)
            } catch (error) {
                toast.error('Gagal Mengambil Data', `Gagal mengambil data teknisi silahkan coba lagi nanti ${error}`)
            }
        }
        handleFetchTechnicians()
    }, [skill, page, skillsData])

    const onAssign = async(technicianId: number) => {
        try {
            await assignTechnician(reportId, technicianId)
            toast.success('berhasil di assign', 'teknisi telah ditugaskan untuk menyelesaikan laporan')
            toggle()
            reportRefresh()
        } catch (error) {
            console.log('error nigger')
            console.error(error)
        }
    }

    // const totalPage =  getStatusLabel[status] === 'all' ? statistik.total : statistik.count[getStatusLabel[status] as keyof StatistikCount]
    return (
        <Card miw={'40%'} mih={'80%'} maw={{sm:"40%", base: '90%'}} p={30} radius={15}>

            {/* Header */}
            <Flex align={'center'} justify={'space-between'} pb={15}>
                <Title size={'h4'}>
                    Assign Technician
                </Title>
                <Button pl={0} pr={0} color="transparent" variant="none"><IconX color="gray" onClick={()=>toggle()}/></Button>
            </Flex>

            <Group h={1} bg={'gray'} opacity={0.4}></Group>

            {/* Filter */}
            <Flex mt={15} direction={'column'} gap={20}>
                <TextInput leftSection={<IconSearch size={20}/>} placeholder="Cari Teknisi" size="md" radius={10} variant="filled" />
                <Flex direction={'row'} gap={5} style={{ overflowX: 'auto' }} wrap='nowrap'>
                    {
                        skillsData &&
                        skillsData.map((s, index)=>(
                            <BetterButton 
                                key={index} 
                                radius={30} 
                                bg={skill === index ? '#0089e1' : undefined} 
                                c={skill === index ? 'white' : 'gray'}
                                onClick={()=>setSkill(index)}
                            >
                                {s.name}
                            </BetterButton>
                        ))
                    }
                </Flex>
            </Flex>
            
            <Flex direction={'column'} mt={10} mb={20}>
            {
                techniciansData &&
                techniciansData.map((technician: Technician) => {
                    const { label, color } = getWorkloadStatus(technician.totalWeight)
                    return (
                        <Card key={technician.id} bg={'#f2f2f2'} mt={15} radius={20}>
                            <Flex direction={'row'} justify={'space-between'} align={'center'}>
                                {/* Profile dan nama */}
                                <Flex align={'center'} gap={15}>
                                    <Flex align={'center'} gap={15}>
                                        <Image
                                            h={45}
                                            w={45}
                                            radius="md"
                                            visibleFrom="sm"
                                            src={`profile.png`}
                                        />  
                                        <Flex direction={'column'} gap={5}>
                                            <Title size={'h5'} lh={1} lineClamp={1}>
                                                {technician.username}
                                            </Title>
                                            <Text opacity={0.5} size="sm" lh={1}>
                                                {technician.skill.name}
                                            </Text>
                                        </Flex>
                                    </Flex>

                                    {/* weight */}
                                    <Badge variant='light' color={color} size="sm">{label}</Badge>
                                </Flex>
                                
                                {/* Button */}
                                <Button radius={20} onClick={()=> onAssign(technician.id)}>Assign</Button>
                            </Flex>
                        </Card>
                    )
                }
                )
            }         
            </Flex>
            <Flex mt={30}>
                <Pagination total={Math.ceil(total / 4)} value={page} onChange={setPage}/>
            </Flex>
        </Card>
    )
}