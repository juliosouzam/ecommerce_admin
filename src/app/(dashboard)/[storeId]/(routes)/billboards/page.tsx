import { format } from 'date-fns';

import { prismadb } from '@/lib/prismadb';

import { BillboardsClient } from './components/client';
import type { BillboardColumn } from './components/columns';

export default async function Billboards({
  params,
}: { params: { storeId: string } }) {
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { createdAt: 'desc' },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt.toISOString(), 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsClient data={formattedBillboards} />
      </div>
    </div>
  );
}
