'use client';

import { useParams, useRouter } from 'next/navigation';

import { PlusIcon } from 'lucide-react';

import { ApiList } from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { type ProductColumn, columns } from './columns';

type Props = {
  data: ProductColumn[];
};

export function ProductsClient({ data }: Props) {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products of your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Products" />
      <Separator />

      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
}
