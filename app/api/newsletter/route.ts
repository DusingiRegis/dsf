import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });
    
    if (existing) {
      return NextResponse.json(
        { success: true, message: 'You are already subscribed!' },
        { status: 200 }
      );
    }
    
    await prisma.newsletterSubscriber.create({
      data: { email },
    });
    
    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Something went wrong, please try again' },
      { status: 500 }
    );
  }
}