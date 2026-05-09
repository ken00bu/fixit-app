'use client'
import { getWorkloadStatus } from "@/lib/utils/getWorkloadStatus";
import { toast } from "@/lib/utils/toast";
import { fetchTechnicians, fetchTechnicianSummary } from "@/services/usersServices";
import { Card, Title, Flex, Button, Image, Badge, Text, Center } from "@mantine/core"
import { IconX, IconNote } from "@tabler/icons-react"
import type { Technician } from "@/types/technician";
import { useEffect, useState } from "react"

export interface Skill {
    id: number;
    name: string;
}

export default function ViewTechnicianModal({ technicianId, reportId, toggle, openAssignTechnicianModal, note }: { technicianId: number, reportId?: number | null, toggle: () => void, openAssignTechnicianModal?: (reportId: number) => void, note?: string | null }) {
    const [technicianData, setTechniciansData] = useState<Technician>()
    useEffect(() => {
        const handleFetchTechnician = async () => {
            try {
                const { total, technicians } = await fetchTechnicians(undefined, undefined, undefined, undefined, technicianId)
                console.log(`fetch technician with id ${technicianId} and got data ${JSON.stringify(technicians)}`)
                setTechniciansData(technicians[0])
            } catch (error) {
                toast.error('Gagal mengambil data', 'Gagal mengambil data teknisi')
            }
        }
        handleFetchTechnician()
    }, [])

    useEffect(() => {
        console.log(technicianData)
    }, [technicianData])

    if (!technicianData) return null
    const workload: { label: string, color: string } = getWorkloadStatus(technicianData.totalWeight)
    const tanggal = new Date(technicianData.created_at || '').toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    return (
        <Card miw={{ base: '90%', sm: '30%' }} mih={'50%'} maw={{ sm: "40%", base: '90%' }} p={30} radius={15}>
            <Flex direction={'column'}>
                <Flex align={'center'} justify={'space-between'} >
                    <Title size={'h4'}>
                        Detail Teknisi
                    </Title>
                    <Button pl={0} pr={0} color="transparent" variant="none"><IconX color="gray" onClick={() => toggle()} /></Button>
                </Flex>

                <Flex mt={25} direction={'column'}>
                    <Flex align={'center'} direction={'column'} w={'100%'} >
                        <Image
                            h={90}
                            w={90}
                            radius="md"
                            src={`/profile.png`}
                            mb={20}
                        />
                        <Title size={'h3'} mb={10}>
                            {technicianData?.username || 'username'}
                        </Title>
                        <Badge variant="light">
                            {technicianData?.skill.name || 'skill'}
                        </Badge>
                    </Flex>
                    <Flex gap={10} mt={30} direction={'column'}>
                        <Card bg={'#f8f8f8'} flex={1} radius={10} p={20} withBorder>
                            <Title size={'sm'} fw={700} mb={5}>
                                Email
                            </Title>
                            <Text opacity={0.8}>
                                {technicianData.email}
                            </Text>
                        </Card>
                        <Flex gap={10}>
                            <Card bg={'#f8f8f8'} flex={1} radius={10} p={20} withBorder>
                                <Title size={'sm'} fw={700} mb={5}>
                                    Nomor Telepon
                                </Title>
                                <Text opacity={0.8}>
                                    {technicianData?.phone_number || 'Tidak ada nomor'}
                                </Text>
                            </Card>
                            <Card bg={'#f8f8f8'} flex={1} radius={10} p={20} withBorder>
                                <Title size={'sm'} fw={700} mb={5}>
                                    Beban Kerja
                                </Title>
                                <Text opacity={0.8} c={workload.color}>
                                    {workload.label}
                                </Text>
                            </Card>
                        </Flex>
                        <Flex gap={10}>
                            <Card bg={'#f8f8f8'} flex={1} radius={10} p={20} withBorder>
                                <Title size={'sm'} fw={700} mb={5}>
                                    Selesai
                                </Title>
                                <Text opacity={0.8}>
                                    {technicianData.totalFinished} Laporan
                                </Text>
                            </Card>
                            <Card bg={'#f8f8f8'} flex={1} radius={10} p={20} withBorder>
                                <Title size={'sm'} fw={700} mb={5}>
                                    Total Jam Kerja
                                </Title>
                                <Text opacity={0.8}>
                                    {technicianData.totalHours} Jam
                                </Text>
                            </Card>
                        </Flex>
                        {(note && note !== '') && (
                            <Card bg={'#ffc14b'} flex={1} radius={10} p={20} bd="1px solid #FFE082">
                                <Flex gap={10} align={'center'} mb={5}>
                                    <IconNote size={18} color="black" />
                                    <Title size={'sm'} fw={700}>
                                        Catatan
                                    </Title>
                                </Flex>
                                <Text opacity={0.8} size="sm">
                                    {note}
                                </Text>
                            </Card>
                        )}
                        <Center>
                            <Text opacity={0.8} size="0.9rem" mt={10}>
                                Bergabung {tanggal}
                            </Text>
                        </Center>
                        {
                            reportId && (
                                <Button radius={10} mt={20} onClick={() => openAssignTechnicianModal?.(reportId)}>
                                    Reassign Teknisi
                                </Button>
                            )
                        }
                    </Flex>
                </Flex>

            </Flex>
        </Card>
    )
}