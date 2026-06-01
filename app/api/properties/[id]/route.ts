import { NextResponse } from 'next/server';

// Dummy properties data (same as in main route)
const dummyProperties = [
  { id: '1', title: 'Modern Luxury Villa', type: 'house', price: 850000, location: 'Beverly Hills, CA', size: 3500, bedrooms: 4, bathrooms: 3, description: 'Stunning modern villa with breathtaking views.', images: [], status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Cozy Suburban Home', type: 'house', price: 450000, location: 'Austin, TX', size: 2200, bedrooms: 3, bathrooms: 2, description: 'Charming family home in quiet neighborhood.', images: [], status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Waterfront Plot', type: 'plot', price: 250000, location: 'Miami, FL', size: 5000, bedrooms: null, bathrooms: null, description: 'Premium waterfront lot.', images: [], status: 'sold', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', title: 'Downtown Penthouse', type: 'house', price: 1200000, location: 'New York, NY', size: 2800, bedrooms: 3, bathrooms: 3, description: 'Luxurious penthouse apartment.', images: [], status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', title: 'Mountain View Plot', type: 'plot', price: 180000, location: 'Denver, CO', size: 8000, bedrooms: null, bathrooms: null, description: 'Scenic mountain view lot.', images: [], status: 'sold', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', title: 'Beachfront House', type: 'house', price: 950000, location: 'San Diego, CA', size: 3200, bedrooms: 4, bathrooms: 3, description: 'Beautiful beachfront home.', images: [], status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const property = dummyProperties.find(p => p.id === id);
  
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json(property);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await request.json();
  const index = dummyProperties.findIndex(p => p.id === id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  dummyProperties[index] = {
    ...dummyProperties[index],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(dummyProperties[index]);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const index = dummyProperties.findIndex(p => p.id === id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  dummyProperties.splice(index, 1);
  return NextResponse.json({ message: 'Property deleted' }, { status: 200 });
}
