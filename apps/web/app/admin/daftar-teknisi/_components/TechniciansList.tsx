"use client"
import { Title } from "@mantine/core"
import { Technician } from "@/types/technician"
import TechnicianCard from "./TechnicianCard"
import { useState } from "react"
import ViewTechnicianModal from "@/components/ViewTechnicianModal"

type ModalType = 'viewtechnician' | 'delete' | null

export default function TechniciansList({technicians}: {technicians: Technician[]}){
    const [ currentTechnician, setCurrentTechnician ] = useState<number | null>()
    const [ activeModal, setActiveModal ] = useState<ModalType>(null)

    const openModal = (type: ModalType, technicianId?: number) => {
        setActiveModal(type)
        console.log(`open modal ${type} with technicianId ${technicianId}`)
        technicianId && setCurrentTechnician(technicianId)
    }

    const closeModal = () => {
        setActiveModal(null)
        setCurrentTechnician(null)
    }

    const openViewTechnicianModal = (technicianId: number) => {
        console.log(`open view technician modal with id ${technicianId} dan currentTechnician ${currentTechnician}`)
        openModal('viewtechnician', technicianId)
    }


    return (
        <>
            {
                technicians.map((technician: Technician) => (
                    <TechnicianCard key={technician.id} technician={technician} onView={openViewTechnicianModal}/>
                ))
            }
            {
                activeModal  &&
                <div style={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>

                    {
                        activeModal === 'viewtechnician' && currentTechnician  &&
                        <ViewTechnicianModal toggle={closeModal} technicianId={currentTechnician} />
                    }

                </div>
            }
        </>
    )
}