import { Flex, Stack, Title, Text, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function Header(){
    return (
        <Flex direction={{base: 'column', sm:'row'}} justify={'space-between'} align={{base: '', sm: 'center'}}  gap={10}>
            <Stack gap={0}>
                <Title>My Laporan</Title>
                <Text c={'dimmed'}>Kelola dan pantau laporan kamu</Text>
            </Stack>
            <Link href="/laporan/baru" style={{ textDecoration: 'none' }}>
                <Button 
                    h={50} 
                    radius="0.5rem" 
                    leftSection={<IconPlus size={20}/>}
                >
                    Buat Laporan
                </Button>
            </Link>
        </Flex>
    )
}