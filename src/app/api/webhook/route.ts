import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import Stripe from 'stripe';

import { prismadb } from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('Stripe-Signature') as string;
  let event: Stripe.Event;

  console.log(headers(), signature);

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY as string,
    );
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    return new NextResponse(`Message error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session.customer_details?.address;

  const addressesComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  const addrressString = addressesComponents.filter(Boolean).join(', ');

  if (event.type === 'checkout.session.completed') {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addrressString,
        phone: session?.customer_details?.phone || '',
      },
      include: { orderItems: true },
    });

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);
    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
