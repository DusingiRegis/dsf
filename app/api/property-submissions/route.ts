import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const { 
      ownerName, 
      phoneNumber, 
      email, 
      propertyType, 
      listingStatus, 
      location, 
      askingPrice, 
      currency,
      bedrooms,
      bathrooms,
      description, 
      preferredContact 
    } = data;

    // Validate required fields with more descriptive messages
    if (!ownerName?.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' }, 
        { status: 400 }
      );
    }
    if (!phoneNumber?.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required' }, 
        { status: 400 }
      );
    }
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email address is required' }, 
        { status: 400 }
      );
    }
    if (!propertyType) {
      return NextResponse.json(
        { error: 'Property type is required' }, 
        { status: 400 }
      );
    }
    if (!listingStatus) {
      return NextResponse.json(
        { error: 'Listing status is required' }, 
        { status: 400 }
      );
    }
    if (!location?.trim()) {
      return NextResponse.json(
        { error: 'Location is required' }, 
        { status: 400 }
      );
    }
    if (!askingPrice || isNaN(parseFloat(askingPrice)) || parseFloat(askingPrice) <= 0) {
      return NextResponse.json(
        { error: 'Valid asking price is required' }, 
        { status: 400 }
      );
    }
    if (!currency) {
      return NextResponse.json(
        { error: 'Currency is required' }, 
        { status: 400 }
      );
    }
    if (!description?.trim()) {
      return NextResponse.json(
        { error: 'Property description is required' }, 
        { status: 400 }
      );
    }
    if (!preferredContact) {
      return NextResponse.json(
        { error: 'Preferred contact method is required' }, 
        { status: 400 }
      );
    }

    const submission = await prisma.propertySubmission.create({
      data: {
        ownerName,
        phoneNumber,
        email,
        propertyType,
        listingStatus,
        location,
        askingPrice: parseFloat(askingPrice),
        currency,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        description,
        preferredContact,
        status: 'pending',
      }
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating property submission:', error);
    let errorMessage = 'Failed to submit property';
    
    // Check for Prisma-specific errors
    if (error.code === 'P2002') {
      errorMessage = 'Unique constraint failed';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}

// Add GET endpoint for admin to view submissions
export async function GET(request: Request) {
  try {
    const submissions = await prisma.propertySubmission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching property submissions:', error);
    return NextResponse.json([], { status: 500 });
  }
}


