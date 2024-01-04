import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { Navbar } from '@/components/navbar';
import { prismadb } from '@/lib/prismadb';

export default async function Dashboard({
  children,
  params,
}: { children: React.ReactNode; params: { storeId: string } }) {
  const { userId } = auth();
  if (!userId) return redirect('/sign-in');
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });
  if (!store) return redirect('/');

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
