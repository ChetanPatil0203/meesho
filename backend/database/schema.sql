-- MySQL Schema for Meesho E-commerce Full-Stack App

CREATE DATABASE IF NOT EXISTS meesho_db;
USE meesho_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'seller', 'admin') DEFAULT 'customer',
  status ENUM('active', 'pending', 'suspended', 'blocked') DEFAULT 'active',
  last_login TIMESTAMP NULL,
  address JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50)
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  mrp DECIMAL(10, 2) NOT NULL,
  discount INT DEFAULT 0,
  rating DECIMAL(3, 1) DEFAULT 4.0,
  reviews INT DEFAULT 0,
  image TEXT,
  images JSON,
  seller VARCHAR(150),
  sellerRating DECIMAL(3, 1) DEFAULT 4.0,
  description TEXT,
  colors JSON,
  sizes JSON,
  delivery VARCHAR(100),
  badge VARCHAR(50),
  inStock BOOLEAN DEFAULT TRUE,
  brand VARCHAR(100),
  specifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  customer_name VARCHAR(150),
  customer_phone VARCHAR(20),
  shipping_address JSON,
  items JSON,
  subtotal DECIMAL(10, 2),
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'COD',
  payment_status VARCHAR(50) DEFAULT 'Pending',
  status VARCHAR(50) DEFAULT 'Placed',
  tracking_step INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR(50) PRIMARY KEY,
  product_id VARCHAR(50),
  user_name VARCHAR(150),
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 6. User Permissions Table
CREATE TABLE IF NOT EXISTS user_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  permission_name VARCHAR(100) NOT NULL,
  is_allowed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_permission (user_id, permission_name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Login Activity Table
CREATE TABLE IF NOT EXISTS login_activity (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NULL,
  email VARCHAR(150) NOT NULL,
  ip_address VARCHAR(100) DEFAULT '127.0.0.1',
  user_agent VARCHAR(255) DEFAULT '',
  status ENUM('Successful', 'Failed', 'Blocked') NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Platform Settings Table
CREATE TABLE IF NOT EXISTS platform_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. Virtual Try-On Sessions Table
CREATE TABLE IF NOT EXISTS virtual_tryon_sessions (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NULL,
  product_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  color VARCHAR(50) NULL,
  size VARCHAR(50) NULL,
  provider VARCHAR(50) DEFAULT 'demo',
  result_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
