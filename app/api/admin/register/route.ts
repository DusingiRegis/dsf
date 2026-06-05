import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const ORIGINAL_ADMIN_EMAIL = 'admin@defrealestate.com';

export async function POST(req: Request) {
  try {
    console.log('POST /api/admin/register called');
    const session = await getServerSession(authOptions);
    console.log('Session:', session);
    
    if (!session?.user?.id) {
      console.log('Unauthorized: No session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.email !== ORIGINAL_ADMIN_EMAIL) {
      console.log('Unauthorized: Not original admin');
      return NextResponse.json({ error: 'Only original admin can add new admins' }, { status: 403 });
    }

    const { email, password } = await req.json();
    console.log('Creating user with email:', email, 'and password:', password);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    // Create new admin user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('Created new admin user:', newUser.id, 'with hash:', newUser.password);

    return NextResponse.json(
      { success: true, user: { id: newUser.id, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin register error:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

// Get all admin users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.email !== ORIGINAL_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Only original admin can view admin users' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error('Get admin users error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin users' },
      { status: 500 }
    );
  }
}

// Delete admin user
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.email !== ORIGINAL_ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Only original admin can delete admins' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Don't allow deleting yourself
    if (id === session.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete admin user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete admin user' },
      { status: 500 }
    );
  }
}
