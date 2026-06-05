import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Sending reply to:', body.toEmail);
    // In a real app, you would integrate with an email service like SendGrid, Mailgun, etc.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json({ error: 'Failed to send reply' }, { status: 500 });
  }
}
