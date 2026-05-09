import { http } from "../lib/http";

async function fetchFaculties(){
    return await http('/faculties')
}

async function fetchBuildings(faculty?: string, isGeneral?: boolean){
    return await http('/buildings', {
        params: {
            ...faculty && { faculty },
            ...isGeneral && { isGeneral: isGeneral.toString() }
        }
    })
}

async function fetchLocations(){
    return await http('/locations')
}

async function deleteBuilding(buildingId: number){
    return await http(`/buildings/${buildingId}`, {
        method: 'DELETE'
    })
}

async function createBuilding(data: { name: string, floors: number, facultyId: number, isGeneral: boolean }){
    return await http('/buildings', {
        method: 'POST',
        body: data
    })
}

export { fetchFaculties, fetchBuildings, fetchLocations, deleteBuilding, createBuilding }