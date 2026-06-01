import { NextResponse } from 'next/server';

// Dummy inquiries data
const dummyInquiries = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '555-123-4567', message: 'Interested in a property!', createdAt: new Date().toISOString() },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '555-987-6543', message: 'Hello, I have a question.', createdAt: new Date().toISOString() },
];

export async function POST(request: Request) {
  const body = await request.json();
  // Dummy create: just return fake data
  const newInquiry = {
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(newInquiry, { status: 201 });
}

export async function GET() {
  // Dummy get: return fake inquiries
  return NextResponse.json(dummyInquiries);
}
