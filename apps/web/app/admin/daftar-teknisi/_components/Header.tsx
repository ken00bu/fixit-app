"use client"
import { Flex, Stack, Title, Text, Button, Card } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import CreateTechnicianForm from "@/components/CreateTechnicianForm";
import { useToggle } from "@mantine/hooks";

export default function Header(){
    const [isOpen, toggle] = useToggle();

    return (
        <Flex direction={{base: 'column', sm:'row'}} justify={'space-between'} align={{base: '', sm: 'center'}}  gap={10}>
            <Stack gap={0}>
                <Title>Manage Laporan</Title>
                <Text c={'dimmed'}>Pantau, terima dan tugaskan teknisi untuk memperbaiki fasilitas kampus</Text>
            </Stack>
            <Stack gap={0}>
                <Button leftSection={<IconPlus size={15} />} onClick={()=>toggle()}>Tambah Teknisi</Button>
            </Stack>
            {
                isOpen && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <CreateTechnicianForm toggle={toggle}/>
                    </div>
                )
            }
        </Flex>
    )
}