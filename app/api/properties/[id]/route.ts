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
      // Map listingType to "listing" for form
      listing: property.listingType === "rent" ? "For Rent" : "For Sale",
      // Map status to "in_talks" if pending
      status: property.status === "pending" ? "in_talks" : property.status,
      images: (() => {
        try {
          return JSON.parse(property.images || "[]");
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
    const data: any = {
      ...body,
    };
    
    // Handle listing -> listingType
    if (body.listing) {
      data.listingType = body.listing === "For Rent" ? "rent" : "sale";
      delete data.listing;
    }
    
    // Handle status values (in_talks vs pending)
    if (body.status === "in_talks") {
      data.status = "pending";
    }
    
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
