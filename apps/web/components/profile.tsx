'use client'
import { useState, useEffect } from "react";
import { http } from "@/lib/http";
import { Stack, Group, Image, Title, Text, Badge, Card, Divider, Button, PasswordInput, Collapse, Box } from "@mantine/core";
import { useForm, isNotEmpty, hasLength } from "@mantine/form";
import { changePassword } from "@/services/authServices";
import { IconPhone, IconLock, IconCheck, IconX } from "@tabler/icons-react";
import { toast } from "@/lib/utils/toast";

type ChangePasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ChangePasswordForm>({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validate: {
      oldPassword: isNotEmpty('Password lama wajib diisi'),
      newPassword: hasLength({ min: 8 }, 'Password baru minimal 8 karakter'),
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Konfirmasi password tidak sama' : null,
    },
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await http('/users/me');
        setUser(data);
      } catch (e) {
        console.error('Failed to fetch user data', e);
      }
    }
    fetchUser();
  }, []);

    function extractErrorMessage(error: unknown): string {
    if (!(error instanceof Error)) return 'Terjadi kesalahan';
        try {
            const parsed = JSON.parse(error.message);
            const msg = parsed?.message;
            if (Array.isArray(msg)) return msg.join(', ');
            if (typeof msg === 'string') return msg;
        } catch {
            // bukan JSON
        }
        return error.message;
    }

    const handleChangePassword = async (values: ChangePasswordForm) => {
        setSubmitting(true);
        try {
            await changePassword(values.oldPassword, values.newPassword);
            toast.success('Password berhasil diubah');
            form.reset();
            setShowForm(false);
        } catch (error) {
            const message = extractErrorMessage(error);

            if (message === 'Password lama salah') {
                form.setFieldError('oldPassword', message);
            } else if (message === 'Password too weak') {
                form.setFieldError('newPassword', message);
            } else {
                toast.error('Gagal mengubah password: ' + message);
            }
        }finally {
            setSubmitting(false);
        }
    };
    const cancelChange = () => {
        form.reset();
        setShowForm(false);
    };

    return (
        <Card radius={20}>
        <Stack p="lg" gap="lg">
            <Title order={2}>Profile</Title>

            {user && (
            <Stack>
                <Group wrap="nowrap">
                <Image h={45} w={45} radius="md" src={`/profile.png`} />
                <Stack gap={4}>
                    <Group gap="xs">
                    <Title order={4}>{user.username}</Title>
                    {user.role && (
                        <Badge
                        color={user.role === 'admin' ? 'red' : 'blue'}
                        variant="light"
                        >
                        {user.role !== 'user' ? user.role : 'Pelapor'}
                        </Badge>
                    )}
                    </Group>
                    {user.user_type && (
                    <Text c="dimmed" size="sm" tt="capitalize">
                        {user.user_type}
                    </Text>
                    )}
                </Stack>
                </Group>

                <Divider my="xs" />

                <Stack gap="sm">
                {user.email && (
                    <Group gap="md" wrap="nowrap">
                    <Group gap="xs" c="dimmed" w={140}>
                        <Text size="sm">Email</Text>
                    </Group>
                    <Text size="sm" fw={500}>{user.email}</Text>
                    </Group>
                )}

                {user.phone_number && (
                    <Group gap="md" wrap="nowrap">
                    <Group gap="xs" c="dimmed" w={140}>
                        <IconPhone size={18} />
                        <Text size="sm">No. Telepon</Text>
                    </Group>
                    <Text size="sm" fw={500}>{user.phone_number}</Text>
                    </Group>
                )}

                {user.user_type && (
                    <Group gap="md" wrap="nowrap">
                    <Group gap="xs" c="dimmed" w={140}>
                        <Text size="sm">Tipe Pengguna</Text>
                    </Group>
                    <Text size="sm" fw={500} tt="capitalize">
                        {user.user_type}
                    </Text>
                    </Group>
                )}

                {user.skill && (
                    <Group gap="md" wrap="nowrap">
                    <Group gap="xs" c="dimmed" w={140}>
                        <Text size="sm">Skill</Text>
                    </Group>
                    <Text size="sm" fw={500}>{user.skill.name}</Text>
                    </Group>
                )}
                </Stack>

                <Divider my="xs" />

                <Stack gap="sm">
                <Group justify="space-between" align="center">
                    <Group gap="xs">
                    <Text size="sm" fw={600}>Ganti Password</Text>
                    </Group>
                    {!showForm && (
                    <Button
                        size="xs"
                        variant="light"
                        onClick={() => setShowForm(true)}
                    >
                        Ganti Password
                    </Button>
                    )}
                </Group>

                <Collapse in={showForm}>
                    <Box
                    p="md"
                    style={{ borderRadius: 8, border: '1.5px solid var(--mantine-color-gray-3)' }}
                    >
                    <form onSubmit={form.onSubmit(handleChangePassword)}>
                        <Stack gap="sm">
                        <PasswordInput
                            label="Password Lama"
                            placeholder="Masukan password lama"
                            size="sm"
                            radius="md"
                            {...form.getInputProps('oldPassword')}
                        />
                        <PasswordInput
                            label="Password Baru"
                            placeholder="Minimal 8 karakter"
                            size="sm"
                            radius="md"
                            {...form.getInputProps('newPassword')}
                        />
                        <PasswordInput
                            label="Konfirmasi Password Baru"
                            placeholder="Ulangi password baru"
                            size="sm"
                            radius="md"
                            {...form.getInputProps('confirmPassword')}
                        />

                        <Group justify="end" mt="xs">
                            <Button
                            variant="default"
                            size="sm"
                            leftSection={<IconX size={14} />}
                            onClick={cancelChange}
                            disabled={submitting}
                            >
                            Batal
                            </Button>
                            <Button
                            type="submit"
                            size="sm"
                            leftSection={<IconCheck size={14} />}
                            loading={submitting}
                            >
                            Simpan
                            </Button>
                        </Group>
                        </Stack>
                    </form>
                    </Box>
                </Collapse>
                </Stack>
            </Stack>
            )}
        </Stack>
        </Card>
    );
}