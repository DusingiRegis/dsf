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

    if (!ownerName || !phoneNumber || !email || !propertyType || !listingStatus || !location || !askingPrice || !currency || !description || !preferredContact) {
      return NextResponse.json(
        { error: 'All required fields are required' }, 
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
  } catch (error) {
    console.error('Error creating property submission:', error);
    return NextResponse.json(
      { error: 'Failed to submit property' }, 
      { status: 500 }
    );
  }
}
