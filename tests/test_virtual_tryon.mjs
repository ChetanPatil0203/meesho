import { isClothingCategorySupported, validateImage } from '../frontend/services/virtualTryOnService.js';
import {
  BaseVirtualTryOnProvider,
  MockVirtualTryOnProvider,
  RealVirtualTryOnProvider,
  getVirtualTryOnProvider,
} from '../backend/services/virtualTryOnProvider.js';

async function runTests() {
  console.log('--- Starting Virtual Try-On Automated Test Suite ---');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} - ${err.message}`);
    }
  }

  // Test 1: Category Support on Frontend Service
  await test('Clothing category support detection', async () => {
    if (!isClothingCategorySupported({ category: 'Women', subcategory: 'Kurtis', name: 'Rayon Kurti' })) {
      throw new Error('Kurti should be supported');
    }
    if (!isClothingCategorySupported({ category: 'Men', subcategory: 'Shirts', name: 'Cotton Shirt' })) {
      throw new Error('Shirt should be supported');
    }
    if (!isClothingCategorySupported({ category: 'Women', subcategory: 'Sarees', name: 'Silk Saree' })) {
      throw new Error('Saree should be supported');
    }
    if (isClothingCategorySupported({ category: 'Electronics', subcategory: 'Headphones', name: 'boAt Headphone' })) {
      throw new Error('Headphone should NOT be supported');
    }
    if (isClothingCategorySupported({ category: 'Footwear', subcategory: 'Sneakers', name: 'Running shoes' })) {
      throw new Error('Footwear should NOT be supported');
    }
    if (isClothingCategorySupported({ category: 'Home & Kitchen', subcategory: 'Kitchen Appliances', name: 'Cooktop' })) {
      throw new Error('Cooktop should NOT be supported');
    }
  });

  // Test 2: Image validation helper
  await test('Image file validation helper', async () => {
    const validJpg = validateImage({ type: 'image/jpeg', size: 1024 * 1024 });
    if (!validJpg.valid) throw new Error('Valid JPG was rejected');

    const validPng = validateImage({ type: 'image/png', size: 2 * 1024 * 1024 });
    if (!validPng.valid) throw new Error('Valid PNG was rejected');

    const invalidPdf = validateImage({ type: 'application/pdf', size: 1024 });
    if (invalidPdf.valid) throw new Error('PDF was accepted');

    const tooLarge = validateImage({ type: 'image/png', size: 15 * 1024 * 1024 });
    if (tooLarge.valid) throw new Error('15MB image was accepted');
  });

  // Test 3: Backend GET /api/virtual-tryon/categories
  await test('Backend GET /api/virtual-tryon/categories', async () => {
    const res = await fetch('http://localhost:5000/api/virtual-tryon/categories');
    const data = await res.json();
    if (!data.success || !Array.isArray(data.supportedCategories) || data.supportedCategories.length === 0) {
      throw new Error('Categories endpoint failed');
    }
  });

  // Test 4: Backend POST with valid clothing item
  await test('Backend POST /api/virtual-tryon valid try-on', async () => {
    const res = await fetch('http://localhost:5000/api/virtual-tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP34...',
        productId: 'p1',
        productImage: 'https://images.unsplash.com/photo-1583391733981-8498401ef4d8',
        category: 'Kurtis',
        color: 'Pink',
        size: 'M',
      }),
    });
    const data = await res.json();
    if (!data.success || !data.resultImage || data.status !== 'completed') {
      throw new Error('Valid try-on failed: ' + JSON.stringify(data));
    }
    if (!data.isDemo && !data.provider) {
      throw new Error('Provider state missing');
    }
  });

  // Test 5: Backend POST with unsupported category (Headphones)
  await test('Backend POST /api/virtual-tryon rejection for non-clothing', async () => {
    const res = await fetch('http://localhost:5000/api/virtual-tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP34...',
        productId: 'p4',
        productImage: 'https://images.unsplash.com/photo-1505740420928',
        category: 'Headphones',
      }),
    });
    const data = await res.json();
    if (data.success !== false || data.code !== 'UNSUPPORTED_CATEGORY') {
      throw new Error('Expected UNSUPPORTED_CATEGORY, got: ' + JSON.stringify(data));
    }
  });

  // Test 6: Backend POST with invalid image (empty)
  await test('Backend POST /api/virtual-tryon rejection for empty image', async () => {
    const res = await fetch('http://localhost:5000/api/virtual-tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userImage: '',
        productId: 'p1',
        category: 'Kurtis',
      }),
    });
    const data = await res.json();
    if (data.success !== false) {
      throw new Error('Expected failure for empty image');
    }
  });

  // Test 7: Provider Abstraction classes
  await test('Provider abstraction classes and inheritance', async () => {
    const mock = new MockVirtualTryOnProvider();
    const res = await mock.generateTryOn({
      userImage: 'data:image/jpeg;base64,123',
      productId: 'p1',
      category: 'Kurtis',
    });
    if (!res.isDemo || res.notice !== 'Virtual Try-On AI provider is not configured yet.') {
      throw new Error('Mock provider notice mismatch: ' + res.notice);
    }
    const provider = getVirtualTryOnProvider();
    if (!(provider instanceof BaseVirtualTryOnProvider)) {
      throw new Error('Active provider does not inherit from BaseVirtualTryOnProvider');
    }
    const real = new RealVirtualTryOnProvider('test-api-key');
    if (!(real instanceof BaseVirtualTryOnProvider)) {
      throw new Error('RealVirtualTryOnProvider does not inherit from BaseVirtualTryOnProvider');
    }
  });

  console.log(`\n=========================================`);
  console.log(`Test Results: ${passed}/${total} tests passed!`);
  console.log(`=========================================`);
}

runTests();
