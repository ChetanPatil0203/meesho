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
