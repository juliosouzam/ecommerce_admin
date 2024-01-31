import { inspect } from 'node:util';
import { type NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

export async function POST(
  request: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });
    const body = await request.json();
    const { label, imageUrl } = body;
    if (!label) return new NextResponse('Label is required', { status: 400 });
    if (!imageUrl)
      return new NextResponse('Image URL is required', { status: 400 });
    if (!params.storeId)
      return new NextResponse('Store ID is required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARDS_POST]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });
    if (!params.storeId)
      return new NextResponse('Store ID is required', { status: 400 });
    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!store) return new NextResponse('Unauthorized', { status: 401 });

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: store.id,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.error('[BILLBOARDS_GET]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
