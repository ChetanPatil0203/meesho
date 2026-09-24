import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import { products, categories } from '../../frontend/data/products.js';

async function init() {
  console.log('🚀 Initializing MySQL database for Meesho App...');
  
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const dbName = process.env.DB_NAME || 'meesho_db';

  let connection;
  try {
    // 1. Connect without selecting database
    connection = await mysql.createConnection({ host, user, password, port });
    console.log(`📡 Connected to MySQL at ${host}:${port}`);

    // 2. Create Database
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`📁 Database \`${dbName}\` ensured.`);

    await connection.query(`USE \`${dbName}\`;`);

    // 3. Read and execute schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('create database') && !s.toLowerCase().startsWith('use'));

    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log('📑 Schema tables created successfully.');

    // 4. Seed Categories
    console.log('🌱 Seeding categories...');
    for (const cat of categories) {
      await connection.query(
        `INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), icon=VALUES(icon)`,
        [cat.name.toLowerCase().replace(/\s+/g, '-'), cat.name, cat.icon]
      );
    }

    // 5. Seed Products
    console.log(`🌱 Seeding ${products.length} products...`);
    for (const p of products) {
      await connection.query(
        `INSERT INTO products (
          id, name, category, subcategory, price, mrp, discount, rating, reviews,
          image, images, seller, sellerRating, description, colors, sizes,
          delivery, badge, inStock, brand, specifications
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          name=VALUES(name), price=VALUES(price), mrp=VALUES(mrp), discount=VALUES(discount),
          rating=VALUES(rating), reviews=VALUES(reviews), image=VALUES(image), images=VALUES(images)`,
        [
          p.id,
          p.name,
          p.category,
          p.subcategory || '',
          p.price,
          p.mrp,
          p.discount || 0,
          p.rating || 4.0,
          p.reviews || 0,
          p.image || '',
          JSON.stringify(p.images || []),
          p.seller || 'Meesho Verified Seller',
          p.sellerRating || 4.2,
          p.description || '',
          JSON.stringify(p.colors || []),
          JSON.stringify(p.sizes || []),
          p.delivery || 'Free Delivery by 3-5 days',
          p.badge || null,
          p.inStock ? 1 : 0,
          p.brand || 'Meesho Select',
          JSON.stringify(p.specifications || {}),
        ]
      );
    }

    // 6. Seed Default Users
    console.log('👤 Seeding default users (Admin, Seller, Customer)...');
    const defaultUsers = [
      ['u_admin', 'Admin User', 'admin@meesho.com', '9876543210', 'admin123', 'admin', JSON.stringify({ city: 'Bengaluru', state: 'Karnataka' })],
      ['u_seller', 'Fashion Hub Seller', 'seller@meesho.com', '9876543211', 'seller123', 'seller', JSON.stringify({ city: 'Surat', state: 'Gujarat' })],
      ['u_demo', 'Rahul Sharma', 'user@meesho.com', '9876543212', 'user123', 'customer', JSON.stringify({ city: 'Pune', state: 'Maharashtra', pincode: '411001' })],
    ];

    for (const u of defaultUsers) {
      await connection.query(
        `INSERT INTO users (id, name, email, phone, password, role, address)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), role=VALUES(role)`,
        u
      );
    }

    console.log('🎉 Database initialization and seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.log('\n💡 Tip: Please ensure your MySQL server (like XAMPP, WAMP, or MySQL Service) is running on port ' + port);
  } finally {
    if (connection) await connection.end();
  }
}

init();
