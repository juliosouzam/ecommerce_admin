import { format } from 'date-fns';

import { prismadb } from '@/lib/prismadb';

import { fmtCurrency } from '@/lib/utils';
import { OrdersClient } from './components/client';
import type { OrderColumn } from './components/columns';

export default async function OrdersPage({
  params,
}: { params: { storeId: string } }) {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems.map((item) => item.product.name).join(', '),
    totalPrice: fmtCurrency(
      item.orderItems.reduce(
        (total, item) => total + item.product.price.toNumber(),
        0,
      ),
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt.toISOString(), 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient data={formattedOrders} />
      </div>
    </div>
  );
}
