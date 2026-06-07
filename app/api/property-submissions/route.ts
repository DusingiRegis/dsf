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
      status, 
      location, 
      askingPrice, 
      description, 
      preferredContact 
    } = data;

    if (!ownerName || !phoneNumber || !email || !propertyType || !status || !location || !askingPrice || !description || !preferredContact) {
      return NextResponse.json(
        { error: 'All fields are required' }, 
        { status: 400 }
      );
    }

    const submission = await prisma.propertySubmission.create({
      data: {
        ownerName,
        phoneNumber,
        email,
        propertyType,
        status,
        location,
        askingPrice: parseFloat(askingPrice),
        description,
        preferredContact,
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
