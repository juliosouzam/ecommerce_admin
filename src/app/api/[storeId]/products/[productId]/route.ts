import { inspect } from 'node:util';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { prismadb } from '@/lib/prismadb';

export async function GET(
  _: NextRequest,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.productId)
      return new NextResponse('Product Id is required', { status: 400 });
    const product = await prismadb.product.findUnique({
      where: { id: params.productId, storeId: params.storeId },
      include: { images: true, category: true, size: true, color: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_GET]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    const body = await request.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
      images,
    } = body;
    if (!name) return new NextResponse('Name is required', { status: 400 });
    if (!images || !images.length)
      return new NextResponse('Images are required', { status: 400 });
    if (!price) return new NextResponse('Price is required', { status: 400 });
    if (!categoryId)
      return new NextResponse('Category Id required', { status: 400 });
    if (!colorId) return new NextResponse('Color Id required', { status: 400 });
    if (!sizeId) return new NextResponse('Size Id required', { status: 400 });

    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.productId)
      return new NextResponse('Product Id is required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    await prismadb.product.update({
      where: { id: params.productId, storeId: storeByUserId.id },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: { id: params.productId, storeId: storeByUserId.id },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_PATCH]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { storeId: string; productId: string } },
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    if (!params.storeId)
      return new NextResponse('Store Id is required', { status: 400 });
    if (!params.productId)
      return new NextResponse('Product Id is required', { status: 400 });
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 401 });

    const product = await prismadb.product.delete({
      where: { id: params.productId, storeId: storeByUserId.id },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('[PRODUCT_DELETE]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
