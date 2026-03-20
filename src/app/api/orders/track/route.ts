'use strict';

import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    const orders = await db.query(`
      SELECT o.*, 
             (SELECT SUM(quantity * price) FROM order_items WHERE order_id = o.id) as total_amount
      FROM orders o
      WHERE o.phone = ?
      ORDER BY o.created_at DESC
    `, [phone]);

    // Get items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order: any) => {
      const items = await db.query(`
        SELECT oi.*, p.name as product_name
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      return { ...order, items };
    }));

    return NextResponse.json(ordersWithItems);
  } catch (error) {
    console.error('Track orders error:', error);
    return NextResponse.json({ error: 'Failed to track orders' }, { status: 500 });
  }
}
