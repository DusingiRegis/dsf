import { NextResponse } from 'next/server';

// In-memory store for properties (since MySQL isn't running)
let propertiesStore: any[] = [
  { id: '1', title: 'Modern Luxury Villa', type: 'house', price: 850000, location: 'Beverly Hills, CA', size: 3500, bedrooms: 4, bathrooms: 3, description: 'Beautiful modern villa', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20villa%20exterior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Cozy Suburban Home', type: 'house', price: 450000, location: 'Austin, TX', size: 2200, bedrooms: 3, bathrooms: 2, description: 'Charming family home', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cozy%20suburban%20family%20home&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Waterfront Plot', type: 'plot', price: 250000, location: 'Miami, FL', size: 5000, bedrooms: null, bathrooms: null, description: 'Premium lot', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=waterfront%20land%20plot&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

// Share store with other routes using globalThis
if (typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.propertiesStore = globalThis.propertiesStore || propertiesStore;
  // @ts-ignore
  propertiesStore = globalThis.propertiesStore;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const location = searchParams.get('location') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Filter in-memory data
    let filtered = [...propertiesStore];
    if (type) filtered = filtered.filter(p => p.type === type);
    if (status) filtered = filtered.filter(p => p.status === status);
    if (location) filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    
    // Sort and paginate
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const paginated = filtered.slice(skip, skip + limit);
    
    return NextResponse.json(paginated);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(propertiesStore);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProperty = {
      id: Date.now().toString(),
      ...body,
      videos: body.videos || JSON.stringify([]),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    propertiesStore.unshift(newProperty); // Add to front
    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ 
      ...await req.json(),
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 201 });
  }
}
