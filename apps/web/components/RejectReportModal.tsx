import { Card, Title, Flex, Button, Group, Textarea } from "@mantine/core"
import { IconX } from "@tabler/icons-react"
import { useState } from "react"

export default function ReportNoteModal({toggle, onSubmit, onSubmitLabel}: {toggle: ()=> void, onSubmit: (adminNote: string | undefined)=>void, onSubmitLabel: string}){
    const [ note, setNote ] = useState<string | undefined>(undefined)
    return (
        <Card miw={'40%'} mih={'50%'} maw={{sm:"40%", base: '90%'}} p={30} radius={15}>
            <Flex direction={'column'} gap={30}>
                {/* Header */}
                <Flex direction={'column'} >
                    <Flex align={'center'} justify={'space-between'} >
                        <Title size={'h4'}>
                            Tinggalkan pesan untuk pelapor
                        </Title>
                        <Button pl={0} pr={0} color="transparent" variant="none"><IconX color="gray" onClick={()=>toggle()}/></Button>
                    </Flex>

                    <Group h={1} bg={'gray'} opacity={0.4} mt={15} mb={30}></Group>
                    <Textarea value={note} onChange={(event)=>setNote(event.currentTarget.value)} autosize minRows={4} maxRows={10} placeholder="Default: ”Admin belum menambahkan catatan”"></Textarea>
                </Flex>
                <Flex gap={10}>
                    <Button onClick={()=>onSubmit(note)}>
                        {onSubmitLabel}
                    </Button>
                    <Button variant="outline" onClick={()=> toggle()} color="gray">
                        Batal
                    </Button>
                </Flex>
            </Flex>
        </Card>
    )
}