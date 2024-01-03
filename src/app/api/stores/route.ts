import { inspect } from 'util';
import { prismadb } from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });
    const body = await request.json();
    const { name } = body;
    if (!name) return new NextResponse('Name is required', { status: 400 });
    const store = await prismadb.store.create({ data: { name, userId } });

    return NextResponse.json(store);
  } catch (error) {
    console.error('[STORES_POST]: ', inspect(error, { depth: 10 }));
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
