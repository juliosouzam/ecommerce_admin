'use client';

import { ApiList } from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PlusIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { type ColorColumn, columns } from './columns';

type Props = {
  data: ColorColumn[];
};

export function ColorClient({ data }: Props) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage colors of your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Colors" />
      <Separator />

      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
}
