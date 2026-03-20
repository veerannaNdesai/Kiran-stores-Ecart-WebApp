import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const showAll = searchParams.get('all') === 'true';

  let query = 'SELECT * FROM products';
  const params: any[] = [];
  const conditions: string[] = [];

  if (!showAll) {
    conditions.push('available = 1');
  }

  if (category && category !== 'All') {
    conditions.push('category = ?');
    params.push(category);
  }

  if (search) {
    conditions.push('name LIKE ?');
    params.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  const products = await db.query(query, params);
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, price, available, image_url, stock_quantity } = body;
    
    const info = await db.query(
      'INSERT INTO products (name, category, price, available, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [name, category, price, available ? 1 : 0, image_url, stock_quantity || 10]
    );

    return NextResponse.json({ id: info.lastInsertRowid, success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
