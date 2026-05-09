import NavBarShell from "./_components/NavBarShell";
import { redirect } from 'next/navigation';
import { http, HttpError } from '@/lib/http';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    try {
        const me = await http('/users/me');
        if (me.role !== 'technician') redirect('/forbidden');
    } catch (e) {
        if (e instanceof HttpError && e.status === 401) redirect('/login');
        throw e;
    }
    return (
          <NavBarShell>
              {children}
          </NavBarShell>
    )
}