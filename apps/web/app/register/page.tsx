'use client'
import { Center, Text, Card, Stack, Title, Flex, Input, PasswordInput, Button, Box, em } from "@mantine/core"
import { register } from "@/services/authServices";
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { IconAt } from "@tabler/icons-react"
import { useForm, isNotEmpty, matches } from "@mantine/form"
import { toast } from "@/lib/utils/toast";
import Link from "next/link"
import { LoaderCircle } from "@/components/animate-ui/icons/loader-circle";
import { useState } from "react";

function validatePassword(password: string){
    let errors = ''

    if (password.length < 8) {
        errors += " Minimal 8 karakter, "
    }

    if (!/[A-Z]/.test(password)) {
        errors += "Minimal 1 Huruf besar, "
    }

    if (!/\d/.test(password)) {
        errors += " Minimal 1 Angka, "
    }

    const error = errors.slice(0, -2);
    return error.length > 0 ? error : null
    
}

export default function Login(){
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [ isLoading, setLoading ] = useState(false)
    const [ isFinish, setFinish ] = useState(false)
    const [visible, {toggle}] = useDisclosure(false)
    const form: any = useForm({
        mode: 'controlled',
        initialValues: {
            username: '',
            email: '',
            password: '',
            passwordConfirm: ''
        },
        validate: {
            username: isNotEmpty('Nama tidak boleh kosong'),
            // email: matches(
            //     /^[\w.+-]+@([\w-]+\.)*upr\.ac\.id$/i,
            //     'Email harus menggunakan domain @upr.ac.id'
            // ),
            password: (password)=> validatePassword(password),
            passwordConfirm: (value, values)=> {
                const error = validatePassword(value)
                return value === values.password ? value === '' ? 'Password kosong' : error != null ? 'Perbaiki password kamu' : null : 'Password tidak sama'
            }
        }
    })
    
    const signUp = async (values: any) => {
        setLoading(true)
        try {
            const res = await register(values)
            setFinish(true)
            toast.success("Register Berhasil", "Email verifikasi telah terkirim. Silakan cek inbox untuk melanjutkan.")
            console.log('res', res)
        } catch (error: any) {
            toast.error("Register Gagal", "Terjadi kesalahan. Silakan coba lagi." + error)
            console.log('error', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Center miw={'100vw'} mih={'100dvh'} >
            { isFinish ? (
                <Card withBorder py={60} px={50} radius="lg" >
                    <Stack align="center" gap="md">
                        <Title order={2} ta="center" c={'#0089e1'}>
                            Pendaftaran Berhasil
                        </Title>
                        <Text c="dimmed" ta="center">
                            Kami telah mengirim email verifikasi ke alamat Anda. <br/>
                            Silakan cek inbox untuk mengaktifkan akun.
                        </Text>
                        <Link href={"/login"} style={{color: '#0089e1'}}>
                            <Button mt="sm">
                                Kembali ke Login
                            </Button>
                        </Link>
                    </Stack>
                </Card>
            ) : (
                <Card bg={'white'}  radius={10} withBorder={isMobile ? false : true}>
                    <Stack gap={40} m={{ base: 20, sm: 50}}>
                        <Flex direction={"column"} justify={'center'} gap={"xs"}>
                            <Title order={1} size={"h2"} ta={'center'}>
                                Daftar Akun <span style={{color: '#0089e1'}}>Fixit</span>
                            </Title>
                            <Text opacity={0.5} ta={'center'}>
                                Buat akun fixit untuk melaporkan atau menyalurkan aspirasi kamu
                            </Text>
                        </Flex>
                        <form action="" onSubmit={form.onSubmit((values: any)=>signUp(values))}>
                            <Stack gap={"xl"}>
                                <Stack>
                                    <Input.Wrapper error={form.getInputProps('username').error} label="Nama Lengkap" size="sm">
                                        <Input 
                                            size="sm" radius={'md'} 
                                            placeholder="Masukan nama lengkap" 
                                            py={5}
                                            {...form.getInputProps('username')}
                                        /> {/* input username */}
                                    </Input.Wrapper>
                                    <Input.Wrapper label="Email" size="sm" error={form.getInputProps('email').error} >
                                        <Input 
                                            size="sm" radius={'md'} 
                                            placeholder="Masukan email aktif" 
                                            py={5} leftSection={<IconAt size={20}/>}
                                            {...form.getInputProps('email')}
                                        /> {/* input email */}
                                    </Input.Wrapper>
                                </Stack>
                                <Stack>
                                    <PasswordInput  
                                        label="Password" 
                                        description="Password harus minimal: 8 karakter, 1 huruf besar, 1 angka" 
                                        placeholder="Masukan password" 
                                        visible={visible} onVisibilityChange={toggle}
                                        {...form.getInputProps('password')}
                                    /> {/* input password */}
                                        
                                    <PasswordInput 
                                        label="Konfirmasi password" 
                                        placeholder="Konfirmasi password" 
                                        visible={visible} onVisibilityChange={toggle}
                                        {...form.getInputProps('passwordConfirm')}
                                    /> {/* input password confirm */}
                                </Stack>
                                <Stack gap={20}>
                                    <Button color="#0089e1" leftSection={isLoading && <LoaderCircle animate />} radius={'md'} h={'3rem'} type="submit">
                                        {isLoading ? 'Tunggu Sebentar...' : 'Daftar Sekarang'}
                                    </Button>
                                    <Flex align="center" gap="sm">
                                        <Box h={1} bg="gray.3" style={{ flex: 1 }} />
                                        <Text size="sm" c="dimmed">
                                            atau
                                        </Text>
                                        <Box h={1} bg="gray.3" style={{ flex: 1 }} />
                                    </Flex>
                                    <Text ta={'center'} size="0.9rem">
                                        Sudah punya akun? <Link href={'/login'} style={{ color: "#0089e1", fontWeight: 600, textDecoration: "none", }}>Login disini</Link>
                                    </Text>
                                </Stack>
                            </Stack>

                        </form>
                    </Stack>
                </Card>) }
        </Center>
    )
}