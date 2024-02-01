import { format } from 'date-fns';

import { prismadb } from '@/lib/prismadb';

import { fmtCurrency } from '@/lib/utils';
import { ProductsClient } from './components/client';
import type { ProductColumn } from './components/columns';

export default async function ProductPage({
  params,
}: { params: { storeId: string } }) {
  const products = await prismadb.product.findMany({
    where: { storeId: params.storeId },
    include: { category: true, size: true, color: true },
    orderBy: { createdAt: 'desc' },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isArchived: item.isArchived,
    isFeatured: item.isFeatured,
    price: fmtCurrency(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt.toISOString(), 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
}
