"use client"
import { Center, Text, Card, Stack, Title, Flex, PasswordInput, Button, Box, Input, Select, NumberInput } from "@mantine/core"
import { useForm, isEmail, isNotEmpty } from "@mantine/form"
import { IconAt, IconX} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { createCategory } from "@/services/categoriesServices"
import type { Skill } from "@/types/skill"
import { toast } from "@/lib/utils/toast"
import { createTechnician } from "@/services/usersServices"

type Form = {
    name: string
    floors: number
    priorityId: number
    isGeneral: boolean
}

export default function CreateCategoryForm({toggle, priorityId, refresh}: {toggle: () => void, priorityId: number, refresh: (state: any) => void}) {


    const form = useForm<Form>({
        mode: "controlled",
        initialValues: { name: '', floors: 0, priorityId: priorityId, isGeneral: false },
        validate: {
            name: isNotEmpty('Nama kategori tidak boleh kosong'),
        },
    })

    const createcategoryHandler = async (values: Form) => {
        try {
            await createCategory(values.name, values.priorityId)
            toast.success('Berhasil menambahkan kategori')
            refresh((prev: any) => !prev)
            form.reset()
            toggle()
        } catch (error) {
            toast.error('Gagal menambahkan kategori' + (error instanceof Error ? error.message : ''))
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
                    Masukan Data Kategori Baru
                </Title>
                <Text size="sm" c="dimmed" ta="center" mt={6}>
                    Lengkapi form berikut untuk menambahkan kategori.
                </Text>
            </Box>
            <form onSubmit={form.onSubmit((values) => {
                createcategoryHandler(values)
                form.reset()
            })}>
                <Stack gap={30}>
                    <Stack gap={10}>
                        <Input.Wrapper
                            label="Nama kategori"
                            size="sm"
                            error={form.getInputProps("name").error}
                        >
                            <Input
                                size="sm"
                                radius="md"
                                placeholder="Masukan nama kategori"
                                py={5}
                                {...form.getInputProps("name")}
                            />
                        </Input.Wrapper>

                    </Stack>

                    <Button
                        radius="md"
                        h="3rem"
                        type="submit"
                    >
                        Tambah kategori
                    </Button>
                </Stack>
            </form>
        </Card>
    )
}