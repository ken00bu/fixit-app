export const dynamic = 'force-dynamic'
import Header from "./_components/Header";
import MainLayout from "./_components/MainLayout"
import { fetchTechnicianSummary } from "@/services/usersServices";

export default async function ManageTechnicians() {
  let statistic: any = null;
  let isError = false
  try {
    statistic = await fetchTechnicianSummary()
  } catch (error) {
    console.log('error fetching statistic', error)
    isError = true
  }

  console.log('isi statistic', statistic)
  if(!statistic) return null

  return (
    <>  
      <MainLayout InitialData={statistic} error={isError} />
    </>
  )
}


