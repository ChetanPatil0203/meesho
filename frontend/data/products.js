























export const products = [
{
  id: 'p1',
  name: "Women's Rayon Kurti - Floral Print",
  category: 'Women',
  subcategory: 'Kurtis',
  price: 599,
  mrp: 1499,
  discount: 60,
  rating: 4.3,
  reviews: 2891,
  image: 'https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1583391733981-8498401ef4d8?w=600&h=750&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1594938298603-c8148c4b5c94?w=600&h=750&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&h=750&fit=crop&auto=format'],

  seller: 'Fashion Hub',
  sellerRating: 4.2,
  description: 'Beautiful floral print kurti made from soft rayon fabric. Perfect for casual and semi-formal occasions. Features 3/4 sleeves and a comfortable straight fit.',
  colors: ['Pink', 'Blue', 'Green', 'Yellow'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  delivery: 'Free Delivery by 12 Apr',
  badge: '60% OFF',
  inStock: true,
  brand: 'FashionKart',
  specifications: { Fabric: 'Rayon', Fit: 'Regular', Sleeve: '3/4 Sleeve', Pattern: 'Floral Print', Occasion: 'Casual' }
},
{
  id: 'p2',
  name: "Men's Cotton Casual Shirt",
  category: 'Men',
  subcategory: 'Shirts',
  price: 489,
  mrp: 999,
  discount: 51,
  rating: 4.1,
  reviews: 1456,
  image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=750&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&h=750&fit=crop&auto=format'],

  seller: 'MenStyle Co',
  sellerRating: 4.0,
  description: 'Comfortable 100% cotton casual shirt perfect for everyday wear. Breathable fabric keeps you cool all day.',
  colors: ['Blue', 'White', 'Black', 'Grey'],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  delivery: 'Free Delivery by 13 Apr',
  inStock: true,
  brand: 'StyleMen',
  specifications: { Fabric: 'Cotton', Fit: 'Regular', Collar: 'Spread', Pattern: 'Solid', Occasion: 'Casual' }
},
{
  id: 'p3',
  name: 'Sports Running Shoes - Men',
  category: 'Footwear',
  subcategory: 'Sports Shoes',
  price: 1299,
  mrp: 2999,
  discount: 57,
  rating: 4.4,
  reviews: 3241,
  image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=750&fit=crop&auto=format'],

  seller: 'ShoeMart',
  sellerRating: 4.5,
  description: 'Lightweight running shoes with advanced cushioning technology for all-day comfort. Anti-slip sole for superior grip.',
  colors: ['Black', 'White', 'Red', 'Blue'],
  sizes: ['6', '7', '8', '9', '10', '11'],
  delivery: 'Free Delivery by 14 Apr',
  badge: 'Best Seller',
  inStock: true,
  brand: 'SpeedRun',
  specifications: { Material: 'Mesh + Rubber', Sole: 'EVA', Closure: 'Lace-Up', Type: 'Running', Weight: '280g' }
},
{
  id: 'p4',
  name: 'boAt Rockerz 450 Wireless Headphones',
  category: 'Electronics',
  subcategory: 'Headphones',
  price: 1299,
  mrp: 3990,
  discount: 67,
  rating: 4.2,
  reviews: 15204,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=750&fit=crop&auto=format'],

  seller: 'ElectroWorld',
  sellerRating: 4.3,
  description: 'Wireless Bluetooth headphones with 15-hour battery and deep bass sound. Immersive audio with HD clarity.',
  colors: ['Black', 'Blue', 'Red'],
  sizes: ['One Size'],
  delivery: 'Free Delivery by 12 Apr',
  badge: 'Top Rated',
  inStock: true,
  brand: 'boAt',
  specifications: { Connectivity: 'Bluetooth 5.0', Battery: '15 Hours', Driver: '40mm', Frequency: '20Hz-20kHz', Weight: '218g' }
},
{
  id: 'p5',
  name: "Women's Silk Saree with Blouse",
  category: 'Women',
  subcategory: 'Sarees',
  price: 2499,
  mrp: 5999,
  discount: 58,
  rating: 4.5,
  reviews: 876,
  image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=750&fit=crop&auto=format'],

  seller: 'Silk India',
  sellerRating: 4.6,
  description: 'Elegant silk saree with intricate embroidery, perfect for festive occasions. Comes with matching blouse piece.',
  colors: ['Red', 'Green', 'Blue', 'Purple'],
  sizes: ['Free Size'],
  delivery: 'Free Delivery by 15 Apr',
  inStock: true,
  brand: 'SilkKraft',
  specifications: { Fabric: 'Silk', Length: '6.3m', Blouse: 'Included', Work: 'Embroidered', Occasion: 'Festive' }
},
{
  id: 'p6',
  name: 'Prestige Induction Cooktop 1600W',
  category: 'Home & Kitchen',
  subcategory: 'Kitchen Appliances',
  price: 1799,
  mrp: 3500,
  discount: 49,
  rating: 4.3,
  reviews: 4521,
  image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=750&fit=crop&auto=format'],

  seller: 'KitchenWorld',
  sellerRating: 4.1,
  description: 'High-performance induction cooktop with 8 preset menus and safety auto-off. Ideal for Indian cooking.',
  colors: ['Black'],
  sizes: ['1600W'],
  delivery: 'Free Delivery by 13 Apr',
  inStock: true,
  brand: 'Prestige',
  specifications: { Power: '1600W', Voltage: '230V', Timer: 'Yes', Display: 'LED', Warranty: '1 Year' }
},
{
  id: 'p7',
  name: 'Redmi Note 13 Pro 5G 256GB',
  category: 'Electronics',
  subcategory: 'Smartphones',
  price: 24999,
  mrp: 29999,
  discount: 17,
  rating: 4.4,
  reviews: 8932,
  image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=750&fit=crop&auto=format'],

  seller: 'MobileZone',
  sellerRating: 4.4,
  description: '5G smartphone with 200MP camera, 5000mAh battery, and 67W turbo charging. Snapdragon powered for blazing performance.',
  colors: ['Midnight Black', 'Arctic White', 'Ocean Blue'],
  sizes: ['128GB', '256GB'],
  delivery: 'Free Delivery by 12 Apr',
  badge: 'New Launch',
  inStock: true,
  brand: 'Redmi',
  specifications: { Processor: 'Snapdragon 7s Gen 2', RAM: '8GB', Storage: '256GB', Camera: '200MP', Battery: '5000mAh' }
},
{
  id: 'p8',
  name: "Women's Diamond Pendant Necklace",
  category: 'Accessories',
  subcategory: 'Jewellery',
  price: 899,
  mrp: 1999,
  discount: 55,
  rating: 4.2,
  reviews: 1234,
  image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=750&fit=crop&auto=format'],

  seller: 'JewelCraft',
  sellerRating: 4.3,
  description: 'Elegant diamond-studded pendant necklace with gold-plated chain. Perfect for gifting or everyday glam.',
  colors: ['Gold', 'Silver'],
  sizes: ['Free Size'],
  delivery: 'Free Delivery by 14 Apr',
  inStock: true,
  brand: 'GoldLane',
  specifications: { Material: 'Brass + Gold Plating', Stone: 'Cubic Zirconia', Length: '18 inches', Closure: 'Lobster' }
},
{
  id: 'p9',
  name: 'Premium Leather Handbag',
  category: 'Accessories',
  subcategory: 'Bags',
  price: 799,
  mrp: 2499,
  discount: 68,
  rating: 4.1,
  reviews: 2103,
  image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop&auto=format'],

  seller: 'BagBazaar',
  sellerRating: 4.0,
  description: 'Stylish faux-leather handbag with multiple compartments and long strap. Fits all your essentials.',
  colors: ['Brown', 'Black', 'Tan', 'Beige'],
  sizes: ['Medium', 'Large'],
  delivery: 'Free Delivery by 13 Apr',
  inStock: true,
  brand: 'StyleBag',
  specifications: { Material: 'Faux Leather', Compartments: '3', Strap: 'Adjustable', Closure: 'Zipper' }
},
{
  id: 'p10',
  name: "Kids' Cotton Ethnic Kurta Set",
  category: 'Kids',
  subcategory: 'Ethnic Wear',
  price: 399,
  mrp: 999,
  discount: 60,
  rating: 4.3,
  reviews: 654,
  image: 'https://images.unsplash.com/photo-1471286174890-9c112ac6e0a0?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1471286174890-9c112ac6e0a0?w=600&h=750&fit=crop&auto=format'],

  seller: 'KidsFashion',
  sellerRating: 4.2,
  description: 'Adorable cotton kurta set for kids, perfect for festivals and family gatherings.',
  colors: ['Yellow', 'Blue', 'Orange'],
  sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
  delivery: 'Free Delivery by 14 Apr',
  inStock: true,
  brand: 'KidStyle',
  specifications: { Fabric: 'Cotton', Set: 'Kurta + Pyjama', Occasion: 'Festive', Care: 'Machine Wash' }
},
{
  id: 'p11',
  name: 'Lakme Face Primer + Moisturizer',
  category: 'Beauty',
  subcategory: 'Face Care',
  price: 349,
  mrp: 699,
  discount: 50,
  rating: 4.1,
  reviews: 3421,
  image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=750&fit=crop&auto=format'],

  seller: 'BeautyStore',
  sellerRating: 4.3,
  description: 'Smooth, hydrating primer that creates a perfect base for makeup. SPF 20 for daily sun protection.',
  colors: ['Nude'],
  sizes: ['30ml'],
  delivery: 'Free Delivery by 12 Apr',
  inStock: true,
  brand: 'Lakme',
  specifications: { Volume: '30ml', Type: 'Face Primer', SPF: '20', Skin: 'All Types', Cruelty: 'Not Tested' }
},
{
  id: 'p12',
  name: 'Yoga Mat Premium Non-Slip 6mm',
  category: 'Sports',
  subcategory: 'Yoga',
  price: 499,
  mrp: 1499,
  discount: 67,
  rating: 4.5,
  reviews: 2876,
  image: 'https://images.unsplash.com/photo-1601925228008-9beb78a01b56?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1601925228008-9beb78a01b56?w=600&h=750&fit=crop&auto=format'],

  seller: 'SportZone',
  sellerRating: 4.4,
  description: 'Eco-friendly non-slip yoga mat with alignment lines and carrying strap. Perfect for home yoga practice.',
  colors: ['Purple', 'Blue', 'Green', 'Pink'],
  sizes: ['6mm', '8mm'],
  delivery: 'Free Delivery by 13 Apr',
  inStock: true,
  brand: 'FlexFit',
  specifications: { Thickness: '6mm', Material: 'TPE', Size: '183x61cm', 'Non-Slip': 'Yes', Eco: 'Friendly' }
},
{
  id: 'p13',
  name: 'Men\'s Formal Slim Fit Trousers',
  category: 'Men',
  subcategory: 'Trousers',
  price: 699,
  mrp: 1799,
  discount: 61,
  rating: 4.2,
  reviews: 987,
  image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=750&fit=crop&auto=format'],

  seller: 'MenStyle Co',
  sellerRating: 4.0,
  description: 'Premium slim-fit formal trousers made from blended fabric. Perfect for office and semi-formal occasions.',
  colors: ['Black', 'Navy', 'Grey', 'Khaki'],
  sizes: ['28', '30', '32', '34', '36', '38'],
  delivery: 'Free Delivery by 13 Apr',
  inStock: true,
  brand: 'StyleMen',
  specifications: { Fabric: 'Polyester Blend', Fit: 'Slim', Closure: 'Button + Hook', Pockets: '4', Occasion: 'Formal' }
},
{
  id: 'p14',
  name: 'JBL Flip 6 Portable Speaker',
  category: 'Electronics',
  subcategory: 'Speakers',
  price: 8999,
  mrp: 13999,
  discount: 36,
  rating: 4.6,
  reviews: 6743,
  image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=750&fit=crop&auto=format'],

  seller: 'ElectroWorld',
  sellerRating: 4.3,
  description: 'Powerful portable Bluetooth speaker with 12-hour playtime, IP67 waterproof, and bold JBL Pro Sound.',
  colors: ['Black', 'Blue', 'Red', 'Teal'],
  sizes: ['One Size'],
  delivery: 'Free Delivery by 12 Apr',
  badge: 'Top Rated',
  inStock: true,
  brand: 'JBL',
  specifications: { Output: '30W', Battery: '12 Hours', Waterproof: 'IP67', Bluetooth: '5.1', Weight: '550g' }
},
{
  id: 'p15',
  name: "Women's Anarkali Churidar Suit",
  category: 'Women',
  subcategory: 'Ethnic Wear',
  price: 899,
  mrp: 2299,
  discount: 61,
  rating: 4.4,
  reviews: 1876,
  image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=750&fit=crop&auto=format'],

  seller: 'Ethnic Elegance',
  sellerRating: 4.5,
  description: 'Gorgeous anarkali-style churidar suit with intricate embroidery. Ideal for wedding functions and festive celebrations.',
  colors: ['Maroon', 'Teal', 'Royal Blue', 'Mustard'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  delivery: 'Free Delivery by 15 Apr',
  badge: 'Trending',
  inStock: true,
  brand: 'EthnicKart',
  specifications: { Fabric: 'Georgette', Work: 'Embroidery', Set: '3 Piece', Occasion: 'Wedding/Festive', Care: 'Dry Clean' }
},
{
  id: 'p16',
  name: 'Mi Smart Band 8 Activity Tracker',
  category: 'Electronics',
  subcategory: 'Wearables',
  price: 2499,
  mrp: 3999,
  discount: 38,
  rating: 4.3,
  reviews: 11205,
  image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=750&fit=crop&auto=format'],

  seller: 'MobileZone',
  sellerRating: 4.4,
  description: 'Smart fitness band with heart rate monitor, SpO2 tracking, 14-day battery, and 150+ workout modes.',
  colors: ['Black', 'Ivory', 'Midnight Blue'],
  sizes: ['One Size'],
  delivery: 'Free Delivery by 12 Apr',
  badge: 'New',
  inStock: true,
  brand: 'Xiaomi',
  specifications: { Display: 'AMOLED 1.62"', Battery: '14 Days', Water: '5ATM', GPS: 'Connected', Sensors: 'HR + SpO2' }
},
{
  id: 'p17',
  name: 'Himalaya Herbals Skin Care Combo',
  category: 'Beauty',
  subcategory: 'Skin Care',
  price: 449,
  mrp: 899,
  discount: 50,
  rating: 4.4,
  reviews: 5621,
  image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=750&fit=crop&auto=format'],

  seller: 'BeautyStore',
  sellerRating: 4.3,
  description: 'Complete skin care combo pack: face wash, moisturizer, and sunscreen. Gentle herbal formula for all skin types.',
  colors: ['Default'],
  sizes: ['Combo Pack'],
  delivery: 'Free Delivery by 13 Apr',
  inStock: true,
  brand: 'Himalaya',
  specifications: { Contents: 'Face Wash + Moisturizer + SPF50', Volume: '3 x 100ml', Type: 'Herbal', Skin: 'All Types', Paraben: 'Free' }
},
{
  id: 'p18',
  name: "Kids' Canvas School Bag",
  category: 'Kids',
  subcategory: 'Bags & Backpacks',
  price: 599,
  mrp: 1299,
  discount: 54,
  rating: 4.2,
  reviews: 3102,
  image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=750&fit=crop&auto=format'],

  seller: 'KidsFashion',
  sellerRating: 4.2,
  description: 'Durable canvas school backpack with padded shoulder straps and multiple compartments. Fun prints kids love.',
  colors: ['Blue', 'Pink', 'Green', 'Red'],
  sizes: ['20L'],
  delivery: 'Free Delivery by 14 Apr',
  inStock: true,
  brand: 'KidStyle',
  specifications: { Capacity: '20 Litres', Material: 'Canvas', Straps: 'Padded', Compartments: '3', Age: '5-12 Years' }
},
{
  id: 'p19',
  name: "Women's Sports Leggings - 4-Way Stretch",
  category: 'Sports',
  subcategory: 'Activewear',
  price: 599,
  mrp: 1499,
  discount: 60,
  rating: 4.5,
  reviews: 4389,
  image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=750&fit=crop&auto=format'],

  seller: 'SportZone',
  sellerRating: 4.4,
  description: '4-way stretch yoga/gym leggings with high waist, moisture-wicking fabric and hidden pocket.',
  colors: ['Black', 'Navy', 'Burgundy', 'Grey'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  delivery: 'Free Delivery by 13 Apr',
  badge: 'Best Seller',
  inStock: true,
  brand: 'FlexFit',
  specifications: { Fabric: 'Nylon Spandex', Waist: 'High-Rise', Pocket: 'Hidden', Stretch: '4-Way', Care: 'Machine Wash' }
},
{
  id: 'p20',
  name: 'Philips Air Fryer HD9200 4.1L',
  category: 'Home & Kitchen',
  subcategory: 'Kitchen Appliances',
  price: 6999,
  mrp: 9999,
  discount: 30,
  rating: 4.6,
  reviews: 7823,
  image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=500&fit=crop&auto=format',
  images: [
  'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=750&fit=crop&auto=format'],

  seller: 'KitchenWorld',
  sellerRating: 4.1,
  description: 'Fry, bake, grill and roast with up to 90% less fat. Rapid Air Technology for crispy results with no oil.',
  colors: ['Black', 'White'],
  sizes: ['4.1L'],
  delivery: 'Free Delivery by 14 Apr',
  badge: 'Top Rated',
  inStock: true,
  brand: 'Philips',
  specifications: { Capacity: '4.1 Litres', Power: '1400W', Temperature: '80-200°C', Timer: '30 Min', Warranty: '2 Years' }
}];


export const categories = [
{ name: 'Women', icon: '👗', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&h=200&fit=crop&auto=format' },
{ name: 'Men', icon: '👔', image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=200&h=200&fit=crop&auto=format' },
{ name: 'Kids', icon: '🧒', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop&auto=format' },
{ name: 'Beauty', icon: '💄', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&auto=format' },
{ name: 'Electronics', icon: '📱', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop&auto=format' },
{ name: 'Home & Kitchen', icon: '🏠', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&auto=format' },
{ name: 'Footwear', icon: '👟', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop&auto=format' },
{ name: 'Accessories', icon: '👜', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&h=200&fit=crop&auto=format' },
{ name: 'Sports', icon: '🏋️', image: 'https://images.unsplash.com/photo-1601925228008-9beb78a01b56?w=200&h=200&fit=crop&auto=format' },
{ name: 'Grocery', icon: '🛒', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&auto=format' }];


export const heroSlides = [
{
  id: 1,
  title: 'Big Savings on Your Favourite Products',
  subtitle: 'Up to 70% OFF on Fashion, Electronics & More',
  cta: 'Shop Now',
  image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=500&fit=crop&auto=format',
  bg: 'from-blue-900/80 to-blue-600/60',
  category: 'Women',
  tag: '🔥 Mega Sale'
},
{
  id: 2,
  title: 'Flash Sale: Electronics Mega Deals',
  subtitle: 'Smartphones, Headphones & More — Limited Time Only',
  cta: 'Grab Deals',
  image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=500&fit=crop&auto=format',
  bg: 'from-violet-900/80 to-purple-600/60',
  category: 'Electronics',
  tag: '⚡ Flash Deals'
},
{
  id: 3,
  title: "Men's Fashion Fiesta",
  subtitle: 'Premium Shirts, Trousers & Shoes — Starting ₹299',
  cta: 'Shop Men',
  image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=500&fit=crop&auto=format',
  bg: 'from-emerald-900/80 to-emerald-600/60',
  category: 'Men',
  tag: '👔 New Collection'
},
{
  id: 4,
  title: 'Beauty & Skin Care — Up to 50% OFF',
  subtitle: 'Top Brands like Lakme, Himalaya, Mamaearth & More',
  cta: 'Shop Beauty',
  image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=500&fit=crop&auto=format',
  bg: 'from-rose-900/80 to-pink-600/60',
  category: 'Beauty',
  tag: '💄 Beauty Sale'
}];