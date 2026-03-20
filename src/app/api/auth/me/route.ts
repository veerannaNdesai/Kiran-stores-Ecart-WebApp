import { NextResponse } from 'next/server';
import { logout, getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json({ user: session.user });
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ success: true });
}
