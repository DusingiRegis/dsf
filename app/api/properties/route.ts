import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const location = searchParams.get('location') || undefined;
    const listingType = searchParams.get('listingType') || undefined;
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (listingType) where.listingType = listingType;
    if (featured) where.featured = true;

    // Fetch from Prisma
    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProperty = await prisma.property.create({
      data: {
        title: body.title,
        type: body.type,
        listingType: body.listingType || 'sale',
        price: Number(body.price),
        currency: body.currency || 'USD',
        location: body.location,
        size: Number(body.size),
        bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
        description: body.description,
        images: body.images || JSON.stringify([]),
        videos: body.videos || JSON.stringify([]),
        status: body.status || 'available',
        featured: Boolean(body.featured),
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
