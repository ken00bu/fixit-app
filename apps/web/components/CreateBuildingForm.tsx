"use client"
import { Center, Text, Card, Stack, Title, Flex, PasswordInput, Button, Box, Input, Select, NumberInput } from "@mantine/core"
import { useForm, isEmail, isNotEmpty } from "@mantine/form"
import { IconAt, IconX} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { fetchFaculties, createBuilding } from "@/services/locationsServices"
import type { Skill } from "@/types/skill"
import { toast } from "@/lib/utils/toast"
import { createTechnician } from "@/services/usersServices"

type Form = {
    name: string
    floors: number
    facultyId: number
    isGeneral: boolean
}

export default function CreateBuildingForm({toggle, facultyId, refresh}: {toggle: () => void, facultyId: number, refresh: (state: any) => void}) {


    const form = useForm<Form>({
        mode: "controlled",
        initialValues: { name: '', floors: 0, facultyId: facultyId, isGeneral: false },
        validate: {
            name: isNotEmpty('Nama gedung tidak boleh kosong'),
            floors: isNotEmpty('Jumlah lantai tidak boleh kosong'),
        },
    })

    const createBuildingHandler = async (values: Form) => {
        try {
            const data = await createBuilding(values)
            console.log('data', data)
            toast.success('Berhasil menambahkan gedung' )
            refresh((prev: boolean) => !prev)
            form.reset()
            toggle()
        } catch (error) {
            toast.error('Gagal menambahkan gedung' + (error instanceof Error ? error.message : ''))
        }
    }

    return (
        <Card miw={'30%'} maw={{sm:"40%", base: '90%'}} p={30} radius={15}>
            <Flex align={'center'} justify={'space-between'} >
                <Title size={'h4'}>
                </Title>
                <Button pl={0} pr={0} color="transparent" variant="none"><IconX color="gray" onClick={()=>toggle()}/></Button>
            </Flex>
            <Box mb={32}>
                <Title order={3} fw={600} c="#1c1c1c" ta="center">
                    Masukan Data Gedung Baru
                </Title>
                <Text size="sm" c="dimmed" ta="center" mt={6}>
                    Lengkapi form berikut untuk menambahkan gedung.
                </Text>
            </Box>
            <form onSubmit={form.onSubmit((values) => {
                createBuildingHandler(values)
                form.reset()
            })}>
                <Stack gap={30}>
                    <Stack gap={10}>
                        <Input.Wrapper
                            label="Nama Gedung"
                            size="sm"
                            error={form.getInputProps("name").error}
                        >
                            <Input
                                size="sm"
                                radius="md"
                                placeholder="Masukan nama gedung"
                                py={5}
                                {...form.getInputProps("name")}
                            />
                        </Input.Wrapper>
                        <Input.Wrapper error={form.getInputProps('floors').error} label="Jumlah Lantai" size="sm">
                            <NumberInput
                                size="sm" radius={'md'} 
                                placeholder="Masukan jumlah lantai" 
                                py={5}
                                {...form.getInputProps('floors')}
                            /> {/* input username */}
                        </Input.Wrapper>

                    </Stack>

                    <Button
                        radius="md"
                        h="3rem"
                        type="submit"
                    >
                        Tambah Gedung
                    </Button>
                </Stack>
            </form>
        </Card>
    )
}