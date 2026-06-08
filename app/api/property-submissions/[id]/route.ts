import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const id = params.id;

    const updatedSubmission = await prisma.propertySubmission.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error('Error updating property submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    await prisma.propertySubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting property submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
