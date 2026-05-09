'use client'
import Statistic from "./Statistic";
import Layout from "./Layout";
import { useState } from "react";


export default function MainLayout({InitialData, error}: Record<string, any>) {  
    const [statistic, setStatistic] = useState(InitialData)
    return (
        <>
            <Statistic statistic={statistic} setStatistic={setStatistic} error={error}/>
            <Layout statistic={statistic} setStatistic={setStatistic} error={error}/>
        </>
    )
}