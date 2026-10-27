import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import { products, categories } from '../../frontend/data/products.js';

export const ALL_PERMISSIONS = [
  'login_access',
  'product_access',
  'add_product',
  'edit_product',
  'delete_product',
  'view_orders',
  'manage_orders',
  'manage_profile',
  'write_reviews',
  'seller_dashboard',
  'reports_access',
];

export function getDefaultPermissionsForRole(role) {
  const perms = {};
  for (const p of ALL_PERMISSIONS) {
    perms[p] = false;
  }

  // Base customer permissions
  perms['login_access'] = true;
  perms['product_access'] = true;
  perms['view_orders'] = true;
  perms['manage_profile'] = true;
  perms['write_reviews'] = true;

  if (role === 'seller') {
    perms['add_product'] = true;
    perms['edit_product'] = true;
    perms['delete_product'] = true;
    perms['manage_orders'] = true;
    perms['seller_dashboard'] = true;
  } else if (role === 'admin') {
    for (const p of ALL_PERMISSIONS) {
      perms[p] = true;
    }
  }

  return perms;
}

async function init() {
  console.log('🚀 Initializing MySQL database for Shopio App...');
  
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

    // 3. Read and execute schema.sql (stripping comments before splitting)
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const cleanSql = schemaSql
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');

    const statements = cleanSql
      .split(';')
      .map((s) => s.trim())
      .filter(
        (s) =>
          s.length > 0 &&
          !s.toLowerCase().startsWith('create database') &&
          !s.toLowerCase().startsWith('use')
      );

    for (const statement of statements) {
      await connection.query(statement);
    }
    console.log('📑 Schema tables created successfully.');

    // 3b. Alter table users if columns missing (for existing databases)
    try {
      await connection.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS status ENUM('active', 'pending', 'suspended', 'blocked') DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL;
      `);
    } catch (e) {
      // In MySQL 8.0, ADD COLUMN IF NOT EXISTS works or error ignored
    }

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
          p.seller || 'Shopio Verified Seller',
          p.sellerRating || 4.2,
          p.description || '',
          JSON.stringify(p.colors || []),
          JSON.stringify(p.sizes || []),
          p.delivery || 'Free Delivery by 3-5 days',
          p.badge || null,
          p.inStock ? 1 : 0,
          p.brand || 'Shopio Select',
          JSON.stringify(p.specifications || {}),
        ]
      );
    }

    // 6. Seed Default Users with Hashed Passwords
    console.log('👤 Seeding default users (Admin, Seller, Customer) with hashed passwords...');
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('admin123', salt);
    const sellerHash = await bcrypt.hash('seller123', salt);
    const userHash = await bcrypt.hash('user123', salt);

    const defaultUsers = [
      ['u_admin', 'Admin User', 'admin@shopio.com', '9876543210', adminHash, 'admin', 'active', JSON.stringify({ city: 'Bengaluru', state: 'Karnataka' })],
      ['u_seller', 'Fashion Hub Seller', 'seller@shopio.com', '9876543211', sellerHash, 'seller', 'active', JSON.stringify({ city: 'Surat', state: 'Gujarat' })],
      ['u_demo', 'Rahul Sharma', 'user@shopio.com', '9876543212', userHash, 'customer', 'active', JSON.stringify({ city: 'Pune', state: 'Maharashtra', pincode: '411001' })],
      ['u_chetan', 'Chetan Pazi', 'chetan.pazi@gmail.com', '9876543213', userHash, 'customer', 'active', JSON.stringify({ city: 'Mumbai', state: 'Maharashtra', pincode: '400001' })],
      ['u_sneha', 'Sneha Patil', 'sneha.patil@outlook.com', '9823187654', sellerHash, 'seller', 'active', JSON.stringify({ city: 'Pune', state: 'Maharashtra', pincode: '411038' })],
      ['u_rajesh', 'Rajesh Deshmukh', 'rajesh.d@rediffmail.com', '9765432190', userHash, 'customer', 'blocked', JSON.stringify({ city: 'Nagpur', state: 'Maharashtra', pincode: '440001' })],
      ['u_priya', 'Priya Sharma', 'priya.sharma99@gmail.com', '9123456789', userHash, 'customer', 'active', JSON.stringify({ city: 'Delhi', state: 'Delhi NCR', pincode: '110001' })],
      ['u_pooja', 'Pooja Kulkarni', 'pooja.kulkarni@yahoo.com', '9422011223', userHash, 'customer', 'pending', JSON.stringify({ city: 'Kolhapur', state: 'Maharashtra', pincode: '416001' })],
      ['u_aniket', 'Aniket Shinde', 'aniket.shinde@gmail.com', '9822455667', userHash, 'customer', 'active', JSON.stringify({ city: 'Nashik', state: 'Maharashtra', pincode: '422001' })],
      ['u_swapnil', 'Swapnil Gaikwad', 'swapnil.solapur@gmail.com', '9821144332', sellerHash, 'seller', 'active', JSON.stringify({ city: 'Solapur', state: 'Maharashtra', pincode: '413001' })],
      ['u_meera', 'Meera Iyer', 'meera.iyer@gmail.com', '9980122334', userHash, 'customer', 'active', JSON.stringify({ city: 'Bengaluru', state: 'Karnataka', pincode: '560001' })],
      ['u_sachin', 'Sachin Kamble', 'sachin.kamble@outlook.com', '9819077665', userHash, 'customer', 'active', JSON.stringify({ city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400703' })],
      ['u_tanmay', 'Tanmay Jadhav', 'tanmay.jadhav@gmail.com', '9822900112', userHash, 'customer', 'suspended', JSON.stringify({ city: 'Satara', state: 'Maharashtra', pincode: '415001' })],
    ];

    for (const u of defaultUsers) {
      await connection.query(
        `INSERT INTO users (id, name, email, phone, password, role, status, address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), password=VALUES(password), role=VALUES(role), status=VALUES(status)`,
        u
      );

      // Seed permissions for user
      const role = u[5];
      const perms = getDefaultPermissionsForRole(role);
      for (const [permName, isAllowed] of Object.entries(perms)) {
        await connection.query(
          `INSERT INTO user_permissions (user_id, permission_name, is_allowed)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE is_allowed=VALUES(is_allowed)`,
          [u[0], permName, isAllowed ? 1 : 0]
        );
      }
    }

    // 7. Seed Platform Settings
    console.log('⚙️ Seeding platform settings...');
    const defaultSettings = [
      ['platform_commission', '5.0', 'Platform commission percentage on seller orders (%)'],
      ['cod_enabled', 'true', 'Enable Cash on Delivery payment option'],
      ['free_shipping_threshold', '499', 'Order amount in INR for automatic free shipping'],
      ['maintenance_mode', 'false', 'Put customer facing website in maintenance mode'],
      ['auto_approve_sellers', 'false', 'Automatically approve newly registered sellers'],
    ];

    for (const [key, val, desc] of defaultSettings) {
      await connection.query(
        `INSERT INTO platform_settings (setting_key, setting_value, description)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value), description=VALUES(description)`,
        [key, val, desc]
      );
    }

    console.log('🎉 Database initialization and seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    console.log('\n💡 Tip: Please ensure your MySQL server is running on port ' + port);
  } finally {
    if (connection) await connection.end();
  }
}

init();
