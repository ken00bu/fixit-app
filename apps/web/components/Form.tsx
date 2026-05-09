'use client'
import { Flex, Stack, Card, Title, Text, Box, Center, TextInput, NumberInput, Textarea, Button, Select, Group, ThemeIcon, Badge } from "@mantine/core";
import { IconCloudUpload, IconArrowNarrowLeft, IconPhoto, IconMapPin, IconCategory, IconFileDescription, IconExclamationCircleFilled, IconStopwatch } from "@tabler/icons-react";
import { useForm, isNotEmpty, hasLength } from "@mantine/form"
import { useHover } from '@mantine/hooks';
import type { Category } from "@/types/category";
import type { Faculty, Building } from "@/types/location";
import { toast } from "@/lib/utils/toast";
import { fetchCategories } from "@/services/categoriesServices";
import { fetchFaculties, fetchBuildings } from "@/services/locationsServices";
import { useEffect, useState, useRef } from "react";
import { fetchReportById } from "@/services/reportServices";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormValues } from "@/types/form";
import { useParams } from 'next/navigation';
import { IMG_URL } from "@/config/config";

const inputStyles = {
    input: {
        borderRadius: '10px',
        border: '1.5px solid #E9ECEF',
        backgroundColor: '#F8F9FA',
        '&:focus': {
            borderColor: '#2563EB',
            backgroundColor: '#FFFFFF',
        }
    }
}

function formatSlaHours(hours: number): string {
    if (hours < 24) return `${hours} jam`
    const days = Math.floor(hours / 24)
    const remaining = hours % 24
    if (remaining === 0) return `${days} hari`
    return `${days} hari ${remaining} jam`
}

export default function Form({ mode = 'create', onSubmit, reportId }: Record<string, any>) {
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [facultyData, setFacultyData] = useState<Faculty[]>([]);
    const [buildingData, setBuildingData] = useState<Record<string, any>>([]);
    const [maxFloor, setMaxFloor] = useState<number>(1)
    const inputFileRef = useRef<HTMLInputElement>(null)
    const reportRef = useRef<any>(null)
    const { hovered, ref } = useHover()
    const [ report, setReport ] = useState<any>(null)
    const router = useRouter()

    const form = useForm<FormValues>({
        mode: 'controlled',
        initialValues: {
            faculty: '',
            file: null,
            building: '',
            floor: '',
            room: '',
            detail: '',
            category: '',
            title: '',
            description: '',
        },
        validate: {
            faculty: (value) => {
                const isExist = facultyData.find((faculty: Faculty) => faculty.name === value)
                return isExist ? null : 'faculty tidak valid'
            },
            building: (value) => {
                const isExist = buildingData.find((building: Building) => building.name === value)
                return isExist ? null : 'building tidak valid'
            },
            file: isNotEmpty('Gambar tidak ada'),
            room: isNotEmpty('room Kosong'),
            category: (value) => {
                const isExist = categoryData.find((category: Category) => category.name === value)
                return isExist ? null : 'category tidak valid'
            },
            floor: (value) => {
                return Number(value) >= 1 ? null : 'Lantai tidak boleh kosong'
            },
            description: hasLength({ min: 10 }, 'Minimal 10 karakter'),
            title: hasLength({ min: 10, max: 40 }, 'Minimal 10 karakter, Maksimal 40 Karakter')
        }
    })

    const selectedCategory = categoryData.find((c) => c.name === form.values.category)

    const handleFileChange = () => {
        const files = inputFileRef.current?.files;
        if (files && files.length > 0) {
            form.setFieldValue('file', files[0])
        }
    };

    useEffect(() => {
        if (form.values.building && mode != 'edit') {
            form.setFieldValue('floor', '')
        }

        if (!buildingData || !form.values.building) return setMaxFloor(1)
        const name = form.values.building
        const building = buildingData.find((building: Building) => building.name === name)
        if (building) setMaxFloor(building.floors)

    }, [form.values.building, buildingData])

    useEffect(() => {
        const handleFetchFaculties = async () => {
            try {
                const faculties = await fetchFaculties()
                setFacultyData(faculties)
            } catch (error) {
                toast.error('Gagal mengambil data faculty', `Maaf, terjadi kesalahan saat mengambil data faculty. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }

        const handleFetchCategories = async () => {
            try {
                const categories = await fetchCategories()
                setCategoryData(categories)
            } catch (error) {
                toast.error('Gagal mengambil data category', `Maaf, terjadi kesalahan saat mengambil data category. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }

        handleFetchCategories()
        handleFetchFaculties()
    }, [])

    useEffect(() => {
        if (mode !== 'edit') return
        const handleFetchReport = async () => {
            try {
                const report = await fetchReportById(Number(reportId))
                setReport(report)
                reportRef.current = report
                form.setValues({
                    title: report.title,
                    faculty: report.location.building.faculty?.name || 'Umum',
                    building: report.location.building.name,
                    file: `${IMG_URL}/${report.imgUrl}`,
                    floor: report.location.floor,
                    room: report.location.room,
                    detail: report.location.detail,
                    category: report.category.name,
                    description: report.description
                })
            } catch (error) {
                console.error('Error fetching report:', error)
            }
        }
        handleFetchReport()
    }, [])

    useEffect(() => {
        // Saat inisialisasi dari report (edit mode), JANGAN reset building/floor
        // karena value-nya sudah di-set dari fetchReport.
        if (!reportRef.current) {
            setBuildingData([{ 'name': '-' }])
            form.setFieldValue('building', '-')
            form.setFieldValue('floor', '')
        }
        if (!form.values.faculty) {
            reportRef.current = undefined
            return
        }

        const handleFetchBuildings = async () => {
            try {
                const buildings = await fetchBuildings(form.values.faculty, true)
                setBuildingData(buildings)
            } catch (error) {
                toast.error(
                    'Gagal mengambil data building',
                    `Maaf, terjadi kesalahan saat mengambil data building. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`
                )
            } finally {
                // setelah buildings ter-fetch, mode edit selesai inisialisasi
                reportRef.current = undefined
            }
        }
        handleFetchBuildings()
    }, [form.values.faculty])

    return (
        <Flex gap={24} direction={{ base: 'column', md: 'row' }} style={{position: 'relative'}} justify="center" align="flex-start">

            <form onSubmit={form.onSubmit((values: any) => onSubmit(values, buildingData, categoryData, form.reset))}>
                <Stack gap={24}>

                    {/* Section 1: Apa yang rusak? */}
                    <Card radius={16} p={28} withBorder>
                        <Group gap={10} mb={20}>
                            <Stack gap={0}>
                                <Title order={5} mb={20}>Apa yang rusak?</Title>
                            </Stack>
                        </Group>

                        <Stack gap={16}>
                            <Textarea
                                label="Judul Laporan"
                                rows={1}
                                autosize
                                maxRows={2}
                                size="md"
                                placeholder="Jelaskan masalah secara singkat"
                                withAsterisk
                                {...form.getInputProps('title')}
                                styles={inputStyles}
                            />
                            <Textarea
                                label="Deskripsi Masalah"
                                rows={4}
                                size="md"
                                placeholder="Apa yang rusak, sejak kapan, apakah ada bunyi/bau/asap?"
                                withAsterisk
                                {...form.getInputProps('description')}
                                styles={inputStyles}
                            />
                            <Select
                                {...(report?.status === 'progress' ? { disabled: true } : {})}
                                label="Kategori"
                                size="md"
                                radius={10}
                                data={categoryData.map((value: Category) => value.name)}
                                {...form.getInputProps('category')}
                                placeholder="Pilih kategori masalah"
                                withAsterisk
                                searchable
                                styles={inputStyles}
                            />
                        </Stack>
                    </Card>

                    {/* Section 2: Foto Bukti */}
                    <Card radius={16} p={28} withBorder>
                        <Group gap={10} mb={20}>
                            <Stack gap={0} mb={10}>
                                <Title order={5} mb={20}>Foto Bukti (JPG/PNG)</Title>
                            </Stack>
                        </Group>

                        <input
                            ref={inputFileRef}
                            type="file"
                            accept="image/jpeg, image/png"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        <Box
                            ref={ref}
                            bd={`1.5px dashed ${form.errors.file ? '#E5262C' : hovered ? '#2563EB' : '#CED4DA'}`}
                            bg={hovered ? (form.errors.file ? '#FFF5F5' : '#F0F7FF') : '#F8F9FA'}
                            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                            bdrs={12}
                            h="12rem"
                            onClick={() => inputFileRef.current && inputFileRef.current.click()}
                        >
                            <Flex h="100%" justify="center" align="center">
                                {!form.values.file ? (
                                    <Stack justify="center" align="center" gap={8}>
                                        <ThemeIcon
                                            variant="light"
                                            color={form.errors.file ? 'red' : 'blue'}
                                            size={44}
                                            radius="xl"
                                        >
                                            <IconCloudUpload size={22} />
                                        </ThemeIcon>
                                        <Stack justify="center" align="center" gap={2}>
                                            <Text fw={600} size="sm" c={form.errors.file ? 'red' : '#2563EB'}>
                                                Klik untuk upload foto
                                            </Text>
                                            <Text size="xs" c={form.errors.file ? 'red' : 'dimmed'}>
                                                Maksimal 1 foto, format JPG/PNG
                                            </Text>
                                        </Stack>
                                    </Stack>
                                ) : (
                                    <Stack gap={8} align="center">
                                        <Image
                                            src={form.values.file instanceof File ? URL.createObjectURL(form.values.file) : form.values.file}
                                            alt="preview"
                                            width={200} height={100}
                                            style={{ objectFit: 'cover', borderRadius: 8 }}
                                            unoptimized={form.values.file instanceof File ? false : true}
                                        />
                                        <Text c="dimmed" size="xs">Klik untuk mengganti gambar</Text>
                                    </Stack>
                                )}
                            </Flex>
                        </Box>
                        {form.errors.file && (
                            <Text c="red" size="xs" mt={6}>{form.errors.file}</Text>
                        )}
                    </Card>

                    {/* Section 3: Lokasi */}
                    <Card radius={16} p={28} withBorder>
                        <Group gap={10} mb={20}>
                            <Stack gap={0}>
                                <Title order={5} mb={20}>Di mana lokasinya?</Title>
                            </Stack>
                        </Group>

                        <Stack gap={16}>
                            <Select
                                label="Fakultas"
                                opacity={report?.status === 'progress' ? 0.5 : 1}
                                disabled={report?.status === 'progress'}
                                size="md"
                                radius={10}
                                data={facultyData.map((value: Faculty) => value.name)}
                                {...form.getInputProps('faculty')}
                                placeholder="Pilih Fakultas"
                                withAsterisk
                                searchable
                                styles={inputStyles}
                            />

                            <Flex gap={12} align="flex-start">
                                <Select
                                    label="Gedung"
                                    key={`building-${form.values.faculty}`}
                                    size="md"
                                    disabled={!form.values.faculty || report?.status === 'progress'}
                                    opacity={!form.values.faculty || report?.status === 'progress' ? 0.5 : 1}
                                    data={buildingData.map((value: Building) => value.name)}
                                    {...form.getInputProps('building')}
                                    placeholder="Pilih Gedung"
                                    withAsterisk
                                    searchable
                                    radius={10}
                                    style={{ flex: 3 }}
                                    styles={inputStyles}
                                />
                                <NumberInput
                                    label="Lantai"
                                    size="md"
                                    readOnly={!form.values.building || form.values.building === '-' || report?.status === 'progress'}
                                    opacity={!form.values.building || form.values.building === '-' || report?.status === 'progress' ? 0.5 : 1}
                                    min={1}
                                    max={maxFloor}
                                    {...form.getInputProps('floor')}
                                    defaultValue={1}
                                    minLength={1}
                                    radius={10}
                                    style={{ flex: 1 }}
                                    styles={inputStyles}
                                />
                            </Flex>

                            <TextInput
                                readOnly={report?.status === 'progress'}
                                opacity={report?.status === 'progress' ? 0.5 : 1}
                                label="Ruangan"
                                size="md"
                                {...form.getInputProps('room')}
                                placeholder="Contoh: Ruang 301, Lab Jaringan"
                                withAsterisk
                                radius={10}
                                styles={inputStyles}
                            />

                            <Textarea
                                readOnly={report?.status === 'progress'}
                                opacity={report?.status === 'progress' ? 0.5 : 1}
                                label="Detail Lokasi Spesifik"
                                rows={2}
                                size="md"
                                {...form.getInputProps('detail')}
                                placeholder="Contoh: Sudut kiri dekat jendela"
                                radius={10}
                                styles={inputStyles}
                            />
                        </Stack>
                    </Card>

                    <Box w={{ base: '100%', md: 280 }} hiddenFrom="sm" style={{
                        flexShrink: 0,
                        position: 'sticky',
                        top: 0,
                        alignSelf: 'flex-start',
                    }}>
                        <Card radius={16} p={25} withBorder>
                            <Title order={5} mb={20}>Detail Kategori</Title>

                            <Stack gap={20}>
                                <Flex gap={12} align="center">
                                    <Box bg={'#EEF6FE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                        <Center>
                                            <IconCategory size={20} color="#007CE6" />
                                        </Center>
                                    </Box>
                                    <Stack gap={2}>
                                        <Text size="xs" c="dimmed">Kategori</Text>
                                        <Text size="sm" fw={600}>
                                            {selectedCategory?.name ?? '—'}
                                        </Text>
                                    </Stack>
                                </Flex>

                                <Flex gap={12} align="center">
                                    <Box bg={'#FFF7EE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                        <Center>
                                            <IconExclamationCircleFilled size={20} color="#F25923" />
                                        </Center>
                                    </Box>
                                    <Stack gap={2}>
                                        <Text size="xs" c="dimmed">Prioritas</Text>
                                        <Text size="sm" fw={600} c={selectedCategory ? '#F25923' : undefined}>
                                            {selectedCategory?.priority.name ?? '—'}
                                        </Text>
                                    </Stack>
                                </Flex>

                                <Flex gap={12} align="center">
                                    <Box bg={'#FAF5FE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                        <Center>
                                            <IconStopwatch size={20} color="#9725E3" />
                                        </Center>
                                    </Box>
                                    <Stack gap={2}>
                                        <Text size="xs" c="dimmed">Estimasi SLA</Text>
                                        <Text size="sm" fw={600}>
                                            {report?.slaDate ? `${Math.max(0, Math.ceil((new Date(report.slaDate).getTime() - Date.now()) / (1000 * 60 * 60)))} jam tersisa` : (selectedCategory ? formatSlaHours(selectedCategory.priority.slaHours) : '—')}
                                        </Text>
                                    </Stack>
                                </Flex>
                            </Stack>

                            {!selectedCategory && (
                                <Text size="xs" c="dimmed" mt={16} ta="center">
                                    Pilih kategori untuk melihat detail prioritas
                                </Text>
                            )}
                        </Card>
                    </Box>

                    {/* Actions */}
                    <Group justify="flex-end" gap={12} >
                        <Button
                            variant="outline"
                            color="gray"
                            h={46}
                            px={24}
                            radius={10}
                            onClick={() => form.reset()}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            h={46}
                            px={32}
                            radius={10}
                        >
                            {mode === 'create' ? 'Kirim Laporan' : 'Simpan Perubahan'}
                        </Button>
                    </Group>


                </Stack>
            </form>

            <Box w={{ base: '100%', md: 280 }} visibleFrom="sm" style={{
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                alignSelf: 'flex-start',
            }}>
                <Card radius={16} p={25} withBorder>
                    <Title order={5} mb={20}>Detail Kategori</Title>

                    <Stack gap={20}>
                        <Flex gap={12} align="center">
                            <Box bg={'#EEF6FE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                <Center>
                                    <IconCategory size={20} color="#007CE6" />
                                </Center>
                            </Box>
                            <Stack gap={2}>
                                <Text size="xs" c="dimmed">Kategori</Text>
                                <Text size="sm" fw={600}>
                                    {selectedCategory?.name ?? '—'}
                                </Text>
                            </Stack>
                        </Flex>

                        <Flex gap={12} align="center">
                            <Box bg={'#FFF7EE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                <Center>
                                    <IconExclamationCircleFilled size={20} color="#F25923" />
                                </Center>
                            </Box>
                            <Stack gap={2}>
                                <Text size="xs" c="dimmed">Prioritas</Text>
                                <Text size="sm" fw={600} c={selectedCategory ? '#F25923' : undefined}>
                                    {selectedCategory?.priority.name ?? '—'}
                                </Text>
                            </Stack>
                        </Flex>

                        <Flex gap={12} align="center">
                            <Box bg={'#FAF5FE'} p={10} style={{ borderRadius: 10, flexShrink: 0 }}>
                                <Center>
                                    <IconStopwatch size={20} color="#9725E3" />
                                </Center>
                            </Box>
                            <Stack gap={2}>
                                <Text size="xs" c="dimmed">Estimasi SLA</Text>
                                <Text size="sm" fw={600}>
                                    {selectedCategory ? formatSlaHours(selectedCategory.priority.slaHours) : '—'}
                                </Text>
                            </Stack>
                        </Flex>
                    </Stack>

                    {!selectedCategory && (
                        <Text size="xs" c="dimmed" mt={16} ta="center">
                            Pilih kategori untuk melihat detail prioritas
                        </Text>
                    )}
                </Card>
            </Box>
        </Flex>
    )
}