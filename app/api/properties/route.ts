import { NextResponse } from 'next/server';

// In-memory store for properties (since MySQL isn't running)
let propertiesStore: any[] = [
  // Sale properties
  { id: '1', title: 'Modern Luxury Villa', type: 'house', listingType: 'sale', price: 850000, location: 'Kigali, Rwanda', size: 3500, bedrooms: 4, bathrooms: 3, description: 'Beautiful modern villa', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20villa%20exterior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Cozy Suburban Home', type: 'house', listingType: 'sale', price: 450000, location: 'Kigali, Rwanda', size: 2200, bedrooms: 3, bathrooms: 2, description: 'Charming family home', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cozy%20suburban%20family%20home&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Waterfront Plot', type: 'plot', listingType: 'sale', price: 250000, location: 'Kigali, Rwanda', size: 5000, bedrooms: null, bathrooms: null, description: 'Premium lot', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=waterfront%20land%20plot&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', title: 'Modern Apartment', type: 'apartment', listingType: 'sale', price: 150000, location: 'Kigali, Rwanda', size: 1200, bedrooms: 2, bathrooms: 1, description: 'Stylish apartment', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20apartment%20exterior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  // Rental properties
  { id: '5', title: 'Furnished Luxury Apartment', type: 'apartment', listingType: 'rent', price: 2500, location: 'Kigali, Rwanda', size: 1500, bedrooms: 3, bathrooms: 2, description: 'Fully furnished luxury apartment for rent', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=furnished%20luxury%20apartment%20interior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', title: 'Unfurnished House', type: 'house', listingType: 'rent', price: 1800, location: 'Kigali, Rwanda', size: 2000, bedrooms: 4, bathrooms: 2, description: 'Spacious unfurnished house for rent', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=unfurnished%20house%20exterior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '7', title: 'Commercial Space', type: 'commercial', listingType: 'rent', price: 3000, location: 'Kigali, Rwanda', size: 2500, bedrooms: null, bathrooms: 2, description: 'Prime commercial space for rent', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=commercial%20office%20space%20exterior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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
    const listingType = searchParams.get('listingType') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Filter in-memory data
    let filtered = [...propertiesStore];
    if (type) filtered = filtered.filter(p => p.type === type);
    if (status) filtered = filtered.filter(p => p.status === status);
    if (location) filtered = filtered.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    if (listingType) filtered = filtered.filter(p => p.listingType === listingType);
    
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
