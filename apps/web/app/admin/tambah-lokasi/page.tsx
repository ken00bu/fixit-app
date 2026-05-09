'use client'
import { Stack, Group, Image, Title, Text, Badge, Card, Divider, SimpleGrid, ThemeIcon, Box, Accordion  } from "@mantine/core";
import { IconBuilding, IconSchool, IconStairs, IconCircleMinus, IconCirclePlus } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { Faculties as Locations } from "@/types/location";
import { toast } from "@/lib/utils/toast";
import { fetchLocations, deleteBuilding } from "@/services/locationsServices";
import CreateBuildingForm from "@/components/CreateBuildingForm";

export default function TambahLokasiPage(){
    const [ locations, setLocations ] = useState<Locations | null>(null)
    const [ refresh, setRefresh ] = useState(false)
    const [ selectedFaculty, setSelectedFaculty ] = useState<number | null>(null)
    const [ toggle, setToggle ] = useState(true)
    useEffect(()=>{
        async function fetchlocations(){
            try {
                const data = await fetchLocations()
                setLocations(data)
            } catch (error) {
                toast.error('Gagal mengambil data lokasi' + (error instanceof Error ? error.message : ''))
            }
        }
        fetchlocations()
    }, [refresh])

    const handleDeleteBuilding = async (buildingId: number) => {
        try {
            // await deleteBuilding(buildingId)
            const response = await deleteBuilding(buildingId)
            toast.success('Berhasil menghapus gedung')
            // Refresh data lokasi setelah penghapusan
            setRefresh(prev => !prev)
        } catch (error) {
            toast.error('Gagal menghapus gedung' + (error instanceof Error ? error.message : ''))
        }
    }

    const openModal = (facultyId: number) => {
        setSelectedFaculty(facultyId)
        setToggle(true)
    }


    if(!locations) return (
        <Group >
            <Text size="lg" c="dimmed">Memuat data lokasi...</Text>
        </Group>
    )
    
    return (
    <Stack gap="lg">
        { (toggle && selectedFaculty !== null) && (
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
                <CreateBuildingForm facultyId={selectedFaculty} refresh={setRefresh}  toggle={() => setToggle(false)} />
            </div> 
        ) }
        <Group justify="space-between" align="center">
            <Box>
            <Title order={2}>Fakultas & Gedung</Title>
            <Text c="dimmed" size="sm">
                Daftar fakultas beserta gedung yang berada di dalamnya
            </Text>
            </Box>
            <Badge size="lg" variant="light" color="blue">
            {locations.length} Fakultas
            </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 1  }} spacing="md">
            <Accordion order={3} defaultValue="Apples">
                {locations.map((faculty) => {
                    console.log(faculty)
                    if(!faculty.building) return null
                    return (
                        <Accordion.Item key={faculty.id} value={faculty.name}>
                            <Accordion.Control>
                                <Group gap="xs" justify="space-between" wrap="nowrap">
                                    <Group>
                                        <ThemeIcon size="md" radius="sm" variant="light" color={faculty.name === 'Umum' ? 'orange' : 'indigo'}>
                                            <IconSchool size={16}/>
                                        </ThemeIcon>
                                        <Text size="sm" fw={500} lineClamp={1}>
                                            {faculty.name}
                                        </Text>
                                    </Group>
                                    <Group mr={15}>
                                        <ThemeIcon size="md" radius="100" variant="light" color={'blue'} style={{cursor: 'pointer'}} onClick={() => openModal(faculty.id)}>
                                            <IconCirclePlus size={16}/>
                                        </ThemeIcon>
                                    </Group>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                {<Stack gap="xs">
                                    {faculty.building.map((b) => (
                                    <Card
                                        key={b.id}
                                        withBorder
                                        radius="sm"
                                        padding="xs"
                                        bg="var(--mantine-color-gray-0)"
                                    >
                                        <Group justify="space-between" wrap="nowrap">
                                            <Group gap="xs" wrap="nowrap">

                                                <Box>
                                                <Text size="sm" fw={500} lineClamp={1}>
                                                    {b.name}
                                                </Text>
                                                <Group gap={4}>
                                                    <IconStairs size={12} />
                                                    <Text size="xs" c="dimmed">
                                                    {b.floors} lantai
                                                    </Text>
                                                </Group>
                                                </Box>
                                                {b.isGeneral && (
                                                    <Badge size="xs" variant="light" color="orange">
                                                        Umum
                                                    </Badge>
                                                )}
                                            </Group>

                                            <ThemeIcon color="red" radius={100} variant='light' onClick={()=> handleDeleteBuilding(b.id)} style={{cursor: 'pointer'}}>
                                                <IconCircleMinus size={16} />
                                            </ThemeIcon>
                                        </Group>
                                    </Card>
                                    ))}
                                </Stack>}
                            </Accordion.Panel>
                        </Accordion.Item >
                    )
                })}
            </Accordion>
        </SimpleGrid>
    </Stack>
    )
}