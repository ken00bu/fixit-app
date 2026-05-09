"use client"

import { Flex, Title, Box, Text, Card, Center } from "@mantine/core"
import {
    IconUsersGroup,
    IconBriefcase
} from "@tabler/icons-react"
import type { Statistic } from "@/types/statistic"
import { toast } from "@/lib/utils/toast"

//-- Types --

type StatCardConfig = {
    label: string
    value: number
    bgColor: string
    icon: React.ReactNode
}

// -- Component --

function StatCard({ label, value, bgColor, icon }: StatCardConfig) {
    return (
        <Card flex={1} py={{ base: 20, sm: 30 }} px={{ base: 20, sm: 30 }} radius={10} withBorder>
            <Flex justify="space-between" align="center">
                <Flex direction="column">
                    <Text fw={500} c="dimmed" size="sm">{label}</Text>
                    <Title order={5} size="h3">{value}</Title>
                </Flex>
                <Box bg={bgColor} p={10} bdrs={10}>
                    <Center>{icon}</Center>
                </Box>
            </Flex>
        </Card>
    )
}

export default function Statistic({ statistic, setStatistic, error }: { statistic: any; setStatistic: React.Dispatch<React.SetStateAction<any>>; error: boolean }) {

    if (error) toast.error("Gagal memuat statistic laporan. Silakan coba lagi nanti.")
    console.log(`teknisis statistik: ${statistic}, error: ${error}`)
    const cards: StatCardConfig[] = [
        {
            label: "Jumlah Teknisi",
            value: statistic.total,
            bgColor: "#EEF2FF",
            icon: <IconUsersGroup color="#4F46E5" />,
        },
        {
            label: "Ditugaskan",
            value: statistic.assigned,
            bgColor: "#e6ffe8",
            icon: <IconBriefcase color="green" />,
        }
    ]

    return (
        <Flex miw={{ base: "100%", sm: "" }} direction={{ base: "column", sm: "row" }} gap={15}>
            {cards.map((card) => (
                <StatCard key={card.label} {...card} />
            ))}
        </Flex>
    )
}