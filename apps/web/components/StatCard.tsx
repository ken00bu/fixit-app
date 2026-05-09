"use client"

import { Title, Text, Card, Group, Stack, ThemeIcon} from "@mantine/core"
export type StatCardConfig = {
    label: string
    value: number
    bgColor: string
    icon: React.ReactNode
}

// -- Component --

export function StatCard({ label, value, bgColor, icon }: StatCardConfig) {
    return (
        <Card
            flex={1}
            py={{ base: 20, sm: 24 }}
            px={{ base: 20, sm: 24 }}
            radius="md"
            withBorder
        >
            <Stack gap={16}>
                <Group justify="space-between" align="flex-start">
                    <ThemeIcon
                        variant="light"
                        size={44}
                        radius="md"
                        style={{ backgroundColor: bgColor }}
                    >
                        {icon}
                    </ThemeIcon>
                    <Title order={2} fw={700} lh={1}>
                        {value}
                    </Title>
                </Group>
                <Text fw={500} c="dimmed" size="sm" lh={1}>
                    {label}
                </Text>
            </Stack>
        </Card>
    )
}