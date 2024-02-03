import { inspect } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

export async function GET(
  _: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.categoryId)
      return new NextResponse('Category Id is required', { status: 400 });

    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId, storeId: params.storeId },
      include: { billboard: true },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORY_GET]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    const body = await request.json();
    const { name, billboardId } = body;
    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!billboardId)
      return new NextResponse('Billboard Id is required', { status: 400 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.categoryId)
      return new NextResponse('Category Id is required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const category = await prismadb.category.update({
      where: { id: params.categoryId, storeId: storeByUserId.id },
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORY_PATCH]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { storeId: string; categoryId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.categoryId)
      return new NextResponse('Category Id is required', { status: 400 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const category = await prismadb.category.delete({
      where: { id: params.categoryId, storeId: storeByUserId.id },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORY_DELETE]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
