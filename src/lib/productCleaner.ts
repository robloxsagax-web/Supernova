/**
 * Product Data Cleaning Utilities
 * Removes markdown, HTML, image tags, and duplicate text from scraped product data
 */

/**
 * Clean product title - removes all markdown, HTML, and artifacts
 */
export function cleanProductTitle(title: string): string {
  if (!title) return '';
  
  let cleaned = title
    // Remove markdown image syntax
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove URLs
    .replace(/https?:\/\/[^\s<>"{}|\\^`[\]]+/gi, '')
    // Remove image source attributes
    .replace(/src\s*=\s*["'][^"']*["']/gi, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove square brackets
    .replace(/\[|\]/g, '')
    // Remove curly braces
    .replace(/\{|\}/g, '')
    // Remove parentheses
    .replace(/\(|\)/g, '')
    // Remove pipe characters (often used as separators)
    .replace(/\|/g, ' ')
    // Remove exclamation marks (often artifacts)
    .replace(/!/g, '')
    // Remove "url source:" prefix
    .replace(/^url\s*source:\s*/i, '')
    // Remove leading/trailing separators
    .replace(/^[-_\s]+|[-_\s]+$/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned || 'Premium Product';
}

/**
 * Clean product description - removes markdown and HTML
 */
export function cleanProductDescription(description: string): string {
  if (!description) return '';
  
  let cleaned = description
    // Remove markdown image syntax
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove markdown links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove URLs
    .replace(/https?:\/\/[^\s<>"{}|\\^`[\]]+/gi, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove square brackets
    .replace(/\[|\]/g, '')
    // Remove double quotes
    .replace(/[""]/g, '')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
  
  return cleaned || '';
}

/**
 * Clean product price - extracts valid price format
 */
export function cleanProductPrice(price: string | undefined): string {
  if (!price) return '';
  
  // Remove any markdown or text artifacts
  const sanitized = price
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/https?:\/\/[^\s]*/gi, '')
    .replace(/\[|\]|\(|\)|\{|\}|\*|_/g, '')
    .replace(/!/g, '');
  
  // Try to extract valid price pattern
  const priceMatch = sanitized.match(/[\$£€¥₹]?\s*[\d,]+\.?\d*/);
  
  if (priceMatch) {
    return priceMatch[0].trim();
  }
  
  return sanitized.trim();
}

/**
 * Clean features list - removes duplicates and artifacts
 */
export function cleanProductFeatures(features: string[]): string[] {
  if (!Array.isArray(features)) return [];
  
  const seen = new Set<string>();
  
  return features
    .map(feature => {
      // Clean the feature
      let cleaned = feature
        // Remove markdown
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove URLs
        .replace(/https?:\/\/[^\s<>"{}|\\^`[\]]+/gi, '')
        // Remove HTML tags
        .replace(/<[^>]*>/g, '')
        // Remove asterisks (markdown emphasis)
        .replace(/\*/g, '')
        // Remove leading/trailing whitespace
        .trim();
      
      // Normalize to lowercase for comparison
      const normalized = cleaned.toLowerCase();
      
      // Skip empty or very short features
      if (cleaned.length < 3) return null;
      
      // Skip duplicates (case-insensitive)
      if (seen.has(normalized)) return null;
      
      seen.add(normalized);
      return cleaned;
    })
    .filter((f): f is string => f !== null && f.length > 0)
    .slice(0, 10); // Limit to 10 features
}

/**
 * Clean and validate product images
 */
export function cleanProductImages(images: string[]): string[] {
  if (!Array.isArray(images)) return [];
  
  return images
    .filter(img => {
      if (!img || typeof img !== 'string') return false;
      // Skip sprite, icon, logo, and 360 images
      if (img.includes('sprite') || img.includes('icon') || 
          img.includes('logo') || img.includes('360') ||
          img.toLowerCase().includes('spin')) return false;
      // Must be a valid image extension
      return /\.(jpg|jpeg|png|webp)(\?|$)/i.test(img);
    })
    .slice(0, 20); // Limit to 20 images
}

/**
 * Full product cleaning pipeline
 */
export interface ProductCleaner {
  title: string;
  description: string;
  price: string;
  features: string[];
  images: string[];
}

export function cleanProduct(product: any): ProductCleaner {
  return {
    title: cleanProductTitle(product?.title || product?.name || ''),
    description: cleanProductDescription(product?.description || ''),
    price: cleanProductPrice(product?.price),
    features: cleanProductFeatures(product?.features || []),
    images: cleanProductImages(product?.images || product?.pictures || []),
  };
}
