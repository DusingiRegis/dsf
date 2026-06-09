import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const typeParam = searchParams.get('type');
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const listingType = searchParams.get('listingType');
    const featured = searchParams.get('featured') === 'true';
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : null;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : null;
    const bedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : null;
    const bathrooms = searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : null;
    const features = searchParams.get('features') ? searchParams.get('features')?.split(',') || [] : [];
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Handle type filter (including furnished/unfurnished)
    if (typeParam) {
      if (typeParam === 'furnished') {
        where.listingType = 'rent';
        where.furnished = true;
      } else if (typeParam === 'unfurnished') {
        where.listingType = 'rent';
        where.furnished = false;
      } else {
        where.type = typeParam;
      }
    }

    // Handle status filter
    if (status) {
      where.status = status;
    }

    // Handle listingType filter
    if (listingType) {
      where.listingType = listingType;
    }

    // Handle featured filter
    if (featured) {
      where.featured = true;
    }

    // Handle location filter
    if (location) {
      where.location = { contains: location, mode: 'insensitive' };
    }

    // Handle price filters
    if (minPrice !== null || maxPrice !== null) {
      where.price = {};
      if (minPrice !== null) where.price.gte = minPrice;
      if (maxPrice !== null) where.price.lte = maxPrice;
    }

    // Handle bedrooms filter
    if (bedrooms !== null) {
      where.bedrooms = { gte: bedrooms };
    }

    // Handle bathrooms filter
    if (bathrooms !== null) {
      where.bathrooms = { gte: bathrooms };
    }

    // Handle sort
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' };
    }

    // Fetch from Prisma
    const [properties, totalCount] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    // Parse images, videos, and features for each property
    const processedProperties = properties.map((property) => {
      return {
        ...property,
        images: (() => {
          try {
            return JSON.parse(property.images || "[]");
          } catch {
            return [];
          }
        })(),
        videos: (() => {
          try {
            return JSON.parse(property.videos || "[]");
          } catch {
            return [];
          }
        })(),
        features: (() => {
          try {
            return JSON.parse(property.features || "[]");
          } catch {
            return [];
          }
        })(),
      };
    });

    return NextResponse.json({
      properties: processedProperties,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { properties: [], totalCount: 0, page: 1, totalPages: 0 },
      { status: 500 }
    );
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
