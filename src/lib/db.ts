import { sql } from '@vercel/postgres';
import path from 'path';

const isVercel = process.env.VERCEL === '1' || process.env.POSTGRES_URL;

// Type for the database interface we want to expose
export interface DbInterface {
  query: (queryString: string, params?: any[]) => Promise<any>;
  execute: (queryString: string) => Promise<void>;
  transaction: (callback: () => Promise<any>) => Promise<any>;
}

let sqliteDb: any = null;
let initialized = false;

const getSqlite = () => {
  if (!sqliteDb) {
    const Database = require('better-sqlite3');
    sqliteDb = new Database(path.join(process.cwd(), 'kiran_stores.db'));
  }
  return sqliteDb;
};

export const db: DbInterface = {
  async query(queryString: string, params: any[] = []) {
    if (!initialized) {
      await initDb();
    }
    if (isVercel) {
      // PostgreSQL uses $1, $2 instead of ?
      let i = 0;
      let pgQuery = queryString.replace(/\?/g, () => `$${++i}`);
      
      // Auto-append RETURNING id for INSERTS if not present
      if (pgQuery.trim().toLowerCase().startsWith('insert') && !pgQuery.toLowerCase().includes('returning')) {
        pgQuery += ' RETURNING id';
      }

      const { rows } = await sql.query(pgQuery, params);
      
      const res: any = rows;
      if (queryString.trim().toLowerCase().startsWith('insert')) {
        res.lastInsertRowid = rows[0]?.id;
      }
      return res;
    } else {
      const db = getSqlite();
      const stmt = db.prepare(queryString);
      if (queryString.trim().toLowerCase().startsWith('select')) {
        return stmt.all(...params);
      } else {
        const info = stmt.run(...params);
        return { lastInsertRowid: info.lastInsertRowid, changes: info.changes };
      }
    }
  },

  async execute(queryString: string) {
    if (!initialized && !queryString.includes('CREATE TABLE')) {
      await initDb();
    }
    if (isVercel) {
      await sql.query(queryString);
    } else {
      getSqlite().exec(queryString);
    }
  },

  async transaction(callback: () => Promise<any>) {
    if (isVercel) {
      // Basic implementation for Vercel (real transactions would use a client from the pool)
      // For now, we'll just execute the callback since each line is an independent query usually
      // Ideally we'd use a client here.
      return await callback();
    } else {
      const db = getSqlite();
      let result;
      const trans = db.transaction(async () => {
        result = await callback();
      });
      trans();
      return result;
    }
  }
};

// Initialization function to be called on startup or first request
export async function initDb() {
  const schema = isVercel ? `
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      available INTEGER DEFAULT 1,
      stock_quantity INTEGER DEFAULT 10,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      order_status TEXT DEFAULT 'New Order',
      customer_id INTEGER REFERENCES users(id),
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER REFERENCES orders(id),
      product_id INTEGER REFERENCES products(id),
      quantity INTEGER,
      price DECIMAL(10,2)
    );
  ` : `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      available INTEGER DEFAULT 1,
      stock_quantity INTEGER DEFAULT 10,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      order_status TEXT DEFAULT 'New Order',
      customer_id INTEGER REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      price REAL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await db.execute(schema);

  // Seed data if empty
  const products = await db.query('SELECT COUNT(*) as count FROM products');
  const count = parseInt(isVercel ? products[0].count : products[0].count);

  if (count === 0) {
    const seedProducts = [
      ['Sona Masoori Rice 5kg', 'Grocery', 350.00, 1, 'https://placehold.co/400x400/2563eb/white?text=Sona+Masoori+Rice'],
      ['Fresh Milk 1L', 'Dairy', 25.00, 1, 'https://placehold.co/400x400/10b981/white?text=Fresh+Milk'],
      ['Tata Tea 250g', 'Grocery', 120.00, 1, 'https://placehold.co/400x400/2563eb/white?text=Tata+Tea'],
      ['Onions 1kg', 'Vegetables', 40.00, 1, 'https://placehold.co/400x400/f59e0b/white?text=Onions'],
      ['Potatoes 1kg', 'Vegetables', 30.00, 1, 'https://placehold.co/400x400/f59e0b/white?text=Potatoes'],
      ['Marie Gold Biscuits', 'Snacks', 10.00, 1, 'https://placehold.co/400x400/ef4444/white?text=Marie+Gold+Biscuits'],
      ['Surf Excel 1kg', 'Household', 180.00, 1, 'https://placehold.co/400x400/8b5cf6/white?text=Surf+Excel'],
      ['Lifebuoy Soap', 'Personal Care', 35.00, 1, 'https://placehold.co/400x400/ec4899/white?text=Lifebuoy+Soap']
    ];

    for (const p of seedProducts) {
      await db.query('INSERT INTO products (name, category, price, available, image_url) VALUES (?, ?, ?, ?, ?)', p);
    }
  }
  initialized = true;
}

export default db;
