import { NextResponse } from 'next/server';

// In-memory store for inquiries
let inquiriesStore: any[] = [
  { id: '1', name: 'John Smith', email: 'john@example.com', phone: '555-123-4567', message: 'Hi, I am interested in the Modern Luxury Villa. Can you send me more details about the property?', propertyId: '1', property: { id: '1', title: 'Modern Luxury Villa' }, createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: false },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-987-6543', message: 'I would like to schedule a viewing for the Cozy Suburban Home. What times are available this weekend?', propertyId: '2', property: { id: '2', title: 'Cozy Suburban Home' }, createdAt: new Date(Date.now() - 2*86400000).toISOString(), isRead: true },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', phone: '555-456-7890', message: 'I have a general question about your services. Can you please contact me?', propertyId: null, property: null, createdAt: new Date(Date.now() - 3*86400000).toISOString(), isRead: false },
  { id: '4', name: 'Emily Davis', email: 'emily@example.com', phone: '555-789-0123', message: 'Is the Waterfront Plot still available? I am very interested in purchasing it.', propertyId: '3', property: { id: '3', title: 'Waterfront Plot' }, createdAt: new Date(Date.now() - 4*86400000).toISOString(), isRead: true },
];

// Share store with other routes using globalThis
if (typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.inquiriesStore = globalThis.inquiriesStore || inquiriesStore;
  // @ts-ignore
  inquiriesStore = globalThis.inquiriesStore;
}

export async function GET(req: Request) {
  try {
    // Attach property data from properties store
    const inquiriesWithProperty = inquiriesStore.map(inquiry => {
      if (!inquiry.propertyId) return inquiry;
      // @ts-ignore
      const property = globalThis.propertiesStore?.find((p: any) => p.id === inquiry.propertyId);
      return {
        ...inquiry,
        property: property ? { id: property.id, title: property.title } : inquiry.property
      };
    });
    inquiriesWithProperty.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return NextResponse.json(inquiriesWithProperty);
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(inquiriesStore);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newInquiry = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    inquiriesStore.unshift(newInquiry);
    return NextResponse.json(newInquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    const body = await req.json();
    return NextResponse.json({
      ...body,
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

    const index = inquiriesStore.findIndex(i => i.id === id);
    if (index !== -1) {
      inquiriesStore[index] = { ...inquiriesStore[index], ...body };
      return NextResponse.json(inquiriesStore[index]);
    }
    return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating inquiry:', error);
    const body = await req.json();
    return NextResponse.json(body);
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const index = inquiriesStore.findIndex(i => i.id === id);
    if (index !== -1) {
      inquiriesStore.splice(index, 1);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ success: true });
  }
}
