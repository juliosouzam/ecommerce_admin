import { inspect } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

export async function GET(
  _: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.billboardId)
      return new NextResponse('Billboard Id is required', { status: 400 });

    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId, storeId: params.storeId },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARD_GET]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    const body = await request.json();
    const { label, imageUrl } = body;
    if (!label) return new NextResponse('Label is required', { status: 400 });
    if (!imageUrl)
      return new NextResponse('Image URL is required', { status: 400 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.billboardId)
      return new NextResponse('Billboard Id is required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const billboard = await prismadb.billboard.update({
      where: { id: params.billboardId, storeId: storeByUserId.id },
      data: { label, imageUrl },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARD_PATCH]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.billboardId)
      return new NextResponse('Billboard Id is required', { status: 400 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const billboard = await prismadb.billboard.delete({
      where: { id: params.billboardId, storeId: storeByUserId.id },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error('[BILLBOARD_DELETE]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
