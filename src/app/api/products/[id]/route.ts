import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { name, category, price, available, image_url, stock_quantity } = body;
    const { id } = await props.params;

    await db.query(
      'UPDATE products SET name = ?, category = ?, price = ?, available = ?, image_url = ?, stock_quantity = ? WHERE id = ?',
      [name, category, price, available ? 1 : 0, image_url, stock_quantity, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
