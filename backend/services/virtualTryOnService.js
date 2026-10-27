import { getVirtualTryOnProvider } from './virtualTryOnProvider.js';
import { productService } from './productService.js';
import pool from '../config/db.js';

export const SUPPORTED_CLOTHING_CATEGORIES = [
  'top',
  'tops',
  't-shirt',
  't-shirts',
  'tshirt',
  'shirt',
  'shirts',
  'dress',
  'dresses',
  'kurti',
  'kurtis',
  'saree',
  'sarees',
  'jacket',
  'jackets',
  'jeans',
  'trouser',
  'trousers',
  'pant',
  'pants',
  'skirt',
  'skirts',
  'ethnic wear',
  'activewear',
];

export function isCategorySupported(categoryName, subcategoryName = '', productName = '') {
  const combined = `${categoryName || ''} ${subcategoryName || ''} ${productName || ''}`.toLowerCase();
  
  // Explicitly reject non-clothing categories
  if (
    combined.includes('electronic') ||
    combined.includes('headphone') ||
    combined.includes('speaker') ||
    combined.includes('cooktop') ||
    combined.includes('air fryer') ||
    combined.includes('primer') ||
    combined.includes('skin care') ||
    combined.includes('footwear') ||
    combined.includes('shoes') ||
    combined.includes('sneaker') ||
    combined.includes('bag') ||
    combined.includes('watch') ||
    combined.includes('jewellery') ||
    combined.includes('necklace')
  ) {
    // If it's pure accessories/footwear/electronics/beauty, return false
    return false;
  }

  return SUPPORTED_CLOTHING_CATEGORIES.some((cat) => combined.includes(cat));
}

export const virtualTryOnService = {
  getSupportedCategories() {
    return [
      'Tops',
      'T-Shirts',
      'Shirts',
      'Dresses',
      'Kurtis',
      'Sarees',
      'Jackets',
      'Jeans',
      'Trousers',
      'Skirts',
    ];
  },

  async generateVirtualTryOn({
    userImage,
    productId,
    productImage,
    category,
    color,
    size,
    userId = 'guest',
  }) {
    if (!userImage || typeof userImage !== 'string') {
      return {
        success: false,
        error: 'Please upload a valid JPG, PNG or WEBP image.',
        code: 'INVALID_IMAGE',
      };
    }

    // Retrieve real product data
    let product = null;
    if (productId) {
      try {
        product = await productService.getProductById(productId);
      } catch (err) {
        console.warn('Could not fetch product for virtual try-on:', err.message);
      }
    }

    const effectiveCategory = category || product?.subcategory || product?.category || 'Apparel';
    const effectiveImage = productImage || product?.image || '';

    // Verify category support
    if (!isCategorySupported(effectiveCategory, product?.subcategory, product?.name)) {
      return {
        success: false,
        error:
          'Virtual Try-On is currently available for selected clothing categories (Tops, Shirts, Dresses, Kurtis, Sarees, Jackets, Jeans, and Trousers).',
        code: 'UNSUPPORTED_CATEGORY',
        supportedCategories: this.getSupportedCategories(),
      };
    }

    // Resolve provider & execute try-on
    const provider = getVirtualTryOnProvider();
    const tryOnResult = await provider.generateTryOn({
      userImage,
      productId: productId || product?.id,
      productImage: effectiveImage,
      category: effectiveCategory,
      color,
      size,
      product,
    });

    const sessionId = `vton_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    // Optional DB session logging with graceful fallback
    try {
      await pool.query(
        `INSERT INTO virtual_tryon_sessions (id, user_id, product_id, status, color, size, provider, result_image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sessionId,
          userId || 'guest',
          productId || product?.id || 'unknown',
          tryOnResult.status || 'completed',
          color || 'Default',
          size || 'Regular',
          tryOnResult.provider || 'demo',
          // Note: we do not persist user personal photos, only logging session metadata
          'session_stored',
        ]
      );
    } catch (err) {
      // Non-fatal if DB table is absent or offline
      console.warn('Virtual try-on session DB logging bypassed:', err.message);
    }

    return {
      success: true,
      sessionId,
      status: tryOnResult.status,
      provider: tryOnResult.provider,
      isDemo: tryOnResult.isDemo,
      notice: tryOnResult.notice,
      resultImage: tryOnResult.resultImage,
      product: product || {
        id: productId,
        name: product?.name || 'Selected Garment',
        image: effectiveImage,
        price: product?.price || 0,
      },
      selectedVariant: {
        color: color || product?.colors?.[0] || 'Default',
        size: size || product?.sizes?.[0] || 'Regular',
      },
      metadata: tryOnResult.metadata,
    };
  },

  async deleteSession(sessionId) {
    try {
      await pool.query(`DELETE FROM virtual_tryon_sessions WHERE id = ?`, [sessionId]);
      return { success: true, message: 'Try-on session deleted successfully' };
    } catch (err) {
      return { success: true, message: 'Session removed' };
    }
  },
};
