"use client"

import { Box, Button, Center, Flex, Stack, Text, Title } from "@mantine/core"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUserContext } from "@/components/UserProvider"

export default function Forbidden() {
    const router = useRouter()
    const { user } = useUserContext()

    // tujuan tombol "Kembali ke beranda" disesuaikan dengan role
    const homeHref =
        user?.role === "admin"
            ? "/admin"
            : user?.role === "technician"
            ? "/teknisi"
            : user
            ? "/dashboard"
            : "/login"

    return (
        <Center miw="100vw" mih="100dvh" px="md">
            <Stack align="center" gap={28} maw={460} ta="center">
                <Stack gap={4} align="center">
                    <Text
                        fw={700}
                        size="5rem"
                        lh={1}
                    >
                        403
                    </Text>
                    <Box w={150} h={3} bg="blue" style={{ borderRadius: 2 }} />
                </Stack>

                <Stack gap={8} align="center">
                    <Title order={1} size="h2">
                        Akses ditolak
                    </Title>
                    <Text c="dimmed" size="sm" maw={380}>
                        Halaman ini tidak dapat diakses dengan akun Anda.
                        Pastikan Anda masuk menggunakan akun yang memiliki
                        izin yang sesuai.
                    </Text>
                </Stack>

                <Flex
                    gap="sm"
                    direction={{ base: "column", xs: "row" }}
                    w="100%"
                    justify="center"
                >
                    <Button
                        component={Link}
                        href={homeHref}
                        color="#004B89"
                        radius="md"
                        h="2.75rem"
                        bg={'blue'}
                    >
                        Ke beranda
                    </Button>
                </Flex>
            </Stack>
        </Center>
    )
}
