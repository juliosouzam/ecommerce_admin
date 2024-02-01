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
    const { name, value } = body;
    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!value) return new NextResponse('Value is required', { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.error('[COLORS_POST]: ', inspect(error, { depth: 10 }));
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

    const colors = await prismadb.color.findMany({
      where: {
        storeId: store.id,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.error('[COLORS_GET]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
