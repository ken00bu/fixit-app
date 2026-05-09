"use client"
import { API_URL } from "@/config/config"
import { useState, useEffect, useRef } from "react"
import { Card, Title, Text, Flex, Stack, Divider, Badge, Group, ThemeIcon, Center } from "@mantine/core"
import { IconCircleFilled, IconPlus, IconArrowsExchange, IconEdit, IconUserPlus, IconUserShare } from "@tabler/icons-react"
import { useUserContext } from "./UserProvider"
import { useAppContext } from "@/app/admin/_components/NavBarShell"

type SSEReportEvent = {
  type: 'new_report' | 'status_change' | 'report_updated' | 'assigned' | 'reassigned';
  title?: string;
  ticket?: string;
  from?: string;
  to?: string;
  timestamp: string;
  fromId?: number;
};

const eventConfig = {
    new_report: { icon: IconPlus, color: 'teal', label: 'New Report' },
    status_change: { icon: IconArrowsExchange, color: 'yellow', label: 'Status Change' },
    report_updated: { icon: IconEdit, color: 'blue', label: 'Updated' },
    assigned: { icon: IconUserPlus, color: 'green', label: 'Assigned' },
    reassigned: { icon: IconUserShare, color: 'orange', label: 'Reassigned' },
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "pending":
        case "withdrawn":
            return "#929393";
        case "progress":
            return "#115FE4";
        case "done":
            return "#01976D";
        case "rejected":
        case "rejected_by_technician":
            return "#E5262C";
        default:
            return "#B7B7B6";
    }
}

function LogItem({ data }: { data: SSEReportEvent }) {
    const config = eventConfig[data.type]
    const Icon = config.icon
    const time = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    return (
        <Flex gap="sm" align="flex-start">
            <Flex direction="column" align="center" gap={0}>
                <ThemeIcon size={28} radius="xl" color={config.color}>
                    <Icon size={14} />
                </ThemeIcon>
            </Flex>

            <Stack gap={4} style={{ flex: 1 }}>
                <Group justify="space-between">
                    <Badge size="xs" color={config.color}>
                        {config.label}
                    </Badge>
                    <Text size="xs" c="dimmed">{time}</Text>
                </Group>

                {data.type === 'new_report' && (
                    <Text size="sm">
                        <Text span fw={600}>{data.title}</Text>
                        <Text span c="dimmed"> · {data.ticket}</Text>
                    </Text>
                )}
                {data.type === 'status_change' && (
                    <Flex align="center" gap={6}>
                        <Text size="sm" c="dimmed">{data.ticket}</Text>
                        <Badge size="xs" variant="light" color={getStatusColor(data.from || '')}>{data.from}</Badge>
                        <Text size="xs" c="dimmed">to</Text>
                        <Badge size="xs" variant="light" color={getStatusColor(data.to || '')}>{data.to}</Badge>
                    </Flex>
                )}
                {(data.type === 'assigned' || data.type === 'reassigned') && (
                    <Flex align="center" gap={6} wrap="wrap">
                        <Text size="sm" c="dimmed">{data.ticket}</Text>
                        <Badge size="xs" variant="light" color="gray">{data.from}</Badge>
                        <Text size="xs" c="dimmed">to</Text>
                        <Badge size="xs" variant="light" color={config.color}>{data.to}</Badge>
                    </Flex>
                )}
                {data.type === 'report_updated' && (
                    <Text size="sm">
                        <Text span fw={600}>{data.title}</Text>
                        <Text span c="dimmed"> · {data.ticket}</Text>
                    </Text>
                )}
            </Stack>
        </Flex>
    )
}

export default function LogCard() {
    const [logs, setLogs] = useState<SSEReportEvent[]>([])
    const { user } = useUserContext()
    const { refreshKey, reportRefresh } = useAppContext()

    const userRef = useRef(user)
    useEffect(() => { userRef.current = user }, [user])

    useEffect(() => {
        const es = new EventSource(`${API_URL}/reports/stream?token=${document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1]}`)
        es.onmessage = (event) => {
            console.log('Received SSE event:', event.data)
            const data = JSON.parse(event.data)
            setLogs(prevLogs => [...prevLogs, data])
            if((userRef.current && data.fromId !== userRef.current.id) ) {
                console.log('bukan kamu yang update, refresh laporan. Id kamu adalah', userRef.current?.id, 'id yang update adalah', data.fromId)
                reportRefresh()
            }
        }
        es.onerror = () => es.close()
        return () => es.close()
    }, [])

    return (
        <Card radius={10} mah="20rem" p="md" withBorder>
            <Stack gap="sm">
                <Group justify="space-between">
                    <Flex align="center" gap={10}>
                        <IconCircleFilled color="green" size={10} />
                        <Title order={5}>Live Activity</Title>
                    </Flex>
                    <Badge size="xs" variant="light" color="green" circle>
                        {logs.length}
                    </Badge>
                </Group>
                <Divider />
                <Stack
                    gap="md"
                    pb={20}
                    style={{ maxHeight: '13rem', overflowY: 'auto', scrollbarWidth: 'none' }}
                >
                    {
                        logs.length === 0 ? (
                            <Center>
                                <Text size="sm" c="dimmed" mt={20}>
                                        Tidak ada aktivitas terbaru. Semua perubahan akan muncul di sini secara real-time, akan hilang jika di refresh.
                                </Text>
                            </Center>
                        ) : (
                            [...logs].reverse().map((log, index) => (
                                <LogItem key={index} data={log} />
                            ))
                        )
                    }
                </Stack>
            </Stack>
        </Card>
    )
}