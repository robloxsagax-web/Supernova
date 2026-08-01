import { NextResponse } from 'next/server';
import { Product } from '@/types/product';

export async function POST(request: Request) {
  try {
    // Parse request body
    let url: string;
    try {
      const body = await request.json();
      url = body.url;
    } catch (e) {
      console.error('Failed to parse request JSON:', e);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate and normalize URL
    let targetUrl: string;
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        targetUrl = url;
      } else if (url.startsWith('/')) {
        // It's a path, need a base URL - this is an error
        throw new Error('URL must be a full HTTP/HTTPS URL, not a path');
      } else {
        targetUrl = 'https://' + url;
      }
      // Validate it's a proper URL
      new URL(targetUrl);
    } catch (e) {
      console.error('Invalid URL:', url, e);
      return NextResponse.json(
        { error: `Invalid URL format: ${url}` },
        { status: 400 }
      );
    }

    // Get Jina API key
    const jinaApiKey = process.env.JINA_API_KEY;
    if (!jinaApiKey) {
      console.error('JINA_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'JINA_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // Use Jina AI Reader API to get clean markdown
    // r.jina.ai reads the URL and returns markdown
    const jinaUrl = `https://r.jina.ai/${targetUrl}`;
    console.log('Fetching from Jina:', jinaUrl);

    let response: Response;
    try {
      response = await fetch(jinaUrl, {
        headers: {
          'Authorization': `Bearer ${jinaApiKey}`,
          'Accept': 'text/plain',
          'X-Return-Format': 'markdown',
        },
      });
    } catch (e) {
      console.error('Fetch failed:', e);
      return NextResponse.json(
        { error: `Network error while fetching: ${e instanceof Error ? e.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log('Jina response status:', response.status);
    console.log('Jina response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error body');
      console.error('Jina API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Jina AI API error: ${response.status} - ${errorText}` },
        { status: 500 }
      );
    }

    // Get raw text/markdown response
    let markdown: string;
    try {
      markdown = await response.text();
    } catch (e) {
      console.error('Failed to read response text:', e);
      return NextResponse.json(
        { error: `Failed to read response: ${e instanceof Error ? e.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log('Markdown length:', markdown.length);
    console.log('First 500 chars of markdown:', markdown.substring(0, 500));

    // Parse the markdown to extract product info
    try {
      const product = parseProductMarkdown(markdown, targetUrl);
      console.log('Parsed product:', JSON.stringify(product, null, 2));
      return NextResponse.json(product);
    } catch (e) {
      console.error('Failed to parse markdown:', e);
      return NextResponse.json(
        { error: `Failed to parse product data: ${e instanceof Error ? e.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error in scrape route:', error);
    return NextResponse.json(
      { error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

function parseProductMarkdown(markdown: string, originalUrl: string): Product {
  console.log('Parsing markdown, length:', markdown.length);
  
  if (!markdown || markdown.trim().length === 0) {
    throw new Error('Empty markdown response from Jina AI');
  }

  const lines = markdown.split('\n');
  
  // Extract title - look for first heading
  let title = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      title = trimmed.substring(2).trim();
      break;
    }
  }
  
  // If no heading found, try to find a product name pattern
  if (!title) {
    for (const line of lines) {
      const trimmed = line.trim();
      // Look for lines that could be product titles
      if (trimmed.length > 10 && 
          trimmed.length < 200 && 
          !trimmed.includes('http') &&
          !trimmed.startsWith('![') &&
          !trimmed.startsWith('[') &&
          !trimmed.startsWith('-') &&
          !trimmed.startsWith('*')) {
        title = trimmed;
        break;
      }
    }
  }

  // Extract images from markdown format ![alt](url)
  const images: string[] = [];
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  
  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    const imgUrl = match[2].trim();
    if (isHighQualityImage(imgUrl) && !images.includes(imgUrl)) {
      images.push(imgUrl);
    }
  }

  // Also extract raw image URLs
  const rawImageRegex = /(?:src|href)=["']([^"']*\.(?:jpg|jpeg|png|webp)(?:\?[^"']*)?)["']/gi;
  while ((match = rawImageRegex.exec(markdown)) !== null) {
    const imgUrl = match[1].trim();
    if (isHighQualityImage(imgUrl) && !images.includes(imgUrl)) {
      images.push(imgUrl);
    }
  }

  console.log('Found images:', images.length, images.slice(0, 3));

  // Extract price
  let price = '';
  const priceRegex = /\$[\d,]+\.?\d*/;
  for (const line of lines) {
    const priceMatch = line.match(priceRegex);
    if (priceMatch) {
      price = priceMatch[0];
      break;
    }
  }

  // Extract description - collect meaningful paragraphs
  const descriptionLines: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    // Skip short lines, headers, images, links
    if (trimmed.length < 30) continue;
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('![')) continue;
    if (trimmed.startsWith('[') && trimmed.includes('](')) continue;
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) continue;
    
    descriptionLines.push(trimmed);
    if (descriptionLines.length >= 3) break;
  }

  const description = descriptionLines.join(' ').substring(0, 1000);

  // Extract features from bullet points
  const features: string[] = [];
  const bulletRegex = /^[-*]\s+(.+)$/gm;
  while ((match = bulletRegex.exec(markdown)) !== null) {
    const feature = match[1].trim();
    if (feature.length > 5 && feature.length < 300) {
      features.push(feature);
    }
  }

  // Ensure we have a title
  if (!title) {
    title = 'Product';
  }

  // Ensure we have at least one image
  if (images.length === 0) {
    throw new Error('Could not find product images in the scraped content');
  }

  return {
    title,
    company_name: extractCompanyName(originalUrl),
    image: images[0],
    images: images.slice(1, 6),
    price: price || 'Price not available',
    description: description || 'No description available',
    features: features.length > 0 ? features.slice(0, 5) : ['High quality product'],
    url: originalUrl,
  };
}

function extractCompanyName(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    // Remove common prefixes and TLD
    let name = hostname
      .replace(/^www\./, '')
      .replace(/\.(com|org|net|io|co)$/, '')
      .replace(/-/g, ' ');
    
    // Capitalize first letter of each word
    name = name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Special cases
    const specialCases: Record<string, string> = {
      'amazon': 'Amazon',
      'shopify': 'Shopify',
      'etsy': 'Etsy',
      'walmart': 'Walmart',
      'target': 'Target',
      'best buy': 'Best Buy',
      'macys': "Macy's",
      'nordstrom': 'Nordstrom',
    };
    
    const lowerName = name.toLowerCase();
    return specialCases[lowerName] || name;
  } catch {
    return 'Unknown Brand';
  }
}

function isHighQualityImage(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const lowercaseUrl = url.toLowerCase();
  
  // Filter out low-quality images
  const lowQualityPatterns = [
    'sprite', 'placeholder', 'icon', 'logo', 'avatar', 'thumb', 
    'small', 'mini', 'loading', 'spinner', 'pixel', 'tracking',
    '1x1', 'data:', 'base64', '/gif', '-gif'
  ];
  
  for (const pattern of lowQualityPatterns) {
    if (lowercaseUrl.includes(pattern)) {
      return false;
    }
  }
  
  // Must be a valid image extension
  const hasValidExtension = /\.(jpg|jpeg|png|webp)(\?|$)/i.test(lowercaseUrl);
  if (!hasValidExtension) {
    return false;
  }
  
  // Prefer larger images (check URL dimensions if present)
  const sizeMatch = lowercaseUrl.match(/_(\d+)x(\d+)/);
  if (sizeMatch) {
    const width = parseInt(sizeMatch[1]);
    if (width < 200) {
      return false;
    }
  }
  
  return true;
} 