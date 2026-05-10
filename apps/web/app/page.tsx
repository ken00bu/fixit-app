import { http, HttpError } from '@/lib/http';
import { Center } from '@mantine/core';
import { redirect } from 'next/navigation';

export default async function Home() {
    try {
        const me = await http('/users/me'); 
        if (me.role === 'admin') redirect('/admin');
        if (me.role === 'user') redirect('/dashboard');
        if (me.role === 'technician') redirect('/teknisi');
    } catch (e) {
        redirect('/login');
    }
  return (
    <Center>
      Under Construction
    </Center>
  );
}
