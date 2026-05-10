"use client"
export const dynamic = 'force-dynamic'
import { Center, Text, Card, Stack, Title, Flex, PasswordInput, Button, Box, ThemeIcon, List, em } from "@mantine/core"
import { Input } from "@mantine/core"
import { toast } from "../../lib/utils/toast"
import { IconAt, IconCircleCheck } from "@tabler/icons-react"
import { useForm, isEmail, isNotEmpty, matches } from "@mantine/form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { LoaderCircle } from "@/components/animate-ui/icons/loader-circle"
import { loginWithCredentials, loginWithToken } from "@/services/authServices"
import { useUserContext } from "@/components/UserProvider"

type LoginFormValues = {
    email: string
    password: string
}

export default function Login() {
    const { user, setUser } = useUserContext()
    const searchParams = useSearchParams()
    const router = useRouter()
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`)
    const [isLoading, setLoading] = useState(false)
    const [visible, { toggle }] = useDisclosure(false)

    const form = useForm<LoginFormValues>({
        mode: "controlled",
        initialValues: { email: "", password: "" },
        validate: {
            email: isEmail("Email tidak valid"),
            password: isNotEmpty("Masukan password"),
        },
    })

    // alur jika user mengklik link verifikasi dari email 
    const token = searchParams.get("token")
    useEffect(() => {

        if (!token) return

        const handleTokenLogin = async () => {
            try {
                const res = await loginWithToken(token)
                setUser(res.user)
                toast.success("Pendaftaran berhasil!", "Selamat datang kembali!")
                router.push(res.user.role === "admin" ? "/admin" : res.user.role === "technician" ? "/teknisi" : "/dashboard")
            } catch (error) {
                toast.error("Login gagal", "Token tidak valid atau sudah kadaluarsa.")
            }
        }
        handleTokenLogin()
            
    }, [token])

    // alur login biasa dengan email & password 
    const handleLogin = async (values: LoginFormValues) => {
        setLoading(true)
        try {
            const res = await loginWithCredentials(values.email, values.password)
            setUser(res.user)
            toast.success("Login Berhasil", "Selamat datang kembali!")
            console.log('role user: ' + res.user.role)
            if(res.user.role === "admin") {
                router.push("/admin")
            } else if(res.user.role === "technician") {
                router.push("/teknisi")
            } else {
                router.push("/dashboard")
            }
            
        } catch (error: any) {
            let message = error?.message ?? ""
            try {
                const parsed = JSON.parse(message)
                if (parsed?.message) message = parsed.message
            } catch {}

            const isCredentialError = message === "Invalid credentials"

            if (isCredentialError) {
                form.setFieldError("email", "Email atau password salah")
                form.setFieldError("password", "Email atau password salah")
            } else {
                toast.error("Login Gagal", "Terjadi kesalahan. Silakan coba lagi." + error)
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <Center miw="100vw" mih="100dvh">
            <Card withBorder={!isMobile} py={0} px={0} radius={10}>
                <Flex direction={{ base: "column", sm: "row" }}>


                    {/* ── Right panel (form) ── */}
                    <Box flex={1}>
                        <Stack py={50} px={50}>
                            <Stack gap={5}>
                                <Title order={1} size="h2">
                                    Login{" "}
                                    {isMobile && (
                                        <span style={{ color: "#004177" }}>Fixit</span>
                                    )}
                                </Title>
                                <Text opacity={0.5}>
                                    Masuk ke akun Anda untuk melanjutkan
                                </Text>
                            </Stack>

                            <form onSubmit={form.onSubmit(handleLogin)}>
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

                                        <PasswordInput
                                            label="Password"
                                            placeholder="Masukan password"
                                            visible={visible}
                                            onVisibilityChange={toggle}
                                            {...form.getInputProps("password")}
                                        />
                                    </Stack>

                                    <Button
                                        color="blue"
                                        leftSection={isLoading && <LoaderCircle animate />}
                                        radius="md"
                                        h="3rem"
                                        type="submit"
                                        loading={isLoading}
                                    >
                                        {isLoading ? "Mohon tunggu..." : "Masuk"}
                                    </Button>

                                    {/* Divider */}
                                    <Flex align="center" gap="sm">
                                        <Box h={1} bg="gray.3" style={{ flex: 1 }} />
                                        <Text size="sm" c="dimmed">atau</Text>
                                        <Box h={1} bg="gray.3" style={{ flex: 1 }} />
                                    </Flex>

                                    <Text ta="center" size="sm">
                                        Belum punya akun?{" "}
                                        <Link
                                            href="/register"
                                            style={{
                                                color: "#0089e1",
                                                fontWeight: 600,
                                                textDecoration: "none",
                                            }}
                                        >
                                            Daftar Sekarang
                                        </Link>
                                    </Text>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                </Flex>
            </Card>
        </Center>
    )
}
