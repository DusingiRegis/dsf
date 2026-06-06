import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }
}

export async function PUT() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
