// Temporary dummy auth responses
export async function GET() {
  return new Response(JSON.stringify({ user: null }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
export async function POST() {
  return new Response(null, { status: 200 });
}
