'use client'
import { Title, Burger, Flex, Box, Center } from "@mantine/core";
import { IconTool } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar({opened, toggle}: Record<string, any>){
    const pathname = usePathname()
    return (
        <Flex align={'center'} h="100%" px="md" justify="space-between">
            <Link href={pathname === '/dashboard' ? '' : '/dashboard'} style={{textDecoration: 'none'}}>
            <Flex align={'center'} gap={7}>
                <Box bg={'#137FEC'} bdrs={'0.5rem'}>
                <Center p={7}>
                    <IconTool color="white" size={15}/>
                </Center>
                </Box>
                <Title order={1} size={"h4"} fw={700} c={'black'}>Fixit</Title>
            </Flex>
           </Link>
          <Burger lineSize={2} opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Flex>
    )
}