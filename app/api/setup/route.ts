import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    console.log('Starting setup...');
    
    // Check if admin already exists
    console.log('Checking for existing admin...');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@defrealestate.com' },
    });

    if (existingAdmin) {
      console.log('Admin already exists!');
      return NextResponse.json({ message: 'Admin already exists!' });
    }

    // Create initial admin
    console.log('Creating new admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@defrealestate.com',
        password: hashedPassword,
        role: 'admin',
        isSuperAdmin: true,
      },
    });

    console.log('Admin created successfully!');
    return NextResponse.json({ 
      success: true, 
      message: 'Admin created successfully!',
      credentials: {
        email: 'admin@defrealestate.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to setup admin', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
