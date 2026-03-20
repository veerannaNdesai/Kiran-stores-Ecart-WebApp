import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const isPostgres = process.env.VERCEL === '1' || process.env.POSTGRES_URL;
  const aggregateFn = isPostgres ? 'STRING_AGG' : 'GROUP_CONCAT';
  
  const orders = await db.query(`
    SELECT o.*, ${aggregateFn}(p.name || ' (x' || oi.quantity || ')', ', ') as items, 
    SUM(oi.price * oi.quantity) as total_amount
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    GROUP BY o.id, o.customer_name, o.phone, o.address, o.order_status, o.created_at, o.customer_id
    ORDER BY o.created_at DESC
  `);
  
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { customer_name, phone, address, items } = body;
  
  const session = await getSession();
  const customerId = session?.user?.id || null;

  try {
    const orderInfo = await db.query(
      'INSERT INTO orders (customer_name, phone, address, customer_id) VALUES (?, ?, ?, ?)',
      [customer_name, phone, address, customerId]
    );

    const orderId = orderInfo.lastInsertRowid;

    for (const item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
      await db.query(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.id]
      );
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Order failed' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !(session.user as any).is_admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id, status } = await request.json();
    
    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    await db.query('UPDATE orders SET order_status = ? WHERE id = ?', [status, id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
