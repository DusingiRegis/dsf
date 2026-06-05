import { NextResponse } from 'next/server';

// Use the same in-memory store (we'll replicate it here since routes are isolated)
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
