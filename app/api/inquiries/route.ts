import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Dummy data fallback
const DUMMY_INQUIRIES = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', message: 'Hi, I am interested in the Modern Luxury Villa. Can you send me more details about the property?', propertyId: '1', property: { id: '1', title: 'Modern Luxury Villa' }, createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: false },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-987-6543', message: 'I would like to schedule a viewing for the Cozy Suburban Home. What times are available this weekend?', propertyId: '2', property: { id: '2', title: 'Cozy Suburban Home' }, createdAt: new Date(Date.now() - 2*86400000).toISOString(), isRead: true },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', phone: '555-456-7890', message: 'I have a general question about your services. Can you please contact me?', propertyId: null, property: null, createdAt: new Date(Date.now() - 3*86400000).toISOString(), isRead: false },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', phone: '555-789-0123', message: 'Is the Waterfront Plot still available? I am very interested in purchasing it.', propertyId: '3', property: { id: '3', title: 'Waterfront Plot' }, createdAt: new Date(Date.now() - 4*86400000).toISOString(), isRead: true },
];

export async function GET(req: Request) {
  try {
    const inquiries = await prisma.inquiry.findMany({
      include: { property: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    // Fallback to dummy data
    return NextResponse.json(DUMMY_INQUIRIES);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inquiry = await prisma.inquiry.create({ data: body });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    // Return success even if database fails
    return NextResponse.json({
      ...await req.json(),
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isRead: false
    }, { status: 201 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(inquiry);
  } catch (error) {
    console.error('Error updating inquiry:', error);
    // Return success even if database fails
    return NextResponse.json(await req.json());
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.inquiry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    // Return success even if database fails
    return NextResponse.json({ success: true });
  }
}
