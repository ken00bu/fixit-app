'use client'
import { Flex, Center, Text } from "@mantine/core"
import ReportStatistic from "./ReportsStatistic";
import ReportsLayout from "./ReportsLayout";
import { ActiveReportCard } from "./ActiveReportCard";
import { useEffect, useState } from "react";
import { fetchReportStatistics } from "@/services/reportServices";
import { useAppContext } from "./NavBarShell";

export default function MainLayout() {  
    const [statistic, setStatistic] = useState({
        totalAssigned: 0,
        finished: 0,
    })
    const { refreshKey } = useAppContext()

    useEffect(()=>{

        const fetchStatistics = async () => {
            try {
                const data = await fetchReportStatistics()
                setStatistic(data)
            } catch (error) {
                console.error('Error fetching report statistics:', error)
            }
        }

        fetchStatistics()

    }, [refreshKey])

    if(!statistic) {
        return (
            <Center h={200}>
                <Text c={'dimmed'}>
                    Loading...
                </Text>
            </Center>
        )
    }

    return (
        <Flex direction={'column'} gap={20}>
            <ReportStatistic statistic={statistic}/>
            <ActiveReportCard />
            <ReportsLayout statistic={statistic} />
        </Flex>
    )
}