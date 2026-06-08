import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClientPropertySubmissions from './ClientPropertySubmissions';

export default async function PropertySubmissionsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  if (!session.user.isSuperAdmin) {
    redirect('/');
  }

  return <ClientPropertySubmissions />;
}
