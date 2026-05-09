'use client'
import { Card, Flex, Text, Title, Badge, Button, Menu, Image, Group } from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons-react";
import type { Technician } from "@/types/technician";

type TechnicianCardProps = {
  technician: Technician;
  onView?: (technicianId: number) => void;
  onDelete?: (technicianId: number) => void;
};

export default function TechnicianCard({
  technician,
  onView,
  onDelete,
}: TechnicianCardProps) {
  return (
    <Card radius={15} p={25} maw={{ base: '100%', lg: '23.5%' }} miw={{ base: '100%', lg: '23.5%' }} flex={1} withBorder>
      <Flex direction="column" gap={20}>

        <Flex justify="space-between" align="center">
          <Badge variant="light" color="blue">
            {technician.skill.name}
          </Badge>
          <Menu>
            <Menu.Target>
              <Button variant="light" radius={10} p={10} size="xs">Manage</Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => onView?.(technician.id)}
                leftSection={<IconEye color="#8A8A8A" size={14} />}
              >
                Detail Teknisi
              </Menu.Item>
              <Menu.Divider />
            </Menu.Dropdown>
          </Menu>
        </Flex>

        <Flex direction="column" align="center" gap={15}>
          <Image
            h={80}
            w={80}
            radius="100%"
            src="/profile.png"
          />
          <Flex direction="column" align="center" gap={2}>
            <Title size="h4">{technician.username}</Title>
            <Text size="sm" c="dimmed">
              {technician.phone_number ?? 'Tidak ada nomor'}
            </Text>
          </Flex>
        </Flex>



      </Flex>
    </Card>
  );
}