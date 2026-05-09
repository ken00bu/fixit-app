'use client'
import { Flex, Title, Group, Text, Card, Button, Checkbox, Stack, Box } from "@mantine/core";
import { IconX, IconClock, IconCalendar } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { Report } from "@/types/report";
import { addSlaHours, fetchReportById } from "@/services/reportServices";
import { toast } from "@/lib/utils/toast";

const SLA_OPTIONS = [
  { label: "4 Hours",  hour: 4,   icon: "clock" },
  { label: "8 Hours",  hour: 8,   icon: "clock" },
  { label: "1 Day",    hour: 24,  icon: "cal"   },
  { label: "3 Days",   hour: 72,  icon: "cal"   },
  { label: "1 Week",   hour: 168, icon: "cal"   },
];


export default function UpdateSLAModal({ reportId, toggle }: { reportId: number; toggle: () => void }) {
  const [selected, setSelected] = useState<Set<number>>(new Set());


  const toggle_option = (hour: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(hour) ? next.delete(hour) : next.add(hour);
      return next;
    });
  };

  const totalHours = SLA_OPTIONS
    .filter(opt => selected.has(opt.hour))
    .reduce((sum, opt) => sum + opt.hour, 0);

  const handleUpdate = async() => {
    if (totalHours === 0 ) return;

    try {
        await addSlaHours(reportId, totalHours)
        toast.success('Berhasil memperbarui SLA', 'Data SLA telah berhasil diperbarui')
    } catch (error) {
        toast.error('Gagal memperbarui SLA', `Perubahan tidak dapat disimpan: ${error}`)  
    }
    toggle();
  };

  return (
    <Card miw="40%" maw={{ sm: "40%", base: "90%" }} p={30} radius={15}>
      {/* Header */}
      <Flex align="center" justify="space-between" pb={15}>
        <Flex align="center" gap={10}>
          <Flex w={28} h={28} align="center" justify="center"
            style={{ borderRadius: "50%", background: "#E6F1FB" }}>
            <IconClock size={16} color="#185FA5" />
          </Flex>
          <Title size="h4">Adjust SLA</Title>
        </Flex>
        <Button pl={0} pr={0} variant="subtle" color="gray" onClick={toggle}>
          <IconX color="gray" />
        </Button>
      </Flex>

      <Group h={1} bg="gray" opacity={0.4} />

      <Text size="sm" c="dimmed" mt={12} mb={16} lh={1.5}>
        Pilih satu atau lebih tombol dibawah untuk memperbarui SLA
      </Text>

      {/* Options */}
      <Flex gap={15} mb={16} wrap={'wrap'}>
        {SLA_OPTIONS.map((opt) => {
          const isSelected = selected.has(opt.hour);
          const Icon = opt.icon === "clock" ? IconClock : IconCalendar;
          return (
            <Flex
                gap={10}
                key={opt.hour}
                align="center"
                justify="space-between"
                p={12}
                style={{
                    borderRadius: 8,
                    border: isSelected ? "1.5px solid #185FA5" : "0.5px solid #D3D1C7",
                    background: isSelected ? "#E6F1FB" : "transparent",
                    cursor: "pointer",
                }}
                onClick={() => toggle_option(opt.hour)}
            >
              <Flex align="center" gap={10}>
                <Icon size={16} color={isSelected ? "#185FA5" : "#888780"} />
                <Text size="sm" fw={isSelected ? 500 : 400} c={isSelected ? "#185FA5" : "inherit"}>
                  {opt.label}
                </Text>
              </Flex>
              <Checkbox
                checked={isSelected}
                onChange={() => toggle_option(opt.hour)}
                styles={{ input: { cursor: "pointer" } }}
              />
            </Flex>
          );
        })}
      </Flex>

      {/* Total */}
      <Flex align="center" justify="space-between" p={12} mb={20}
        style={{ borderRadius: 8, background: "#f7f7f7", border: "0.5px solid #D3D1C7" }}>
        <Text size="sm" c="dimmed">Total Jam</Text>
        <Text size="sm" fw={500}>{totalHours}</Text>
      </Flex>

      {/* Footer */}
      <Flex gap={12}>
        <Button flex={1} variant="outline" color="gray" onClick={toggle}>Cancel</Button>
        <Button flex={1.5} color="blue" disabled={totalHours === 0} onClick={handleUpdate}>
          Update SLA
        </Button>
      </Flex>
    </Card>
  );
}