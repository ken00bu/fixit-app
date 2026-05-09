import { fetchReportStatistics } from "@/services/reportServices";
import Header from "./_components/Header";
import MainLayout from "./_components/MainLayout";

export default async function UserDashboard() {
  let statistic: any = null;
  let isError = false
  try {
    statistic = await fetchReportStatistics()
  } catch (error) {
    isError = true
  }

  console.log('isi statistic', statistic)
  if(!statistic) return null

  return (
    <>
      <Header/>
      <MainLayout InitialData={statistic} error={isError}/>
    </>
  )
}


