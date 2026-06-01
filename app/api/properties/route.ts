import { NextResponse } from 'next/server';

// Dummy properties data
const dummyProperties = [
  { id: '1', title: 'Modern Luxury Villa', type: 'house', price: 850000, location: 'Beverly Hills, CA', size: 3500, bedrooms: 4, bathrooms: 3, description: 'Stunning modern villa with breathtaking views.', images: [], status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Cozy Suburban Home', type: 'house', price: 450000, location: 'Austin, TX', size: 2200, bedrooms: 3, bathrooms: 2, description: 'Charming family home in quiet neighborhood.', images: [], status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Waterfront Plot', type: 'plot', price: 250000, location: 'Miami, FL', size: 5000, bedrooms: null, bathrooms: null, description: 'Premium waterfront lot.', images: [], status: 'sold', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', title: 'Downtown Penthouse', type: 'house', price: 1200000, location: 'New York, NY', size: 2800, bedrooms: 3, bathrooms: 3, description: 'Luxurious penthouse apartment.', images: [], status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', title: 'Mountain View Plot', type: 'plot', price: 180000, location: 'Denver, CO', size: 8000, bedrooms: null, bathrooms: null, description: 'Scenic mountain view lot.', images: [], status: 'sold', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '6', title: 'Beachfront House', type: 'house', price: 950000, location: 'San Diego, CA', size: 3200, bedrooms: 4, bathrooms: 3, description: 'Beautiful beachfront home.', images: [], status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || undefined;
  const status = searchParams.get('status') || undefined;
  const location = searchParams.get('location') || undefined;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;

  let properties = [...dummyProperties];

  // Apply filters
  if (type) {
    properties = properties.filter(p => p.type === type);
  }
  if (status) {
    properties = properties.filter(p => p.status === status);
  }
  if (location) {
    properties = properties.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedProperties = properties.slice(startIndex, startIndex + limit);

  return NextResponse.json(paginatedProperties);
}

export async function POST(request: Request) {
  const body = await request.json();
  // Dummy create: just return fake data
  const newProperty = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  dummyProperties.unshift(newProperty);
  return NextResponse.json(newProperty, { status: 201 });
}
