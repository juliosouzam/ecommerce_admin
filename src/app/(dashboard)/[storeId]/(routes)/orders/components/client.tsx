'use client';

import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { type OrderColumn, columns } from './columns';

type Props = {
  data: OrderColumn[];
};

export function OrdersClient({ data }: Props) {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders of your store"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
}
