'use client'
import { Flex, Card, Text, Title, Box, Stack, Button, Badge, Image, AspectRatio, Center, ThemeIcon } from "@mantine/core"
import { IconNote, IconCircleFilled, IconPencil, IconCategory, IconExclamationCircleFilled, IconStopwatch, IconCalendarPlus, IconMapPin, IconFileSearch, IconLayoutDashboard, IconList } from "@tabler/icons-react";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserContext } from "@/components/UserProvider";
import type { Report } from "@/types/report";
import { http } from '@/lib/http';
import { API_URL, IMG_URL } from "@/config/config";

import { ReportStatus } from "@/types/report";

export function getStatusMeta(status: ReportStatus) {
    switch (status) {
        case ReportStatus.PENDING:
            return {
                color: 'gray',
                label: 'PENDING'
            };
        case ReportStatus.PROGRESS:
            return {
                color: 'blue',
                label: 'IN PROGRESS'
            };
        case ReportStatus.DONE:
            return {
                color: 'green',
                label: 'DONE'
            };
        case ReportStatus.REJECTED:
            return {
                color: 'red',
                label: 'REJECTED'
            };
        case ReportStatus.WITHDRAWN:
            return {
                color: 'gray',
                label: 'WITHDRAWN'
            };
        case ReportStatus.REJECTED_BY_TECHNICIAN:
            return {
                color: 'red',
                label: 'DITOLAK TEKNISI'
            };
        default:
            return {
                color: 'gray',
                label: status.toUpperCase()
            };
    }
}

export default function reportDetail(){
    const [ user, setUser ] = useState<{ id: string, role: string, email: string } | null>(null)
    const [ report, setReport ] = useState<Report | null>(null)
    const [ isNotFound, setNotFound ] = useState(false)
    const params = useParams()

    useEffect(()=>{
        // cek kredensial user
        fetchReport()
    }, [params.id])
    
    async function fetchReport(){
        try {
            const me = await http('/users/me')
            setUser(me)
            // fetch report detail
            const report = await http(`/reports?ticket=${params.id}`)
            setReport(report.reports[0])
        } catch (e) {
            // kalau gagal, fetch report general
            console.log('fetch general report karena fetch detail gagal')
            try {
                const report = await http(`/reports/general?ticket=${params.id}`)
                console.log('report general', report)
                setReport(report)
            } catch (e) {
                setNotFound(true)
            }
        }
    }

    if( !report ) {
        if( isNotFound ) {
            return (
                    <Flex direction="column" align="center" justify="center" w="100%" py={60} gap={10} mih={'100vh'}>
                        <Text size="lg" fw={600} c="dimmed">Tidak ada laporan ditemukan</Text>
                        <Text size="sm" c="dimmed">Coba ganti atau periksa nomor tiket</Text>
                    </Flex>
            )
        }
        return null
    }
    console.log('report', report)
    const statusMeta = getStatusMeta(report.status as ReportStatus)
    return (
        <Stack p={{ base: 20, md: 40 }} maw={1200} mx="auto" w="100%">
            <Flex justify={'space-between'} direction={{ base: 'column', md: 'row' }} align={{ base: 'flex-start', md: 'center' }} w={'100%'} gap={15}>
                <Flex direction={'column'} gap={10}>
                    <Flex align={'center'} gap={15} wrap="wrap">
                        <Title>{report.ticket ?? 'no tiket'}</Title>
                        <Badge size="lg" variant='light' color={statusMeta.color} leftSection={<IconCircleFilled size={5}/>}>
                            {statusMeta.label}
                        </Badge>
                    </Flex>
                </Flex>
                <Flex w={{ base: '100%', md: 'auto' }}>

                </Flex>
            </Flex>

            <Flex direction={{ base: 'column', md: 'row' }} w={'100%'} gap={25} mt={10}>
                <Stack flex={2} w={'100%'} gap={25}>
                    <Card radius={15} p={0} withBorder>
                        <Card.Section>
                            <AspectRatio ratio={16 / 9}>
                                <Image
                                    src={`${IMG_URL}/${report.imgUrl}`}
                                />
                            </AspectRatio>
                        </Card.Section>
                    </Card>

                    <Card p={30} radius={15} withBorder>
                        <Stack>
                            <Title size={'h3'}>{report.title}</Title>
                            <Text c={'dimmed'} style={{ lineHeight: 1.7 }}>{report.description}</Text>
                        </Stack>
                    </Card>
                    {
                        report.technicianNote && (
                            <Card bg={'#ffc14b'}  radius={10} p={20} bd="1px solid black" >
                                <Flex gap={10} align={'center'} mb={5}>
                                    <IconNote size={18} color="black" />
                                    <Title size={'h4'} fw={700}>
                                        Catatan Teknisi
                                    </Title>
                                </Flex>
                                <Text opacity={0.8} size="md">
                                    {report.technicianNote}
                                </Text>
                            </Card>
                        )
                    }
                    {
                        (report.adminNote && user?.role === 'user') && (
                            <Card bg={'#ffc14b'}  radius={10} p={20} bd="1px solid black" >
                                <Flex gap={10} align={'center'} mb={5}>
                                    <IconNote size={18} color="black" />
                                    <Title size={'h4'} fw={700}>
                                        Catatan Admin
                                    </Title>
                                </Flex>
                                <Text opacity={0.8} size="md">
                                    {report.adminNote}
                                </Text>
                            </Card>
                        )
                    }
                </Stack>

                <Stack flex={1} w={'100%'} gap={25}>
                    <Card p={25} radius={15} withBorder>
                        <Stack gap={20}>
                            <Title size={'h3'}>Detail Laporan</Title>

                            <Flex gap={12} align="center">
                                <Box bg={'#EEF6FE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                    <Center>
                                        <IconCategory size={22} color="#007CE6"/>
                                    </Center>
                                </Box>
                                <Stack gap={2}>
                                    <Text size="sm" c={'dimmed'}>Kategori</Text>
                                    <Text fw={600}>{report.category.name}</Text>
                                </Stack>
                            </Flex>

                            <Flex gap={12} align="center">
                                <Box bg={'#FFF7EE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                    <Center>
                                        <IconExclamationCircleFilled size={22} color="#F25923"/>
                                    </Center>
                                </Box>
                                <Stack gap={2}>
                                    <Text size="sm" c={'dimmed'}>Prioritas</Text>
                                    <Text fw={600} c={'#F25923'}>
                                        {report.priority.name}
                                    </Text>
                                </Stack>
                            </Flex>
                            <Flex gap={12} align="center">
                                <Box bg={'#F8FAFC'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                    <Center>
                                        <IconCalendarPlus size={22} color="#477298"/>
                                    </Center>
                                </Box>
                                <Stack gap={2}>
                                    <Text size="sm" c={'dimmed'}>Dibuat pada</Text>
                                    <Text fw={600}>
                                        {new Date(report.createdAt).toLocaleString()}
                                    </Text>
                                </Stack>
                            </Flex>
                            <Flex gap={12} align="center">
                                <Box bg={'#FAF5FE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                    <Center>
                                        <IconStopwatch size={22} color="#9725E3"/>
                                    </Center>
                                </Box>
                                <Stack gap={2}>
                                    <Text size="sm" c={'dimmed'}>SLA Deadline</Text>
                                    <Text fw={600}>
                                        {new Date(report.slaDate).toLocaleString()}
                                    </Text>
                                </Stack>
                            </Flex>
                        </Stack>
                    </Card>
                    <Card p={25} radius={15} withBorder>
                        <Flex justify={'space-between'} align={'center'} mb={20}>
                            <Title size={'h3'}>Lokasi</Title>
                            <IconMapPin size={24} color="gray"/>
                        </Flex>

                        <Stack gap={20}>
                            <Stack gap={2}>
                                <Text size="xs" c={'dimmed'} tt="uppercase" fw={600}>Gedung</Text>
                                <Text fw={600}>
                                    {report.location.building.name}
                                </Text>
                            </Stack>

                            <Flex gap={20}>
                                <Stack gap={2} flex={1}>
                                    <Text size="xs" c={'dimmed'} tt="uppercase" fw={600}>Lantai</Text>
                                    <Text fw={600}>
                                        Lantai {report.location.floor}
                                    </Text>
                                </Stack>
                                <Stack gap={2} flex={1}>
                                    <Text size="xs" c={'dimmed'} tt="uppercase" fw={600}>Ruangan</Text>
                                    <Text fw={600}>
                                        Ruangan {report.location.room}
                                    </Text>
                                </Stack>
                            </Flex>

                            <Stack gap={2}>
                                <Text size="xs" c={'dimmed'} tt="uppercase" fw={600}>Lokasi Detail</Text>
                                <Text fw={600}>
                                    {report.location.detail}
                                </Text>
                            </Stack>
                        </Stack>
                    </Card>
                    <Card p={25} radius={15}  withBorder>
                        <Stack gap={10}>

                            <Flex gap={12} align="center">
                                <Stack gap={2}>
                                    <Text size="sm" c={'dimmed'}>Dilapor Oleh</Text>
                                    <Text fw={600} >{report.user.username}</Text>
                                </Stack>
                            </Flex>

                            <Flex gap={12} align="center">
                                <Stack gap={2}>
                                    <Text size="sm" c={'dimmed'}>Teknisi</Text>
                                    <Text fw={600} >
                                        {report.assignedTechnician?.username || 'Belum ditugaskan'}
                                    </Text>
                                </Stack>
                            </Flex>
                        </Stack>
                    </Card>
                </Stack>
            </Flex>
        </Stack>
    )
}