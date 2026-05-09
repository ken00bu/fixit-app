import { redirect } from 'next/navigation';
import { http, HttpError } from '@/lib/http';

export default async function EditReportLayout({ children }: { children: React.ReactNode }) {
    try {
        const me = await http('/users/me'); 
        if (me.role !== 'user') redirect('/forbidden');
    } catch (e) {
        if (e instanceof HttpError && e.status === 401) redirect('/login');
        throw e;
    }
    return (
        <>
            {children} 
        </>
    )
}