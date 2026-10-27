// Frontend Virtual Try-On Service

export const SUPPORTED_CLOTHING_CATEGORIES = [
  'top',
  'tops',
  'crop top',
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
  'boys clothing',
  'girls clothing',
];

export function isClothingCategorySupported(product) {
  if (!product) return false;
  const combined = `${product.category || ''} ${product.subcategory || ''} ${product.name || ''}`.toLowerCase();

  // Exclude non-apparel products explicitly
  if (
    combined.includes('electronic') ||
    combined.includes('headphone') ||
    combined.includes('speaker') ||
    combined.includes('audio') ||
    combined.includes('smartphone') ||
    combined.includes('smart home') ||
    combined.includes('smartwatch') ||
    combined.includes('wearables') ||
    combined.includes('cooktop') ||
    combined.includes('air fryer') ||
    combined.includes('kitchen') ||
    combined.includes('bedding') ||
    combined.includes('primer') ||
    combined.includes('skin care') ||
    combined.includes('hair care') ||
    combined.includes('makeup') ||
    combined.includes('face care') ||
    combined.includes('footwear') ||
    combined.includes('shoes') ||
    combined.includes('sneaker') ||
    combined.includes('heel') ||
    combined.includes('bag') ||
    combined.includes('backpack') ||
    combined.includes('watch') ||
    combined.includes('jewellery') ||
    combined.includes('necklace') ||
    combined.includes('pendant')
  ) {
    return false;
  }

  return SUPPORTED_CLOTHING_CATEGORIES.some((cat) => combined.includes(cat));
}

export function validateImage(file) {
  if (!file) {
    return { valid: false, error: 'No photo selected. Please choose a photo.' };
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Please upload a valid JPG, JPEG, PNG, or WEBP photo.',
    };
  }

  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeInBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Photo is too large (${sizeMb} MB). Please upload an image under 10MB.`,
    };
  }

  return { valid: true };
}

/**
 * Client-side image dimension verification, compression & reading to data URL
 */
export function compressAndReadImage(file, maxWidth = 1200, quality = 0.88) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read photo file. Please try again.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('The uploaded file is not a valid image.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Validate image dimensions
        if (width < 200 || height < 200) {
          return reject(
            new Error('Image dimensions are too small (minimum 200x200 pixels). Please use a clearer photo.')
          );
        }

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          dataUrl,
          width,
          height,
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export const virtualTryOnService = {
  async requestVirtualTryOn({
    userImage,
    productId,
    productImage,
    category,
    color,
    size,
    product,
  }) {
    let currentUserId = 'guest';
    try {
      const stored = localStorage.getItem('meesho_user');
      if (stored) {
        const u = JSON.parse(stored);
        currentUserId = u.id || u.email || 'customer';
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/virtual-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage,
          productId,
          productImage,
          category,
          color,
          size,
          userId: currentUserId,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        return data;
      }

      if (data.error) {
        throw new Error(data.error);
      }
      throw new Error(`Server returned HTTP ${res.status}`);
    } catch (err) {
      console.warn('API /api/virtual-tryon note:', err.message);

      // Graceful fallback for demo testing if backend is temporarily unreachable
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        status: 'completed',
        provider: 'mock-development',
        isDemo: true,
        isAiConfigured: false,
        resultImage: userImage,
        notice: 'Virtual Try-On AI provider is not configured yet.',
        message: 'Demonstration mode: A real AI provider API key (VTON_API_KEY) is required on the backend to synthesize actual AI fitting images.',
        product: product || {
          id: productId,
          name: product?.name || 'Selected Garment',
          image: productImage,
        },
        selectedVariant: { color, size },
      };
    }
  },
};
