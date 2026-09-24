import pool from '../config/db.js';

export const productModel = {
  // Query products with dynamic filtering, sorting, and pagination
  async findAll({ category, search, minPrice, maxPrice, sort, page = 1, limit = 50 }) {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ? OR brand LIKE ? OR category LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    if (sort === 'price-low') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price-high') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating DESC';
    } else if (sort === 'discount') {
      query += ' ORDER BY discount DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(Number(limit), (Number(page) - 1) * Number(limit));

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Find single product by ID
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0] || null;
  },

  // Insert a new product
  async create(p) {
    const id = p.id || `p_${Date.now()}`;
    await pool.query(
      `INSERT INTO products (
        id, name, category, subcategory, price, mrp, discount, rating, reviews,
        image, images, seller, sellerRating, description, colors, sizes,
        delivery, badge, inStock, brand, specifications
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        p.name,
        p.category || 'General',
        p.subcategory || '',
        p.price || 0,
        p.mrp || p.price || 0,
        p.discount || 0,
        p.rating || 4.0,
        p.reviews || 0,
        p.image || '',
        JSON.stringify(p.images || [p.image]),
        p.seller || 'Verified Seller',
        p.sellerRating || 4.2,
        p.description || '',
        JSON.stringify(p.colors || []),
        JSON.stringify(p.sizes || []),
        p.delivery || 'Free Delivery by 3-5 days',
        p.badge || null,
        p.inStock !== false ? 1 : 0,
        p.brand || 'Meesho',
        JSON.stringify(p.specifications || {}),
      ]
    );
    return id;
  },

  // Update product by ID
  async update(id, p) {
    const [result] = await pool.query(
      `UPDATE products SET 
        name=?, category=?, subcategory=?, price=?, mrp=?, discount=?,
        description=?, inStock=?
       WHERE id=?`,
      [p.name, p.category, p.subcategory, p.price, p.mrp, p.discount, p.description, p.inStock ? 1 : 0, id]
    );
    return result.affectedRows > 0;
  },

  // Delete product by ID
  async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};
