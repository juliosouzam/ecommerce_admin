import { inspect } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

export async function GET(
  _: NextRequest,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.sizeId)
      return new NextResponse('Size Id is required', { status: 400 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });
    const size = await prismadb.size.findUnique({
      where: { id: params.sizeId, storeId: storeByUserId.id },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_GET]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    const body = await request.json();
    const { name, value } = body;
    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!value) return new NextResponse('Value is required', { status: 400 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.sizeId)
      return new NextResponse('Size Id is required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const size = await prismadb.size.update({
      where: { id: params.sizeId, storeId: storeByUserId.id },
      data: { name, value },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_PATCH]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.sizeId)
      return new NextResponse('Size Id is required', { status: 400 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const size = await prismadb.size.delete({
      where: { id: params.sizeId, storeId: storeByUserId.id },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error('[SIZE_DELETE]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
