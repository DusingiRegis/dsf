import { NextResponse } from 'next/server';

// Use the same in-memory store (we'll replicate it here since routes are isolated)
let propertiesStore: any[] = [
  { id: '1', title: 'Modern Luxury Villa', type: 'house', price: 850000, location: 'Beverly Hills, CA', size: 3500, bedrooms: 4, bathrooms: 3, description: 'Beautiful modern villa with stunning views', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20villa%20exterior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Cozy Suburban Home', type: 'house', price: 450000, location: 'Austin, TX', size: 2200, bedrooms: 3, bathrooms: 2, description: 'Charming family home', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cozy%20suburban%20family%20home&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Waterfront Plot', type: 'plot', price: 250000, location: 'Miami, FL', size: 5000, bedrooms: null, bathrooms: null, description: 'Premium lot', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=waterfront%20land%20plot&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Export store to share with other routes (using globalThis to share across modules)
if (typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.propertiesStore = globalThis.propertiesStore || propertiesStore;
  // @ts-ignore
  propertiesStore = globalThis.propertiesStore;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = propertiesStore.find(p => p.id === params.id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(propertiesStore[0]);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const index = propertiesStore.findIndex(p => p.id === params.id);
    if (index !== -1) {
      propertiesStore[index] = {
        ...propertiesStore[index],
        ...body,
        videos: body.videos || JSON.stringify([]),
        updatedAt: new Date().toISOString()
      };
      return NextResponse.json(propertiesStore[index]);
    }
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({
      ...await req.json(),
      id: params.id,
      updatedAt: new Date().toISOString()
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const index = propertiesStore.findIndex(p => p.id === params.id);
    if (index !== -1) {
      propertiesStore.splice(index, 1);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ success: true });
  }
}
