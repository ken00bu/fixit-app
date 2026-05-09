'use client'
import { Stack, Group, Title, Text, Badge, Card, SimpleGrid, ThemeIcon, Box, Accordion  } from "@mantine/core";
import { IconCategory, IconClock, IconFlame, IconAlertTriangle, IconTool, IconLeaf, IconCircleMinus, IconCirclePlus } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { Categories } from "@/types/category";
import { toast } from "@/lib/utils/toast";
import { fetchCategories, deleteCategory } from "@/services/categoriesServices";
import CreateCategoryForm from "@/components/CreateCategoryForm";

export default function TambahKategoriPage(){
    const [ categories, setCategories ] = useState<Categories | null>(null)
    const [ refresh, setRefresh ] = useState(false)
    const [ selectedPriority, setSelectedPriority ] = useState<number | null>(null)
    const [ toggle, setToggle ] = useState(true)
    useEffect(()=>{
        async function fetchcategories(){
            try {
                const data = await fetchCategories()
                setCategories(data)
            } catch (error) {
                toast.error('Gagal mengambil data kategori' + (error instanceof Error ? error.message : ''))
            }
        }
        fetchcategories()
    }, [refresh])

    const handleDeleteCategory = async (categoryId: number) => {
        try {
            // await deleteCategory(categoryId)
            const response = await deleteCategory(categoryId)
            toast.success('Berhasil menghapus kategori')
            // Refresh data kategori setelah penghapusan
            setRefresh(prev => !prev)
        } catch (error) {
            toast.error('Gagal menghapus kategori' + (error instanceof Error ? error.message : ''))
        }
    }

    const openModal = (priorityId: number) => {
        setSelectedPriority(priorityId)
        setToggle(true)
    }


    if(!categories) return (
        <Group >
            <Text size="lg" c="dimmed">Memuat data kategori...</Text>
        </Group>
    )

    // grouping presentational by priority
    const grouped = categories.reduce<Record<string, { priority: typeof categories[number]['priority'], items: typeof categories }>>((acc, c) => {
        const key = c.priority.name
        if(!acc[key]) acc[key] = { priority: c.priority, items: [] as any }
        acc[key].items.push(c)
        return acc
    }, {})
    const order = ['Critical', 'Urgent', 'Regular', 'Low']
    const priorities = Object.values(grouped).sort((a, b) => order.indexOf(a.priority.name) - order.indexOf(b.priority.name))

    const priorityIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'critical': return { color: 'red', icon: <IconFlame size={16}/> }
            case 'urgent': return { color: 'orange', icon: <IconAlertTriangle size={16}/> }
            case 'regular': return { color: 'blue', icon: <IconTool size={16}/> }
            case 'low': return { color: 'teal', icon: <IconLeaf size={16}/> }
            default: return { color: 'gray', icon: <IconCategory size={16}/> }
        }
    }

    return (
    <Stack gap="lg">
        { (toggle && selectedPriority !== null) && (
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
                <CreateCategoryForm priorityId={selectedPriority} refresh={setRefresh}  toggle={() => setToggle(false)} />
            </div> 
        ) }
        <Group justify="space-between" align="center">
            <Box>
            <Title order={2}>Kategori Laporan</Title>
            <Text c="dimmed" size="sm">
                Daftar kategori beserta prioritas dan SLA-nya
            </Text>
            </Box>
            <Badge size="lg" variant="light" color="blue">
            {categories.length} Kategori
            </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 1  }} spacing="md">
            <Accordion order={3} >
                {priorities.map((group) => {
                    console.log(group)
                    if(!group.items) return null
                    const style = priorityIcon(group.priority.name)
                    return (
                        <Accordion.Item key={group.priority.id} value={group.priority.name}>
                            <Accordion.Control>
                                <Group gap="xs" justify="space-between" wrap="nowrap">
                                    <Group>
                                        <ThemeIcon size="md" radius="sm" variant="light" color={style.color}>
                                            {style.icon}
                                        </ThemeIcon>
                                        <Text size="sm" fw={500} lineClamp={1}>
                                            {group.priority.name}
                                        </Text>
                                    </Group>
                                    <Group mr={15}>
                                        <ThemeIcon size="md" radius="100" variant="light" color={'blue'} style={{cursor: 'pointer'}} onClick={() => openModal(group.priority.id)}>
                                            <IconCirclePlus size={16}/>
                                        </ThemeIcon>
                                    </Group>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                {<Stack gap="xs">
                                    {group.items.map((c) => (
                                    <Card
                                        key={c.id}
                                        withBorder
                                        radius="sm"
                                        padding="xs"
                                        bg="var(--mantine-color-gray-0)"
                                    >
                                        <Group justify="space-between" wrap="nowrap">
                                            <Group gap="xs" wrap="nowrap">

                                                <Box>
                                                <Text size="sm" fw={500} lineClamp={1}>
                                                    {c.name}
                                                </Text>
                                                <Group gap={4}>
                                                    <IconClock size={12} />
                                                    <Text size="xs" c="dimmed">
                                                    SLA {c.priority.slaHours} jam
                                                    </Text>
                                                </Group>
                                                </Box>
                                                <Badge size="xs" variant="light" color={style.color}>
                                                    Weight {c.priority.weight}
                                                </Badge>
                                            </Group>

                                            <ThemeIcon color="red" radius={100} variant='light' onClick={()=> handleDeleteCategory(c.id)} style={{cursor: 'pointer'}}>
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