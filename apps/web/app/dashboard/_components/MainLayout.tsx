'use client'
import ReportStatistic from "./ReportsStatistic";
import ReportsLayout from "./ReportsLayout";
import { useState } from "react";

export default function MainLayout({InitialData, error}: Record<string, any>) {  
    const [statistic, setStatistic] = useState(InitialData)
    return (
        <>
        <ReportStatistic statistic={statistic} setStatistic={setStatistic} error={error}/>
        <ReportsLayout statistic={statistic} setStatistic={setStatistic} error={error}/>
        </>
    )
}