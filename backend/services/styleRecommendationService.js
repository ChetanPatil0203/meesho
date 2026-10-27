import { productService } from './productService.js';
import { products as fallbackProducts } from '../../frontend/data/products.js';

// Helper to determine gender target
function getProductGender(product) {
  if (!product) return 'unisex';
  const cat = (product.category || '').toLowerCase();
  if (cat === 'women') return 'women';
  if (cat === 'men') return 'men';
  if (cat === 'kids') return 'kids';

  const name = (product.name || '').toLowerCase();
  if (
    name.includes("women's") ||
    name.includes("women ") ||
    name.includes("handbag") ||
    name.includes("shoulder bag") ||
    name.includes("heels") ||
    name.includes("earring") ||
    name.includes("necklace") ||
    name.includes("palazzo") ||
    name.includes("saree") ||
    name.includes("kurti")
  ) {
    return 'women';
  }

  if (
    (name.includes("men's") && !name.includes("women's")) ||
    (name.includes("men ") && !name.includes("women ")) ||
    name.includes("oxford") ||
    name.includes("cargo jogger")
  ) {
    return 'men';
  }

  return 'unisex';
}

// Classifier for fashion slot detection
function classifyProduct(product) {
  if (!product) return 'other';
  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const subcat = (product.subcategory || '').toLowerCase();
  const words = `${subcat} ${name}`.toLowerCase().split(/[\s,/-]+/);

  // Exclude non-fashion categories
  if (['electronics', 'home & kitchen', 'grocery', 'beauty', 'sports'].includes(cat) && !subcat.includes('activewear')) {
    return 'other';
  }

  if (subcat.includes('saree') || name.includes('saree')) return 'saree';
  if (subcat.includes('kurti') || name.includes('kurti') || name.includes('anarkali') || name.includes('churidar') || name.includes('suit')) return 'kurti';
  if (subcat.includes('dress') || name.includes('dress') || name.includes('gown')) return 'dress';
  if (subcat.includes('jacket') || name.includes('jacket') || name.includes('blazer') || name.includes('coat')) return 'jacket';
  if ((subcat.includes('shirt') || name.includes('shirt')) && !name.includes('t-shirt') && !name.includes('tee') && !name.includes('tshirt')) return 'shirt';
  if (subcat.includes('t-shirt') || name.includes('t-shirt') || name.includes('graphic tee') || name.includes('tshirt') || words.includes('tee')) return 'tshirt';
  if (words.includes('top') || words.includes('tops') || name.includes('crop top') || name.includes('blouse')) return 'top';
  if (subcat.includes('jeans') || name.includes('jeans') || name.includes('denim jeans')) return 'jeans';
  if (name.includes('palazzo') || name.includes('legging') || name.includes('churidar')) return 'ethnic_bottom';
  if (subcat.includes('trouser') || subcat.includes('pant') || name.includes('trouser') || name.includes('cargo') || name.includes('jogger')) return 'trousers';
  if (subcat.includes('sneaker') || name.includes('sneaker') || subcat.includes('sports shoes') || name.includes('running shoes')) return 'sneakers';
  if (subcat.includes('formal shoes') || name.includes('oxford') || name.includes('derby') || name.includes('formal shoes')) return 'formal_shoes';
  if (subcat.includes('heel') || name.includes('heel') || name.includes('stiletto') || name.includes('pumps')) return 'heels';
  if (subcat.includes('jutti') || name.includes('jutti') || name.includes('mojari')) return 'jutti';
  if (cat.includes('footwear') || subcat.includes('footwear') || name.includes('shoes') || name.includes('sandals')) return 'footwear';
  if (subcat.includes('bag') || name.includes('bag') || name.includes('backpack') || name.includes('handbag')) return 'bag';
  if (subcat.includes('jewellery') || name.includes('necklace') || name.includes('earring') || name.includes('pendant') || name.includes('jewel')) return 'jewellery';
  if (subcat.includes('watch') || name.includes('watch')) return 'watch';
  if (cat.includes('accessories')) return 'accessory';

  return 'other';
}

function getComplementarySlots(type) {
  switch (type) {
    case 'top':
      return ['jeans', 'trousers', 'sneakers', 'heels', 'bag', 'jewellery', 'jacket'];
    case 'tshirt':
      return ['jeans', 'trousers', 'sneakers', 'bag', 'watch', 'jacket'];
    case 'shirt':
      return ['trousers', 'jeans', 'formal_shoes', 'sneakers', 'watch', 'jacket', 'bag'];
    case 'kurti':
      return ['ethnic_bottom', 'jutti', 'heels', 'jewellery', 'bag'];
    case 'dress':
      return ['heels', 'sneakers', 'bag', 'jewellery', 'jacket'];
    case 'saree':
      return ['jewellery', 'bag', 'jutti', 'heels'];
    case 'jeans':
      return ['top', 'tshirt', 'shirt', 'sneakers', 'bag', 'jacket', 'watch', 'jewellery'];
    case 'trousers':
      return ['shirt', 'tshirt', 'top', 'formal_shoes', 'sneakers', 'watch', 'jacket', 'bag'];
    case 'ethnic_bottom':
      return ['kurti', 'jutti', 'jewellery', 'bag'];
    case 'jacket':
      return ['top', 'tshirt', 'shirt', 'jeans', 'trousers', 'sneakers', 'bag'];
    case 'sneakers':
    case 'formal_shoes':
    case 'heels':
    case 'jutti':
    case 'footwear':
      return ['top', 'jeans', 'trousers', 'dress', 'bag', 'jewellery'];
    case 'bag':
    case 'jewellery':
    case 'watch':
      return ['top', 'dress', 'kurti', 'shirt', 'jeans', 'footwear'];
    default:
      return ['top', 'jeans', 'trousers', 'sneakers', 'bag', 'jewellery'];
  }
}

function generateStylingReason(targetProduct, baseProduct, targetType, occasion) {
  const occ = (occasion || 'casual').toLowerCase();

  if (targetType === 'jeans' || targetType === 'trousers' || targetType === 'ethnic_bottom') {
    if (occ === 'college') return 'Pairs perfectly for a comfortable yet stylish campus look';
    if (occ === 'office') return 'Crisp tailoring that elevates a professional office ensemble';
    if (occ === 'party') return 'Flattering silhouette that contrasts smoothly with your top';
    if (occ === 'wedding') return 'Traditional bottom wear with rich festive flare';
    return 'Complements the silhouette and proportions of your selected item';
  }

  if (targetType === 'sneakers') {
    if (occ === 'college') return 'Clean white sneakers ideal for all-day campus walking';
    if (occ === 'streetwear') return 'Trendy platform aesthetic completing the street-style vibe';
    return 'Versatile footwear matching the casual color combination';
  }

  if (targetType === 'heels') {
    if (occ === 'party') return 'Elevates the outfit with an elegant evening party height';
    if (occ === 'date') return 'Chic ankle strap detail creating a romantic silhouette';
    return 'Adds poise and sophistication to complete the look';
  }

  if (targetType === 'jutti') {
    return 'Handcrafted ethnic footwear tying together the traditional look';
  }

  if (targetType === 'bag') {
    if (occ === 'party' || occ === 'date') return 'Compact quilted design with chain detail for evening outings';
    if (occ === 'college' || occ === 'casual') return 'Spacious and chic essential for everyday accessories';
    return 'Color-coordinated accessory providing functional elegance';
  }

  if (targetType === 'jewellery') {
    if (occ === 'wedding') return 'Festive sparkle that enriches your ethnic attire';
    if (occ === 'party') return 'Subtle glimmer that catches the light during evening events';
    return 'Minimal jewellery accentuating the neckline and overall style';
  }

  if (targetType === 'jacket') {
    return 'Layering statement that adds warmth, texture and relaxed style';
  }

  if (targetType === 'watch') {
    return 'Refined timepiece adding a timeless touch to the outfit';
  }

  return 'Complements the color combination and overall aesthetic';
}

function calculateScore({ target, base, targetType, occasion, style, budget, color }) {
  if (target.inStock === false) return 0;
  if (target.id === base.id) return 0;

  const baseGender = getProductGender(base);
  const targetGender = getProductGender(target);
  if (baseGender === 'women' && targetGender === 'men') return 0;
  if (baseGender === 'men' && targetGender === 'women') return 0;
  if (baseGender !== 'kids' && targetGender === 'kids') return 0;
  if (baseGender === 'kids' && targetGender !== 'kids') return 0;

  let score = 72;

  // Occasion affinity
  const occ = (occasion || 'casual').toLowerCase();
  const targetOcc = (target.specifications?.Occasion || target.description || '').toLowerCase();
  if (targetOcc.includes(occ)) {
    score += 8;
  } else if (
    (occ === 'college' && ['sneakers', 'jeans', 'bag', 'jacket', 'tshirt'].includes(targetType)) ||
    (occ === 'office' && ['formal_shoes', 'trousers', 'watch', 'shirt'].includes(targetType)) ||
    (occ === 'party' && ['heels', 'jewellery', 'bag', 'jacket'].includes(targetType)) ||
    (occ === 'wedding' && ['jewellery', 'jutti', 'ethnic_bottom', 'saree'].includes(targetType)) ||
    (occ === 'date' && ['dress', 'heels', 'bag', 'jewellery'].includes(targetType)) ||
    (occ === 'casual' && ['sneakers', 'jeans', 'bag'].includes(targetType)) ||
    (occ === 'everyday' && ['sneakers', 'jeans', 'jewellery'].includes(targetType))
  ) {
    score += 7;
  } else {
    score += 3;
  }

  // Style affinity
  const sty = (style || 'casual').toLowerCase();
  const targetDesc = `${target.name} ${target.description} ${target.brand}`.toLowerCase();
  if (targetDesc.includes(sty)) {
    score += 6;
  } else {
    score += 3;
  }

  // Color preference
  if (color && color.toLowerCase() !== 'any') {
    const colLower = color.toLowerCase();
    const hasColor = (target.colors || []).some(c => c.toLowerCase().includes(colLower)) ||
                     (target.name || '').toLowerCase().includes(colLower);
    if (hasColor) score += 6;
  } else {
    score += 4;
  }

  // Budget preference
  if (budget && budget.toLowerCase() !== 'all') {
    const b = budget.toLowerCase();
    const price = target.price;
    if (b === 'budget' && price <= 800) score += 4;
    else if (b === 'mid-range' && price > 800 && price <= 2000) score += 4;
    else if (b === 'premium' && price > 2000) score += 4;
    else score -= 2;
  }

  // Rating boost
  if (target.rating >= 4.4) score += 2;

  return Math.min(96, Math.max(84, Math.round(score)));
}

function getOutfitRole(slot) {
  if (['jeans', 'trousers', 'ethnic_bottom'].includes(slot)) return 'bottom';
  if (['sneakers', 'heels', 'jutti', 'formal_shoes', 'footwear'].includes(slot)) return 'footwear';
  if (['bag'].includes(slot)) return 'bag';
  if (['jewellery', 'watch', 'accessory'].includes(slot)) return 'accessory';
  if (['jacket'].includes(slot)) return 'outerwear';
  if (['top', 'tshirt', 'shirt'].includes(slot)) return 'top';
  if (['dress', 'saree', 'kurti'].includes(slot)) return 'main_wear';
  return slot;
}

export const styleRecommendationService = {
  async getRecommendations({ productId, occasion = 'casual', style = 'casual', budget = 'all', color = 'any' }) {
    let allProducts = [];
    try {
      allProducts = await productService.getAllProducts({});
    } catch {
      allProducts = fallbackProducts;
    }
    if (!allProducts || allProducts.length === 0) {
      allProducts = fallbackProducts;
    }

    const selectedProduct = allProducts.find(p => p.id === productId) || fallbackProducts.find(p => p.id === productId);
    if (!selectedProduct) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const baseType = classifyProduct(selectedProduct);
    const baseRole = getOutfitRole(baseType);
    const complementarySlots = getComplementarySlots(baseType);

    // Group available in-stock products by role
    const roleCandidates = {};
    for (const p of allProducts) {
      if (!p.inStock) continue;
      if (p.id === selectedProduct.id) continue;

      const slot = classifyProduct(p);
      if (!complementarySlots.includes(slot)) continue;

      const role = getOutfitRole(slot);
      if (role === baseRole) continue;

      const score = calculateScore({
        target: p,
        base: selectedProduct,
        targetType: slot,
        occasion,
        style,
        budget,
        color,
      });

      if (score <= 0) continue;

      if (!roleCandidates[role]) roleCandidates[role] = [];
      roleCandidates[role].push({
        product: p,
        slot,
        role,
        matchScore: score,
        reason: generateStylingReason(p, selectedProduct, slot, occasion),
      });
    }

    // Pick top candidate from each complementary role
    const recommendations = [];
    const rolesPriority = ['bottom', 'top', 'footwear', 'bag', 'accessory', 'outerwear', 'main_wear'];

    for (const role of rolesPriority) {
      if (roleCandidates[role] && roleCandidates[role].length > 0) {
        roleCandidates[role].sort((a, b) => b.matchScore - a.matchScore);
        recommendations.push(roleCandidates[role][0]);
      }
    }

    for (const role in roleCandidates) {
      if (!rolesPriority.includes(role) && roleCandidates[role].length > 0) {
        roleCandidates[role].sort((a, b) => b.matchScore - a.matchScore);
        recommendations.push(roleCandidates[role][0]);
      }
    }

    // Sort by match score descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    // Default outfit: top 3 to 5 complementary items
    const selectedOutfit = recommendations.slice(0, 5);
    const totalPrice = selectedOutfit.reduce((sum, item) => sum + (item.product.price || 0), 0);

    return {
      selectedProduct,
      recommendations: selectedOutfit,
      totalPrice,
      occasion,
      style,
      budget,
      color,
    };
  },
};
