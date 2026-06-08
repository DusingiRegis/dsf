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
    
    // Basic validation
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!body.type) {
      return NextResponse.json({ error: 'Property type is required' }, { status: 400 });
    }
    if (!body.price) {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }
    if (!body.location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }
    if (!body.description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }

    const newProperty = await prisma.property.create({
      data: {
        title: body.title,
        type: body.type,
        listingType: body.listingType || 'sale',
        price: Number(body.price),
        currency: body.currency || 'USD',
        location: body.location,
        neighborhood: body.neighborhood || null,
        contactPhone: body.contactPhone || null,
        size: body.size ? Number(body.size) : null,
        bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
        description: body.description,
        images: body.images || JSON.stringify([]),
        videos: body.videos || JSON.stringify([]),
        status: body.status || 'available',
        featured: Boolean(body.featured),
        acceptInquiries: body.acceptInquiries !== false,
        
        // Rental specific
        furnished: Boolean(body.furnished),
        pricePeriod: body.pricePeriod || null,
        
        // Sales specific
        titleDeed: body.titleDeed || null,
        titleDeedType: body.titleDeedType || null,
        
        // Plot specific
        plotSize: body.plotSize ? Number(body.plotSize) : null,
        zoning: body.zoning || null,
        roadAccess: body.roadAccess || null,
        
        // Car specific
        make: body.make || null,
        model: body.model || null,
        year: body.year ? Number(body.year) : null,
        mileage: body.mileage ? Number(body.mileage) : null,
        fuelType: body.fuelType || null,
        transmission: body.transmission || null,
        color: body.color || null,
        
        // Features
        features: body.features || null,
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property:', error);
    let errorMessage = 'Failed to create property';
    
    // Check for Prisma-specific errors
    if (error.code === 'P2002') {
      errorMessage = 'Unique constraint failed';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
