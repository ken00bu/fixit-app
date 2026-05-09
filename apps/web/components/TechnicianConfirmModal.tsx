import { Card, Title, Flex, Button, Group, Textarea, Text } from "@mantine/core"
import { IconX } from "@tabler/icons-react"
import { useState } from "react"

export default function TechnicianConfirmModal({
    toggle,
    onSubmit,
    title,
    description,
    placeholder,
    submitLabel,
    color = '',
    withTextArea = false,
}: {
    toggle: () => void
    onSubmit: (technicianNote?: string) => void
    title: string
    description: string
    placeholder?: string
    submitLabel: string
    color?: string
    withTextArea?: boolean
}) {
    const [note, setNote] = useState<string | undefined>(undefined)
    return (
        <Card miw={'40%'} maw={{ sm: "40%", base: '90%' }} p={30} radius={15}>
            <Flex direction={'column'} gap={30}>
                <Flex direction={'column'}>
                    <Flex align={'center'} justify={'space-between'}>
                        <Title size={'h4'}>
                            {title}
                        </Title>
                        <Button pl={0} pr={0} color="transparent" variant="none">
                            <IconX color="gray" onClick={() => toggle()} />
                        </Button>
                    </Flex>

                    <Group h={1} bg={'gray'} opacity={0.4} mt={15} mb={20}></Group>

                    <Text size="sm" c={'dimmed'}>
                        {description}
                    </Text>

                    {withTextArea && (
                        <Textarea
                            mt={15}
                            value={note}
                            onChange={(event) => setNote(event.currentTarget.value)}
                            autosize
                            minRows={4}
                            maxRows={10}
                            placeholder={placeholder}
                        />
                    )}
                </Flex>
                <Flex gap={10} >
                    <Button variant="outline" onClick={() => toggle()} color="gray">
                        Batal
                    </Button>
                    <Button color={color} onClick={() => onSubmit(withTextArea ? note : '')}>
                        {submitLabel}
                    </Button>
                </Flex>
            </Flex>
        </Card>
    )
}