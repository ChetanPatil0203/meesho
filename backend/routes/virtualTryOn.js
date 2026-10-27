import express from 'express';
import { virtualTryOnService } from '../services/virtualTryOnService.js';

const router = express.Router();

/**
 * Helper to validate user photo upload on backend
 */
function validateUploadedImage(userImage) {
  if (!userImage || typeof userImage !== 'string' || userImage.trim().length === 0) {
    return {
      valid: false,
      error: 'Please upload a valid photo to start Virtual Try-On.',
      code: 'INVALID_IMAGE',
    };
  }

  // Check supported mime types for data URIs
  if (userImage.startsWith('data:')) {
    const mimeMatch = userImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!mimeMatch) {
      return {
        valid: false,
        error: 'Invalid image format. Please upload a JPG, JPEG, PNG, or WEBP photo.',
        code: 'UNSUPPORTED_FORMAT',
      };
    }

    const mime = mimeMatch[1].toLowerCase();
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(mime)) {
      return {
        valid: false,
        error: 'Unsupported image format. Allowed formats are JPG, JPEG, PNG, and WEBP.',
        code: 'UNSUPPORTED_FORMAT',
      };
    }

    // Rough size estimate from base64 string length: length * 0.75
    const base64Data = userImage.slice(mimeMatch[0].length);
    const approximateSizeInBytes = (base64Data.length * 3) / 4;
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (approximateSizeInBytes > maxSizeBytes) {
      return {
        valid: false,
        error: 'Image is too large. Please upload a photo under 10MB.',
        code: 'IMAGE_TOO_LARGE',
      };
    }
  } else if (!userImage.startsWith('http://') && !userImage.startsWith('https://')) {
    return {
      valid: false,
      error: 'Please provide a valid image data URI or URL.',
      code: 'INVALID_IMAGE',
    };
  }

  return { valid: true };
}

// POST /api/virtual-tryon
router.post('/', async (req, res) => {
  try {
    const { userImage, productId, productImage, category, color, size, userId } = req.body;

    // 1. Backend Image Validation
    const validation = validateUploadedImage(userImage);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        code: validation.code,
      });
    }

    // 2. Execute Virtual Try-On via modular service
    const result = await virtualTryOnService.generateVirtualTryOn({
      userImage,
      productId,
      productImage,
      category,
      color,
      size,
      userId: userId || req.user?.id || 'guest',
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error('Virtual try-on route error:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to create your try-on preview right now. Please try again.',
      code: 'SERVER_ERROR',
    });
  }
});

// GET /api/virtual-tryon/categories
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    supportedCategories: virtualTryOnService.getSupportedCategories(),
  });
});

// DELETE /api/virtual-tryon/session/:id
router.delete('/session/:id', async (req, res) => {
  try {
    const result = await virtualTryOnService.deleteSession(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
