import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

import { SettingsForm } from './components/settings-form';

type Props = {
  params: {
    storeId: string;
  };
};

export default async function SettingsPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return redirect('/sign-in');

  const store = await prismadb.store.findFirst({
    where: {
      userId,
      id: params.storeId,
    },
  });
  if (!store) return redirect('/');

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
}
