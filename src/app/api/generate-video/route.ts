import { NextResponse } from 'next/server';

const PEXELS_VIDEO_URL = 'https://api.pexels.com/videos/search';
const PEXELS_PHOTO_URL = 'https://api.pexels.com/v1/search';

// API key must be set via environment variable - never hardcode
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

interface BRollClip {
  id: number;
  url: string;
  thumbnail: string;
  duration: number;
}

interface BRollImage {
  id: number;
  url: string;
  thumbnail: string;
}

export async function POST(request: Request) {
  try {
    const { script, generationType = 'ad', product, duration = 30, videoSettings } = await request.json();

    if (!script) {
      return NextResponse.json({ error: 'Script is required' }, { status: 400 });
    }

    // Validate Pexels API key is configured
    if (!PEXELS_API_KEY) {
      console.error('[VIDEO] PEXELS_API_KEY environment variable not set');
      return NextResponse.json(
        { error: 'Video service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Use videoSettings ratio if available, fallback to product settings
    const ratio = videoSettings?.ratio || product?.preferredRatio || product?.settings?.ratio || '16:9';
    const isVertical = ratio === '9:16';
    const width = isVertical ? 1080 : 1920;
    const height = isVertical ? 1920 : 1080;
    const durationInFrames = duration * 30;

    const renderConfig = { fps: 30, durationInFrames, width, height, generationType };

    if (generationType === 'b-roll') {
      // Clean and extract product info from Jina scrape
      // ONLY use title - it's the most reliable indicator of product type
      const rawTitle = (product?.title || product?.name || '').toLowerCase();
      const title = rawTitle
        .replace(/url source:.*$/i, '')
        .replace(/\|.*$/i, '')  // Remove " | Daraz.pk" etc
        .replace(/https?:\/\/\S+/gi, '')
        .replace(/\[.*?\]/g, ' ')
        .replace(/[,]/g, ' ')
        .trim();
      
      console.log('Product title for detection:', title);
      
      // Detect product category ONLY from title - most reliable
      let searchQueries: string[] = [];
      
      // AIR COOLER / FAN / AC / COOLING - check FIRST before other categories
      if (title.includes('air cooler') || title.includes('air cooler') || title.includes('tower fan') || title.includes('pedestal fan') || title.includes('stand fan') || title.includes('ceiling fan') || title.includes('cooling') || title.includes('air condition') || title.includes('ac ') || title.includes('evaporative')) {
        searchQueries = ['room air cooling', 'fan cooling room', 'home cooling summer'];
      }
      // SLEEPING / CPAP / HUMIDIFIER
      else if (title.includes('sleep') || title.includes('cpap') || title.includes('humidifier') || title.includes('aroma') || title.includes(' diffuser')) {
        searchQueries = ['peaceful sleeping bedroom', 'relaxing bedroom night', 'calm bedroom interior'];
      }
      // COFFEE & DRINKS
      else if (title.includes('coffee') || title.includes('espresso') || title.includes('caffeine') || title.includes('latte') || title.includes('tea') || title.includes('café')) {
        searchQueries = ['person drinking coffee', 'coffee shop cafe', 'morning coffee ritual'];
      }
      // SKINCARE / BEAUTY
      else if (title.includes('skin') || title.includes('cream') || title.includes('moisturizer') || title.includes('beauty') || title.includes('serum') || title.includes('makeup') || title.includes('lipstick') || title.includes('cosmetics')) {
        searchQueries = ['woman skincare routine', 'applying moisturizer face', 'beauty routine woman'];
      }
      // JUICER / BLENDER / MIXER
      else if (title.includes('juicer') || title.includes('blender') || title.includes('smoothie') || title.includes('mixer') || title.includes('grinder')) {
        searchQueries = ['making fresh juice', 'blender smoothie health', 'preparing healthy drink'];
      }
      // FOOD / SNACKS
      else if (title.includes('snack') || title.includes('biscuit') || title.includes('chocolate') || title.includes('candy') || title.includes('noodle') || title.includes('chips')) {
        searchQueries = ['person eating snack', 'enjoying delicious food', 'tasty snack time'];
      }
      // GAMING / CONSOLE
      else if (title.includes('ps5') || title.includes('playstation') || title.includes('gaming') || title.includes('console') || title.includes('video game') || title.includes('xbox') || title.includes('nintendo') || title.includes('gamepad')) {
        searchQueries = ['playing video games', 'gaming room entertainment', 'person gaming setup'];
      }
      // FITNESS / WORKOUT
      else if (title.includes('workout') || title.includes('fitness') || title.includes('gym') || title.includes('exercise') || title.includes('yoga') || title.includes('treadmill') || title.includes('dumbbell')) {
        searchQueries = ['woman working out fitness', 'gym exercise training', 'fitness workout woman'];
      }
      // TECH / LAPTOP / COMPUTER
      else if (title.includes('laptop') || title.includes('computer') || title.includes('tablet') || title.includes('ipad') || title.includes('macbook')) {
        searchQueries = ['person working laptop', 'technology office work', 'using computer home'];
      }
      // PHONE / SMARTPHONE
      else if (title.includes('phone') || title.includes('smartphone') || title.includes('mobile') || title.includes('iphone') || title.includes('android') || title.includes('samsung') || title.includes('xiaomi') || title.includes('oppo') || title.includes('vivo')) {
        searchQueries = ['person using smartphone', 'texting on phone', 'mobile phone social media'];
      }
      // WATCH / JEWELRY
      else if (title.includes('watch') || title.includes('jewelry') || title.includes('necklace') || title.includes('earring') || title.includes('bracelet') || title.includes('ring')) {
        searchQueries = ['wearing luxury watch', 'wearing jewelry accessories', 'fashion accessories woman'];
      }
      // HEADPHONES / EARBUDS
      else if (title.includes('headphone') || title.includes('earbud') || title.includes('airpod') || title.includes('audio') || title.includes('earphone') || title.includes('neckband')) {
        searchQueries = ['person wearing headphones listening music', 'enjoying music with earbuds', 'audio headphones lifestyle'];
      }
      // CAMERA
      else if (title.includes('camera') || title.includes('dslr') || title.includes('mirrorless') || title.includes('photo')) {
        searchQueries = ['photography camera professional', 'taking photos camera', 'photographer shooting'];
      }
      // TV
      else if (title.includes('tv') || title.includes('television') || title.includes('smart tv') || title.includes('led tv') || title.includes('oled')) {
        searchQueries = ['watching tv entertainment', 'living room tv', 'relaxing watching television'];
      }
      // VACUUM CLEANER
      else if (title.includes('vacuum') || title.includes('cleaner')) {
        searchQueries = ['cleaning home vacuum', 'house cleaning lifestyle', 'tidy home interior'];
      }
      // KITCHEN APPLIANCES
      else if (title.includes('rice cooker') || title.includes('electric pot') || title.includes('pressure cooker') || title.includes('air fryer') || title.includes('oven') || title.includes('microwave') || title.includes('toaster')) {
        searchQueries = ['cooking kitchen appliance', 'preparing food cooking', 'healthy cooking home'];
      }
      // TOOTHBRUSH
      else if (title.includes('toothbrush') || title.includes('tooth') || title.includes('dental') || title.includes('oral')) {
        searchQueries = ['brushing teeth morning routine', 'oral hygiene dental care', 'clean teeth smile'];
      }
      // HAIR CARE
      else if (title.includes('hair dryer') || title.includes('hair straightener') || title.includes('curling') || title.includes('hairstyle') || title.includes('hair curler')) {
        searchQueries = ['styling hair blow dry', 'woman hair styling beauty', 'hair care routine'];
      }
      // SHOES / SNEAKERS
      else if (title.includes('shoe') || title.includes('sneaker') || title.includes('boot') || title.includes('sandal') || title.includes('slipper')) {
        searchQueries = ['person wearing sneakers lifestyle', 'shoes fashion style', 'casual shoes outfit'];
      }
      // BAG / BACKPACK
      else if (title.includes('bag') || title.includes('backpack') || title.includes('purse') || title.includes('handbag') || title.includes('wallet') || title.includes('clutch')) {
        searchQueries = ['woman bag fashion style', 'carrying stylish bag', 'bag lifestyle fashion'];
      }
      // UNKNOWN - use first word of title
      else {
        const words = title.split(/[\s,]+/).filter((w: string) => w.length > 3).slice(0, 2);
        searchQueries = words.length > 0 
          ? [words[0] + ' product lifestyle', 'modern home interior', 'product showcase advertisement']
          : ['lifestyle advertisement', 'product showcase', 'modern living'];
      }
      
      console.log('Search queries:', searchQueries);

      const clips: BRollClip[] = [];
      const bRollImages: BRollImage[] = [];
      const seenVideoIds = new Set<number>();
      const seenPhotoIds = new Set<number>();

      // Use correct orientation based on user's ratio
      const videoOrientation = isVertical ? 'portrait' : 'landscape';
      const photoOrientation = isVertical ? 'portrait' : 'landscape';

      // Fetch 3 clips AND 9 B-roll images for variety
      for (const searchQuery of searchQueries) {
        if (clips.length >= 3 && bRollImages.length >= 9) break;
        
        try {
          // Fetch videos FIRST (only need 3)
          if (clips.length < 3) {
            const videoResponse = await fetch(
              PEXELS_VIDEO_URL + '?query=' + encodeURIComponent(searchQuery) + 
              '&orientation=' + videoOrientation + '&per_page=15',
              {
                headers: {
                  'Authorization': PEXELS_API_KEY
                }
              }
            );

            if (videoResponse.ok) {
              const videoData = await videoResponse.json();
              
              if (videoData.videos && videoData.videos.length > 0) {
                for (const video of videoData.videos) {
                  if (clips.length >= 3) break;
                  if (seenVideoIds.has(video.id)) continue;
                  
                  const videoFiles = video.video_files || [];
                  let videoFile;
                  if (isVertical) {
                    videoFile = videoFiles
                      .filter((f: any) => f.height >= 720 && (f.width || 0) < (f.height || 0))
                      .sort((a: any, b: any) => b.height - a.height)[0];
                  } else {
                    videoFile = videoFiles
                      .filter((f: any) => f.height >= 720 && (f.width || 0) > (f.height || 0))
                      .sort((a: any, b: any) => b.height - a.height)[0];
                  }
                  
                  if (!videoFile) {
                    videoFile = videoFiles
                      .filter((f: any) => f.height >= 720)
                      .sort((a: any, b: any) => b.height - a.height)[0];
                  }

                  if (videoFile && video.duration >= 5 && video.duration <= 30) {
                    seenVideoIds.add(video.id);
                    clips.push({
                      id: video.id,
                      url: videoFile.link || videoFile.url,
                      thumbnail: video.image,
                      duration: video.duration
                    });
                  }
                }
              }
            }
          }

          // Fetch photos for B-roll images (need 9 for 3 cycles)
          if (bRollImages.length < 9) {
            const photoResponse = await fetch(
              PEXELS_PHOTO_URL + '?query=' + encodeURIComponent(searchQuery) + 
              '&orientation=' + photoOrientation + '&per_page=15',
              {
                headers: {
                  'Authorization': PEXELS_API_KEY
                }
              }
            );

            if (photoResponse.ok) {
              const photoData = await photoResponse.json();
              
              if (photoData.photos && photoData.photos.length > 0) {
                for (const photo of photoData.photos) {
                  if (bRollImages.length >= 9) break;
                  if (seenPhotoIds.has(photo.id)) continue;
                  
                  seenPhotoIds.add(photo.id);
                  bRollImages.push({
                    id: photo.id,
                    url: photo.src?.large2x || photo.src?.large || photo.src?.medium || photo.src?.original,
                    thumbnail: photo.src?.medium || photo.src?.small
                  });
                }
              }
            }
          }
        } catch (e) {
          console.log('Search failed:', searchQuery, e);
        }
      }

      // Fallback clips only if no clips found
      if (clips.length === 0) {
        clips.push(
          { id: 1, url: 'https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4', thumbnail: '', duration: 15 },
          { id: 2, url: 'https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_25fps.mp4', thumbnail: '', duration: 12 },
          { id: 3, url: 'https://videos.pexels.com/video-files/4085017/4085017-hd_1920_1080_25fps.mp4', thumbnail: '', duration: 10 },
        );
      }

      // Fallback B-roll images
      if (bRollImages.length === 0) {
        bRollImages.push(
          { id: 1, url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=800', thumbnail: '' },
          { id: 2, url: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?w=800', thumbnail: '' },
          { id: 3, url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?w=800', thumbnail: '' },
          { id: 4, url: 'https://images.pexels.com/photos/3062545/pexels-photo-3062545.jpeg?w=800', thumbnail: '' },
          { id: 5, url: 'https://images.pexels.com/photos/3756879/pexels-photo-3756879.jpeg?w=800', thumbnail: '' },
          { id: 6, url: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=800', thumbnail: '' },
          { id: 7, url: 'https://images.pexels.com/photos/3184313/pexels-photo-3184313.jpeg?w=800', thumbnail: '' },
          { id: 8, url: 'https://images.pexels.com/photos/3184119/pexels-photo-3184119.jpeg?w=800', thumbnail: '' },
          { id: 9, url: 'https://images.pexels.com/photos/3184636/pexels-photo-3184636.jpeg?w=800', thumbnail: '' },
        );
      }

      // Extract product images from Jina scrape
      let productImages: string[] = [];
      
      if (product?.images?.length > 0) {
        productImages = product.images;
      } else if (product?.pictures?.length > 0) {
        productImages = product.pictures;
      } else if (product?.image) {
        productImages = [product.image];
      } else if (product?.mainImage) {
        productImages = [product.mainImage];
      } else if (product?.thumbnail) {
        productImages = [product.thumbnail];
      }

      // Filter for quality images
      productImages = productImages.filter(img => 
        img && 
        !img.includes('sprite') && 
        !img.includes('icon') && 
        !img.includes('logo') &&
        !img.includes('360') &&
        /\.(jpg|jpeg|png|webp)(\?|$)/i.test(img)
      );

      if (!productImages.length) {
        productImages.push('https://via.placeholder.com/800x1200?text=Product');
      }

      // Ensure at least 3 images for cycling
      while (productImages.length < 3) {
        productImages.push(productImages[0]);
      }

      console.log('Clips:', clips.length, '| B-roll images:', bRollImages.length, '| Product images:', productImages.length);

      // Calculate CTA scene timing
      // Reserve last 90 frames (3 seconds) for CTA scene
      const CTA_FRAMES = 90;
      const ctaStartFrame = Math.max(0, durationInFrames - CTA_FRAMES);

      return NextResponse.json({
        renderConfig,
        bRollConfig: {
          clips,
          bRollImages: bRollImages.map(img => img.url), // Just return URLs
          keywords: searchQueries,
          totalDuration: duration,
          backgroundColor: '#ffffff',
          showCaptions: false,
          framesPerClip: 90,
          ctaStartFrame, // Frame where CTA scene begins
          ctaFrames: CTA_FRAMES, // Duration of CTA scene
        },
        productImages,
      });
    }

    return NextResponse.json({
      renderConfig,
      bRollConfig: null,
      productImages: [],
      adConfig: { style: 'full-screen', transitionStyle: 'cinematic', framesPerContent: 60 }
    });
  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate video' }, { status: 500 });
  }
}
