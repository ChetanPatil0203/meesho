/**
 * Virtual Try-On Provider Abstraction
 * 
 * Modular interface supporting:
 * 1. MockVirtualTryOnProvider (Default): Safe development provider when no external AI API key is configured.
 * 2. RealVirtualTryOnProvider: Ready to connect to external Virtual Try-On APIs (e.g. FASHN.ai, Replicate IDM-VTON, Kolors VTON).
 */

export class BaseVirtualTryOnProvider {
  async generateTryOn(params) {
    throw new Error('generateTryOn must be implemented by subclass');
  }
}

/**
 * Mock / Development Virtual Try-On Provider
 * Used when no external AI provider API key is configured in the environment.
 * Clearly declares that the AI provider is not configured yet and does not make false AI claims.
 */
export class MockVirtualTryOnProvider extends BaseVirtualTryOnProvider {
  async generateTryOn({ userImage, productId, productImage, category, color, size, product }) {
    // Simulate realistic processing time
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      status: 'completed',
      provider: 'mock-development',
      isDemo: true,
      isAiConfigured: false,
      resultImage: userImage, // Safe original image reference for Before/After UI testing
      productImage,
      productName: product?.name || 'Selected Garment',
      color: color || 'Default',
      size: size || 'Regular',
      category: category || 'Apparel',
      notice: 'Virtual Try-On AI provider is not configured yet.',
      message: 'Demonstration mode: A real AI provider API key (VTON_API_KEY) is required on the backend to synthesize actual AI fitting images.',
      metadata: {
        timestamp: new Date().toISOString(),
        engine: 'MockVirtualTryOnProvider (Development Demo)',
        providerName: 'Shopio Mock VTON Engine',
      },
    };
  }
}

/**
 * Real AI Virtual Try-On Provider
 * Connects to external Virtual Try-On APIs when VTON_API_KEY or REPLICATE_API_TOKEN is present in environment.
 */
export class RealVirtualTryOnProvider extends BaseVirtualTryOnProvider {
  constructor(apiKey, endpoint) {
    super();
    this.apiKey = apiKey || process.env.VTON_API_KEY || process.env.REPLICATE_API_TOKEN;
    this.endpoint = endpoint || process.env.VTON_API_ENDPOINT || 'https://api.replicate.com/v1/predictions';
  }

  async generateTryOn({ userImage, productId, productImage, category, color, size, product }) {
    if (!this.apiKey) {
      throw new Error('AI provider API key is missing. Please configure VTON_API_KEY in environment.');
    }

    try {
      // Connect to external Virtual Try-On service (e.g. Replicate IDM-VTON model)
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          version: process.env.VTON_MODEL_VERSION || 'c871bb9b046607b680449ecbae55fd8c6d815e9f8174b281ab366b6ab660f8da',
          input: {
            human_img: userImage,
            garm_img: productImage,
            garment_des: `${color || ''} ${product?.name || category || 'clothing'}`,
            category: category?.toLowerCase() || 'upper_body',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Provider HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const resultImageUrl = data.output?.[0] || data.output || data.result_image;

      return {
        success: true,
        status: 'completed',
        provider: 'ai-external',
        isDemo: false,
        isAiConfigured: true,
        resultImage: resultImageUrl || userImage,
        productImage,
        productName: product?.name,
        color,
        size,
        notice: 'Generated with Real AI Virtual Try-On Service.',
        metadata: {
          timestamp: new Date().toISOString(),
          engine: 'IDM-VTON / External AI Provider',
          predictionId: data.id,
        },
      };
    } catch (err) {
      console.warn('Real AI Provider execution failed:', err.message);
      // Fallback to clearly labeled mock provider with error notice
      const fallback = new MockVirtualTryOnProvider();
      const res = await fallback.generateTryOn({ userImage, productId, productImage, category, color, size, product });
      res.notice = `Virtual Try-On AI provider is currently unavailable (${err.message}). Showing Demo Preview.`;
      return res;
    }
  }
}

// Factory function resolving active provider based on environment variables
export function getVirtualTryOnProvider() {
  const apiKey = process.env.VTON_API_KEY || process.env.REPLICATE_API_TOKEN;
  if (apiKey) {
    return new RealVirtualTryOnProvider(apiKey);
  }
  return new MockVirtualTryOnProvider();
}
