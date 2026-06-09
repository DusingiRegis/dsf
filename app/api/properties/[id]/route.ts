import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    const propertyForEdit = {
      ...property,
      // Map status to "in_talks" if pending
      status: property.status === "pending" ? "in_talks" : property.status,
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

    return NextResponse.json(propertyForEdit);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    // Map form fields to database fields
    const data: any = {};
    
    // Basic fields
    if (body.title !== undefined) data.title = body.title;
    if (body.type !== undefined) data.type = body.type;
    if (body.listingType !== undefined) data.listingType = body.listingType;
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.currency !== undefined) data.currency = body.currency;
    if (body.location !== undefined) data.location = body.location;
    if (body.neighborhood !== undefined) data.neighborhood = body.neighborhood || null;
    if (body.contactPhone !== undefined) data.contactPhone = body.contactPhone || null;
    if (body.size !== undefined) data.size = body.size ? Number(body.size) : null;
    if (body.bedrooms !== undefined) data.bedrooms = body.bedrooms ? Number(body.bedrooms) : null;
    if (body.bathrooms !== undefined) data.bathrooms = body.bathrooms ? Number(body.bathrooms) : null;
    if (body.description !== undefined) data.description = body.description;
    if (body.images !== undefined) data.images = body.images;
    if (body.videos !== undefined) data.videos = body.videos;
    if (body.status !== undefined) {
      // Handle status values (in_talks vs pending)
      data.status = body.status === "in_talks" ? "pending" : body.status;
    }
    if (body.featured !== undefined) data.featured = Boolean(body.featured);
    if (body.acceptInquiries !== undefined) data.acceptInquiries = body.acceptInquiries !== false;
    
    // Rental specific
    if (body.furnished !== undefined) data.furnished = Boolean(body.furnished);
    if (body.pricePeriod !== undefined) data.pricePeriod = body.pricePeriod || null;
    
    // Sales specific
    if (body.titleDeed !== undefined) data.titleDeed = body.titleDeed || null;
    if (body.titleDeedType !== undefined) data.titleDeedType = body.titleDeedType || null;
    
    // Plot specific
    if (body.plotSize !== undefined) data.plotSize = body.plotSize ? Number(body.plotSize) : null;
    if (body.zoning !== undefined) data.zoning = body.zoning || null;
    if (body.roadAccess !== undefined) data.roadAccess = body.roadAccess || null;
    
    // Car specific
    if (body.make !== undefined) data.make = body.make || null;
    if (body.model !== undefined) data.model = body.model || null;
    if (body.year !== undefined) data.year = body.year ? Number(body.year) : null;
    if (body.mileage !== undefined) data.mileage = body.mileage ? Number(body.mileage) : null;
    if (body.fuelType !== undefined) data.fuelType = body.fuelType || null;
    if (body.transmission !== undefined) data.transmission = body.transmission || null;
    if (body.color !== undefined) data.color = body.color || null;
    
    // Features
    if (body.features !== undefined) data.features = body.features;
    
    const updated = await prisma.property.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.property.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Property deleted" });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
