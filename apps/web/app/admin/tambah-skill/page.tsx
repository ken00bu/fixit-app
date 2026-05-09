'use client'
import {
  Card, Stack, Group, Badge, Text, Title, Divider, SimpleGrid, ThemeIcon, Box, } from '@mantine/core';
import { IconTool, IconBolt, IconAirConditioning, IconDeviceDesktop, IconArmchair, IconDroplet, IconBuildingFactory2, IconPlant, IconStar, } from '@tabler/icons-react';

type Skill = {
  id: number;
  name: string;
};
const skills = [
    { id: 1, name: 'Kelistrikan', color: 'yellow', icon: <IconBolt size={22} /> },
    { id: 2, name: 'Plumbing', color: 'blue', icon: <IconDroplet size={22} /> },
    { id: 3, name: 'HVAC', color: 'cyan', icon: <IconAirConditioning size={22} /> },
    { id: 4, name: 'IT', color: 'indigo', icon: <IconDeviceDesktop size={22} /> },
    { id: 5, name: 'Sipil', color: 'gray', icon: <IconBuildingFactory2 size={22} /> },
    { id: 6, name: 'Furniture', color: 'orange', icon: <IconArmchair size={22} /> },
    { id: 7, name: 'Pertamanan', color: 'green', icon: <IconPlant size={22} /> },
    { id: 8, name: 'Umum', color: 'teal', icon: <IconStar size={22} /> },
];

export default function SkillList() {

    return (
        <Stack gap="lg">
        <Group justify="space-between" align="center">
            <Box>
            <Title order={2}>Keahlian Teknisi</Title>
            <Text c="dimmed" size="sm">
                Daftar skill yang dimiliki oleh teknisi di sistem
            </Text>
            </Box>
            <Badge size="lg" variant="light" color="blue">
            {skills.length} Skill
            </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
            {skills.map((skill) => (
            <Card key={skill.id} withBorder radius="md" padding="lg">
                <Stack gap="sm">
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                    <ThemeIcon size={42} radius="md" variant="light" color={skill.color}>
                        {skill.icon}
                    </ThemeIcon>
                    <Box>
                        <Text fw={600} size="md" lineClamp={1}>
                        {skill.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                        Skill ID: {skill.id}
                        </Text>
                    </Box>
                    </Group>
                </Group>
                </Stack>
            </Card>
            ))}
        </SimpleGrid>
        </Stack>
    );
}