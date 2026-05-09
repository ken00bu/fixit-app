"use client"
import { Center, Text, Card, Stack, Title, Flex, PasswordInput, Button, Box, Input, Select } from "@mantine/core"
import { useForm, isEmail, isNotEmpty } from "@mantine/form"
import { IconAt, IconX} from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { fetchSkills } from "@/services/skillsService"
import type { Skill } from "@/types/skill"
import { toast } from "@/lib/utils/toast"
import { createTechnician } from "@/services/usersServices"

type Form = {
    username: string
    email: string
    password: string
    skill: string
}

export default function CreateTechnicianForm({toggle}: {toggle: () => void}) {

    const [ skills, setSkills ] = useState<Skill[]>([])

    const form = useForm<Form>({
        mode: "controlled",
        initialValues: { email: "", password: "", username: "", skill: "" },
        validate: {
            email: (value)=>{
                if (!value) return "Masukan email"
                if(!/^[\w.+-]+@([\w-]+\.)*upr\.ac\.id$/i.test(value)) return "Email harus berakhiran @upr.ac.id"
                return null
            },
            password: (value)=>{
                if (!value) return "Masukan password"
                if(!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) return "Password minimal 8 karakter, harus mengandung huruf besar dan angka"
                return null
            },
            username: isNotEmpty("Masukan username"),
            skill: isNotEmpty("Skill tidak boleh kosong"),
        },
    })

    const handleCreateTechnician = async(values: Form) => {
        try {
            const skillId = parseInt(values.skill)
            const user = await createTechnician({ 
                username: values.username, 
                email: values.email, 
                password: values.password, 
                skillId 
            })
            toast.success('Teknisi berhasil ditambahkan', `Teknisi ${user.username} dengan skill ${skills.find(skill => skill.id === skillId)?.name} berhasil ditambahkan.`)
            form.reset()
            toggle()
        } catch (error) {
            toast.error('Gagal menambahkan teknisi', `Maaf, terjadi kesalahan saat menambahkan teknisi. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    useEffect(()=>{
        const fetchSkillsData = async () => {
            try {
                const data = await fetchSkills()
                console.log(data)
                setSkills(data)
            } catch (error) {
                toast.error('Gagal memuat data skill', `Maaf, terjadi kesalahan saat memuat data skill. Silakan coba lagi nanti. Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
                console.log(error)
            }
        }
        fetchSkillsData()
    },[])
    console.log("skills state:", skills)
    console.log("select data:", skills.map((skill) => ({ value: skill.id.toString(), label: skill.name })))
    return (
        <Card miw={'30%'} mih={'80%'} maw={{sm:"40%", base: '90%'}} p={30} radius={15}>
            <Flex align={'center'} justify={'space-between'} >
                <Title size={'h4'}>
                </Title>
                <Button pl={0} pr={0} color="transparent" variant="none"><IconX color="gray" onClick={()=>toggle()}/></Button>
            </Flex>
            <Box mb={32}>
                <Title order={3} fw={600} c="#1c1c1c" ta="center">
                    Masukan Data Teknisi Baru
                </Title>
                <Text size="sm" c="dimmed" ta="center" mt={6}>
                    Lengkapi form berikut untuk menambahkan teknisi.
                </Text>
            </Box>
            <form onSubmit={form.onSubmit(handleCreateTechnician)}>
                <Stack gap={30}>
                    <Stack gap={10}>
                        <Input.Wrapper
                            label="Email"
                            size="sm"
                            error={form.getInputProps("email").error}
                        >
                            <Input
                                size="sm"
                                radius="md"
                                placeholder="Masukan email aktif"
                                py={5}
                                leftSection={<IconAt size={20} />}
                                {...form.getInputProps("email")}
                            />
                        </Input.Wrapper>
                            <Input.Wrapper error={form.getInputProps('username').error} label="Nama Lengkap" size="sm">
                                <Input 
                                    size="sm" radius={'md'} 
                                    placeholder="Masukan nama lengkap" 
                                    py={5}
                                    {...form.getInputProps('username')}
                                /> {/* input username */}
                            </Input.Wrapper>
                        <PasswordInput
                            label="Password"
                            placeholder="Masukan password"
                            onVisibilityChange={toggle}
                            {...form.getInputProps("password")}
                        />
                        <Box flex={1}>
                            <Select
                                label="Skill"
                                size="md"
                                radius={10}
                                comboboxProps={{ zIndex: 1000 }}
                                data={skills.map((skill: Skill) => ({ value: skill.id.toString(), label: skill.name }))}
                                {...form.getInputProps('skill')}
                                placeholder="Skill Teknisi"
                                searchable
                                styles={{ input: { border: '2px solid #d2d2d2', '&:focus': { borderColor: 'orange', outline: 'none' } } }}
                            />
                        </Box>
                    </Stack>

                    <Button
                        radius="md"
                        h="3rem"
                        type="submit"
                    >
                        Tambah Teknisi
                    </Button>
                </Stack>
            </form>
        </Card>
    )
}