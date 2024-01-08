import { inspect } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';

import { prismadb } from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    const body = await request.json();
    const { name } = body;
    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    const store = await prismadb.store.update({
      where: { id: params.storeId, userId },
      data: { name },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORE_PATCH]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    const store = await prismadb.store.delete({
      where: { id: params.storeId, userId },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORE_DELETE]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
