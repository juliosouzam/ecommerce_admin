import { redirect } from 'next/navigation';

import { UserButton, auth } from '@clerk/nextjs';

import { RouteNav } from '@/components/route-nav';
import { StoreSwitcher } from '@/components/store-switcher';
import { prismadb } from '@/lib/prismadb';

export async function Navbar() {
  const { userId } = auth();
  if (!userId) return redirect('/sign-in');

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <RouteNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
