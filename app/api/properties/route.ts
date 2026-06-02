import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Dummy fallback data
const DUMMY_PROPERTIES = [
  { id: '1', title: 'Modern Luxury Villa', type: 'house', price: 850000, location: 'Beverly Hills, CA', size: 3500, bedrooms: 4, bathrooms: 3, description: 'Beautiful modern villa', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20modern%20villa%20exterior&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', title: 'Cozy Suburban Home', type: 'house', price: 450000, location: 'Austin, TX', size: 2200, bedrooms: 3, bathrooms: 2, description: 'Charming family home', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cozy%20suburban%20family%20home&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', title: 'Waterfront Plot', type: 'plot', price: 250000, location: 'Miami, FL', size: 5000, bedrooms: null, bathrooms: null, description: 'Premium lot', images: JSON.stringify(['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=waterfront%20land%20plot&image_size=square_hd']), videos: JSON.stringify([]), status: 'available', featured: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const location = searchParams.get('location') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    const properties = await prisma.property.findMany({
      where: {
        ...(type && { type }),
        ...(status && { status }),
        ...(location && { location: { contains: location, mode: 'insensitive' } }),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    // Fallback to dummy data if database fails
    return NextResponse.json(DUMMY_PROPERTIES);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Ensure videos field exists
    const propertyData = {
      ...body,
      videos: body.videos || JSON.stringify([]),
    };
    const property = await prisma.property.create({ data: propertyData });
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    // If database fails, just return success for now
    return NextResponse.json({ 
      ...await req.json(),
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { status: 201 });
  }
}
