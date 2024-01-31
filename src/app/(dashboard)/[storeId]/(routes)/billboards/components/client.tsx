'use client';

import { ApiList } from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { type BillboardColumn, columns } from './columns';

type Props = {
  data: BillboardColumn[];
};

export function BillboardsClient({ data }: Props) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`}
          description="Manage billboards of your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API calls for Billboards" />
      <Separator />

      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
}
