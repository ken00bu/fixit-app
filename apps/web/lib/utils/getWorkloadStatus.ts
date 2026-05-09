export const getWorkloadStatus = (totalWeight: number) => {
    if(totalWeight === 0)  return { label: 'Nyantai',   color: 'green' }
    if(totalWeight <= 4)   return { label: 'Longgar',   color: 'yellow' }
    if(totalWeight <= 11)  return { label: 'Sibuk',     color: 'orange' }
    return { label: 'Kewalahan', color: 'red' }
}