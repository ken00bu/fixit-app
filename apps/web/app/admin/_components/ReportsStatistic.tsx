"use client"

import { Flex } from "@mantine/core"
import {
    IconFolders,
    IconClock,
    IconRosetteDiscountCheck,
    IconCircleX,
    IconHourglassHigh,
} from "@tabler/icons-react"
import type { Statistic } from "@/types/statistic"
import { toast } from "@/lib/utils/toast"
import { StatCard } from "@/components/StatCard"
import { useAppContext } from "./NavBarShell";


export default function ReportStatistic({ statistic }: { statistic: Statistic; }) {
    const cards = [
        {
            label: "Total Laporan",
            value: statistic.total,
            bgColor: "#EEF2FF",
            icon: <IconFolders color="#4F46E5" />,
        },
        {
            label: "Menunggu",
            value: statistic.count.pending,
            bgColor: "#F6F6F6",
            icon: <IconClock color="#929292" />,
        },
        {
            label: "Dalam Proses",
            value: statistic.count.progress,
            bgColor: "#EFF6FF",
            icon: <IconHourglassHigh color="#2563EB" />,
        },
        {
            label: "Selesai",
            value: statistic.count.done,
            bgColor: "#ECFDF5",
            icon: <IconRosetteDiscountCheck color="#059669" />,
        },
        {
            label: "Ditolak",
            value: statistic.count.rejected,
            bgColor: "#FEF2F2",
            icon: <IconCircleX color="#DC2626" />,
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