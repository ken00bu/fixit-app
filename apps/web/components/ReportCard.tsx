'use client'
import { Flex, Title, Box, Group, Text, Card, Center, Badge, Image, AspectRatio, Button, Collapse, Menu, em } from "@mantine/core";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconCircleFilled, IconLabelFilled, IconUserPlus, IconTrash, IconPencil, IconEye, IconCancel, IconStopwatch } from "@tabler/icons-react";
import { daysAgo} from "@/lib/utils/stringFormat";
import type { Report } from "@/types/report";
import { useUserContext } from "./UserProvider";
import { IMG_URL } from "@/config/config";

type ReportCardProps = {
    report: Report;
    mode?: 'user' | 'admin' | 'technician';
    // admin actions
    onAssignTechnician?: (reportId: number) => void;
    onReject?: (reportId: number) => void;
    onViewTechnicianDetail?:(technicianId: number, reportId: number, technicianNote?: string | null)=> void;
    onReopen?: (reportId: number) => void;
    onSlaChange?: (reportId: number) => void;
    //technician actions
    onMarkDone?: (reportId: number) => void;
    onRequestSlaExtension?: (reportId: number) => void;
    onRejectByTechnician?: (reportId: number) => void;
    // user actions
    onEdit?: (reportId: number, ticket: string) => void;
    onDelete?: (reportId: number, status: string) => void;
    onView?: (ticket: string) => void;
};

export const getStatusProps = (status: string) => {
  switch (status) {
    case "pending":
    case "withdrawn":
      return { color: "#929393" };
    case "progress":
      return { color: "#115FE4" };
    case "done":
      return { color: "#01976D" };
    case "rejected":
      return { color: "#E5262C" };
    case "rejected_by_technician":
      return { color: "#E5262C" };
    default:
      return { color: "#B7B7B6" };
  }
};

export const getPriorityProps = (priority: string) => {
    const p = priority.toLowerCase()
    switch (p) {
    case "critical":
      return { color: "red" };
    case "urgent":
      return { color: "orange" };
    case "regular":
      return { color: "yellow" };
    case "low":
      return { color: "green" };
    default:
      return { color: "#B7B7B6" };
  }
}

export function ReportCard({ 
    report, 
    mode = 'user',
    onAssignTechnician,
    onViewTechnicianDetail,
    onReopen,
    onReject,
    onSlaChange,
    onEdit,
    onDelete,
    onView,
    onMarkDone,
    onRequestSlaExtension,
    onRejectByTechnician
}: ReportCardProps) {
    const [expanded, { toggle }] = useDisclosure()
    const statusProps = getStatusProps(report.status)
    const priorityProps = getPriorityProps(report.priority.name)
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
    return (
        <Card radius={10} p={25} maw={{ base: '100%', lg: '33%' }} miw={{ base: '100%', lg: '30%' }} flex={1} bd={report.status === 'rejected_by_technician' ? '1px solid red' : ''} bg={report.status === 'rejected_by_technician' ? '#fffafa' : undefined}     style={{
            transition: 'transform 0.2s ease',
            cursor: 'pointer',
        }}
        onClick={() => !isMobile && onView?.(report.ticket ?? '')}   
        onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(-5px)')}
        onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(0)')} 
        withBorder>
            <Flex direction={'column'} gap={15}>

                {/* badge, tiket, dan menu (user) / badge dan tiket */}
                {mode === 'user' && (
                    <Flex justify={'space-between'} gap={5}>
                        <Badge leftSection={<IconCircleFilled {...statusProps} size={5} />} variant="light" {...statusProps}>
                            {report.status}
                        </Badge>
                        <Menu >
                            <Menu.Target >
                                <Button variant="default" radius={10} p={10} onClick={(e) => e.stopPropagation()}>:</Button>
                            </Menu.Target>
                            <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                                <Menu.Item onClick={() => onEdit?.(report.id, report.ticket ?? '')} leftSection={<IconPencil color="#8A8A8A" size={14} />}>
                                    Edit Laporan
                                </Menu.Item>
                                <Menu.Item onClick={() => onView?.(report.ticket)} leftSection={<IconEye color="#8A8A8A" size={14} />}>
                                    Detail Laporan
                                </Menu.Item>
                                <Menu.Divider />
                                <Menu.Item onClick={() => onDelete?.(report.id, report.status)} c={'red'} leftSection={<IconTrash color="red" size={14} />}>
                                    Hapus Laporan
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>
                )}


                {/* actions admin */}
                {
                    mode === 'admin' && (
                    <Flex justify={'space-between'} align={'center'}>
                        <Flex gap={10}>
                            <Badge
                                leftSection={<IconCircleFilled {...statusProps} size={5} />}
                                variant="light"
                                {...statusProps}
                            >
                                {report.status === 'rejected_by_technician' ? 'Ditolak teknisi' : report.status}
                            </Badge>
                            <Badge variant="outline" size="md" color={report.status === 'rejected_by_technician' ? 'red' : undefined} >
                                {report.ticket ? report.ticket : 'no tiket'}
                            </Badge>
                        </Flex>
                        <Menu>
                            <Menu.Target>
                                <Button variant='light' radius={10} p={10} color={report.status === 'rejected_by_technician' ? 'red' : undefined} onClick={(e) => e.stopPropagation()}>Manage</Button>
                            </Menu.Target>
                            <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                                <Menu.Item onClick={() => onView?.(report.ticket)} leftSection={<IconEye color="#8A8A8A" size={14} />}>
                                    Detail Laporan
                                </Menu.Item>
                                { report.status === 'progress' && (
                                    <>
                                        <Menu.Item onClick={() => onViewTechnicianDetail?.(Number(report.assignedTechnician?.id), report.id)} leftSection={<IconUserPlus color="#8A8A8A" size={14} />}>
                                            Detail Teknisi
                                        </Menu.Item>
                                        <Menu.Item onClick={() => onSlaChange?.(report.id)} leftSection={<IconStopwatch color="#8A8A8A" size={14} />}>
                                            Ubah SLA
                                        </Menu.Item>
                                        <Menu.Divider/>
                                        <Menu.Item c={'red'} onClick={() => onReject?.(report.id)} leftSection={<IconCancel color="#8A8A8A" size={14} />}>
                                            Tolak
                                        </Menu.Item>
                                        <Menu.Divider />
                                    </>
                                ) }
                                {
                                    report.status === 'pending' && (
                                        <>
                                            <Menu.Item onClick={() => onAssignTechnician?.(report.id)} leftSection={<IconUserPlus color="#8A8A8A" size={14} />}>
                                                Pilih Teknisi
                                            </Menu.Item>
                                            <Menu.Divider/>
                                            <Menu.Item c={'red'} onClick={() => onReject?.(report.id)} leftSection={<IconCancel color="#8A8A8A" size={14} />}>
                                                Tolak
                                            </Menu.Item>
                                            <Menu.Divider />
                                        </>
                                    )
                                }
                                {
                                    (report.status === 'done' || report.status === 'rejected') && (
                                        <>
                                            <Menu.Item onClick={() => onReopen?.(report.id)} leftSection={<IconUserPlus color="#8A8A8A" size={14} />}>
                                                Reopen
                                            </Menu.Item>

                                        </>
                                    )
                                }
                                {
                                    (report.status === 'rejected_by_technician' ) && (
                                        <>
                                            <Menu.Item onClick={() => onViewTechnicianDetail?.(Number(report.assignedTechnician?.id), report.id, report.technicianNote)} leftSection={<IconUserPlus color="#8A8A8A" size={14} />}>
                                                Detail Teknisi
                                            </Menu.Item>
                                        </>
                                    )
                                }
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>

                    )
                }

                {/* actions technician */}
                {
                    mode === 'technician' && (
                    <Flex justify={'space-between'} align={'center'}>
                        <Flex gap={10}>
                            <Badge
                                leftSection={<IconCircleFilled {...statusProps} size={5} />}
                                variant="light"
                                {...statusProps}
                            >
                                {report.status === 'rejected_by_technician' ? 'Ditolak teknisi' : report.status}
                            </Badge>
                            <Badge variant="outline" size="md" color={report.status === 'rejected_by_technician' ? 'red' : undefined} >
                                {report.ticket ? report.ticket : 'no tiket'}
                            </Badge>
                        </Flex>
                        <Menu>
                            <Menu.Target>
                                <Button variant='light' radius={10} p={10} color={report.status === 'rejected_by_technician' ? 'red' : undefined} onClick={(e) => e.stopPropagation()}>Manage</Button>
                            </Menu.Target>
                            <Menu.Dropdown onClick={(e) => e.stopPropagation()}>
                                <Menu.Item onClick={() => onView?.(report.ticket)} leftSection={<IconEye color="#8A8A8A" size={14} />}>
                                    Detail Laporan
                                </Menu.Item>
                                { report.status === 'progress' && (
                                    <>
                                    { report.slaStatus !== 'possibly_late' && (
                                        <Menu.Item onClick={() => onRequestSlaExtension?.(report.id)} leftSection={<IconStopwatch color="#8A8A8A" size={14} />}>
                                            Ajukan Perpanjangan SLA
                                        </Menu.Item>
                                    )}
                                        <Menu.Divider/>
                                        <Menu.Item mb={5} bg={'#f0f9ec'} onClick={() => onMarkDone?.(report.id)} leftSection={<IconStopwatch color="#358709" size={14} />} color={'#358709'}>
                                            Selesai
                                        </Menu.Item>
                                        <Menu.Item bg={'#f9ecec'} c={'red'} onClick={() => onRejectByTechnician?.(report.id)} leftSection={<IconCancel color="#8A8A8A" size={14} />}>
                                            Tolak
                                        </Menu.Item>
                                        <Menu.Divider />
                                    </>
                                ) }
                                {
                                    (report.status === 'rejected_by_technician' ) && (
                                        <>
                                            <Menu.Item onClick={() => onViewTechnicianDetail?.(Number(report.assignedTechnician?.id), report.id, report.technicianNote)} leftSection={<IconUserPlus color="#8A8A8A" size={14} />}>
                                                Detail Teknisi
                                            </Menu.Item>
                                        </>
                                    )
                                }
                            </Menu.Dropdown>
                        </Menu>
                    </Flex>

                    )
                }

                {/* gambar dan judul, deskripsi */}
                <Flex align={'center'} gap={30} maw={'100%'} style={{ overflow: 'hidden' }}>
                    <Flex justify={'center'} align={'center'}>
                        <AspectRatio ratio={1080 / 1080} miw={90} maw={90}>
                            <Image radius="md" src={`${IMG_URL}/${report.imgUrl}`} />
                        </AspectRatio>
                    </Flex>
                    <Flex direction={'column'} gap={4}>
                        <Box style={{ minHeight: '2.5lh', display: 'flex', alignItems: 'flex-end' }}>
                            <Title size={'h3'} lineClamp={2} c={report.status === 'rejected_by_technician' ? 'red' : undefined}>
                                {report.title}
                            </Title>
                        </Box>
                        <Text lineClamp={2} style={{ minHeight: '2lh'}} c={report.status === 'rejected_by_technician' ? 'red' : undefined}>{report.description ?? 'No Description'}</Text>
                    </Flex>
                </Flex>

                {/* metadata */}
                <Flex gap={10} align={'center'} justify={'space-between'}>
                    <Group gap={10}>
                        <Flex gap={5} align={'center'}>
                            <Box bdrs={5}>
                                <Center><IconLabelFilled color={report.status === 'rejected_by_technician' ? 'red' : '#4C739A'} /></Center>
                            </Box>
                            <Text size="sm" c={report.status === 'rejected_by_technician' ? 'red' : '#4C739A'}>{report.category.name}</Text>
                        </Flex>
                        <Badge size="sm" {...(report.status !== 'rejected_by_technician' ? priorityProps : { color: 'red' })} fw={500} >
                            {report.priority?.name || 'null'}
                        </Badge>
                        {
                            report.slaStatus === 'possibly_late' && (
                                <Badge variant={mode==='admin' || mode === 'technician' ? 'filled' : 'outline'} size="md" color={mode === 'admin' || mode === 'technician' ? 'orange' : 'red'} fw={500} >
                                    {mode === 'admin' || mode === 'technician' ? 'PENGAJUAN SLA' : 'Berpotensi Terlambat'}
                                </Badge>
                            )
                        }
                    </Group>
                    <Text size="xs" c={report.status === 'rejected_by_technician' ? 'red' : 'dimmed'}>{daysAgo(report.createdAt)}</Text>
                </Flex>
            </Flex>
        </Card>
    )
}
