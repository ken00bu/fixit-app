"use client"

import { Flex } from "@mantine/core"
import {
    IconFolders,
    IconCheck
} from "@tabler/icons-react"
import { StatCard } from "@/components/StatCard"


export default function ReportStatistic({ statistic }: { statistic: any; }) {
    const cards = [
        {
            label: "Tugas Aktif",
            value: statistic.totalAssigned,
            bgColor: "#EEF2FF",
            icon: <IconFolders color="#4F46E5" />,
        },
        {
            label: "Selesai",
            value: statistic.finished,
            bgColor: "#f0ffe8",
            icon: <IconCheck color="#059669" />,
        },
    ]

    return (
        <Flex miw={{ base: "100%", sm: "" }} direction={{ base: "column", sm: "row" }} gap={15}>
            {cards.map((card) => (
                <StatCard key={card.label} {...card} />
            ))}
        </Flex>
    )
}