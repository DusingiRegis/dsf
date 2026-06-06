import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newInquiry = await prisma.inquiry.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
        propertyId: body.propertyId,
      },
    });
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}

export async function PUT() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
