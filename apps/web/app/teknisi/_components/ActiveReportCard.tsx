"use client"
import { Flex, Title, Text, Card, Badge, Group, Stack, Box } from "@mantine/core"
import { IconCircleFilled, IconMapPin, IconClock } from "@tabler/icons-react"
import type { Report } from "@/types/report"
import { toast } from "@/lib/utils/toast"
import { fetchReports } from "@/services/reportServices"
import { getPriorityProps } from "@/components/ReportCard"
import { daysAgo } from "@/lib/utils/stringFormat"
import { useState, useEffect } from "react"

const getPriorityDot = (priority: string) => {
    switch (priority.toLowerCase()) {
        case "critical": return '#E5262C'
        case "urgent": return '#F97316'
        case "regular": return '#EAB308'
        case "low": return '#22C55E'
        default: return '#B7B7B6'
    }
}

export function ActiveReportCard() {
    const [activeReports, setActiveReports] = useState<Report[]>([])

    useEffect(() => {
        const handleFetchReports = async () => {
            try {
                const { reports } = await fetchReports('progress', 1)
                setActiveReports(reports)
            } catch (error) {
                toast.error(`Gagal memuat laporan. Silakan coba lagi nanti. ${error}`)
            }
        }
        const timer = setTimeout(() => {
            handleFetchReports()
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <Card p={25} h={350} radius={10} withBorder style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header with count */}
            <Group justify="space-between" mb={16} style={{ flexShrink: 0 }}>
                <Title order={5}>Tugas Aktif</Title>
                <Badge variant="light" color="blue" size="lg" radius="md">
                    {activeReports.length} tugas
                </Badge>
            </Group>

            {/* Task list */}
            <Stack gap={0} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
                {activeReports.length > 0 ? (
                    activeReports.map((report, index) => {
                        const dotColor = getPriorityDot(report.priority.name)
                        return (
                            <Box
                                key={report.id}
                                py={12}
                                px={8}
                                style={{
                                    borderBottom: index < activeReports.length - 1 ? '1px solid #F1F3F5' : 'none',
                                    cursor: 'pointer',
                                    borderRadius: 8,
                                    transition: 'background 0.15s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#F8F9FA')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                            >
                                <Flex align="center" gap={10}>

                                    {/* Main info */}
                                    <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                                        <Text size="sm" fw={600} lineClamp={1}>
                                            {report.title}
                                        </Text>
                                        <Group gap={12}>
                                            <Flex align="center" gap={4}>
                                                <IconMapPin size={12} color="#868E96" />
                                                <Text size="xs" c="dimmed" lineClamp={1}>
                                                    {report.location?.building?.name ?? report.category.name}
                                                </Text>
                                            </Flex>
                                            <Flex align="center" gap={4}>
                                                <IconClock size={12} color="#868E96" />
                                                <Text size="xs" c="dimmed">
                                                    {daysAgo(report.createdAt)}
                                                </Text>
                                            </Flex>
                                        </Group>
                                    </Stack>

                                    {/* Priority badge */}
                                    <Badge size="xs" variant="light" {...getPriorityProps(report.priority.name)} style={{ flexShrink: 0 }}>
                                        {report.priority.name}
                                    </Badge>
                                </Flex>
                            </Box>
                        )
                    })
                ) : (
                    <Flex direction="column" align="center" justify="center" h="100%" gap={4}>
                        <Text fw={500} c="dimmed" size="sm">
                            Tidak ada tugas aktif
                        </Text>
                        <Text c="dimmed" size="xs">
                            Silakan tunggu penugasan dari admin
                        </Text>
                    </Flex>
                )}
            </Stack>
        </Card>
    )
}