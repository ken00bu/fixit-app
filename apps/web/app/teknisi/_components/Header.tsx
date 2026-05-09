import { Flex, Stack, Title, Text, Button } from "@mantine/core";

export default function Header(){
    return (
        <Flex direction={{base: 'column', sm:'row'}} justify={'space-between'} align={{base: '', sm: 'center'}}  gap={10}>
            <Stack gap={0}>
                <Title></Title>
                <Text c={'dimmed'}>Pantau, terima dan tugaskan teknisi untuk memperbaiki fasilitas kampus</Text>
            </Stack>    
        </Flex>
    )
}