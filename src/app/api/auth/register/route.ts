import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, phone, password, address } = await request.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await db.query(
      'INSERT INTO users (name, phone, password) VALUES (?, ?, ?)',
      [name, phone, hashedPassword]
    );

    const users = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
    const user = users[0];
    await login(user);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    if (
      error.message?.includes('UNIQUE constraint failed') ||
      error.message?.includes('duplicate key value violates unique constraint') ||
      error.code === '23505'
    ) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 });
    }
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
  }
}
