import { NextResponse } from 'next/server';

// Force Node.js runtime for ElevenLabs compatibility
export const runtime = 'nodejs';

/**
 * Comprehensive script cleaner for ElevenLabs TTS
 * Removes all structural formatting, leaving only spoken text
 */
function cleanScriptForVoiceover(rawScript: string): string {
  if (!rawScript) return '';
  
  let text = rawScript;
  
  // Step 1: Remove all markdown images
  text = text.replace(/!\[.*?\]\(.*?\)/g, '');
  
  // Step 2: Remove markdown links but keep link text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Step 3: Remove all URLs
  text = text.replace(/https?:\/\/\S+/g, '');
  
  // Step 4: Remove text inside ALL types of brackets (creative directions, camera notes, etc.)
  // This removes [Soft music], [fade in], [close up], {emphasis}, etc.
  text = text.replace(/\[[^\]]*\]/g, '');
  text = text.replace(/\{[^}]*\}/g, '');
  text = text.replace(/\([^)]*\)/g, '');
  
  // Step 5: Remove Scene markers (Scene 1:, Scene 2:, Scene Three:, etc.)
  text = text.replace(/\bScene\s*\d+[\s:.-]*/gi, '');
  text = text.replace(/\bScene\s+[A-Za-z]+[\s:.-]*/gi, '');
  
  // Step 6: Remove Voiceover markers (VO:, VO:, Voiceover:, etc.)
  text = text.replace(/\bVO\s*:?\s*/gi, '');
  text = text.replace(/\bVoiceover\s*:?\s*/gi, '');
  text = text.replace(/\bNarrator\s*:?\s*/gi, '');
  text = text.replace(/\bSpeech\s*:?\s*/gi, '');
  
  // Step 7: Remove Line markers (Line 1:, Line 2:, etc.)
  text = text.replace(/\bLine\s*\d+[\s:.-]*/gi, '');
  
  // Step 8: Remove Visual/Action descriptions
  text = text.replace(/\bVisual\s*:?\s*/gi, '');
  text = text.replace(/\bAction\s*:?\s*/gi, '');
  text = text.replace(/\bMusic\s*:?\s*/gi, '');
  text = text.replace(/\bSound\s*:?\s*/gi, '');
  text = text.replace(/\bFade\s*:?\s*/gi, '');
  
  // Step 9: Remove markdown formatting
  text = text.replace(/\*+/g, ''); // Remove asterisks
  text = text.replace(/_+/g, ''); // Remove underscores
  text = text.replace(/#+/g, ''); // Remove hashes
  text = text.replace(/-+/g, ' '); // Replace dashes with spaces
  
  // Step 10: Clean up bullet points and list markers
  text = text.replace(/^[\s]*[-•*][\s]*/gm, '');
  text = text.replace(/^[\s]*\d+[\.\)][\s]*/gm, '');
  
  // Step 11: Normalize line breaks - split into lines, extract non-empty lines
  const lines = text.split(/\n+/);
  const spokenLines: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Only keep lines that have actual words (at least 3 characters)
    if (trimmed.length >= 3 && /[a-zA-Z]{3,}/.test(trimmed)) {
      spokenLines.push(trimmed);
    }
  }
  
  // Step 12: Join with proper spacing and capitalize sentences
  let cleaned = spokenLines.join('. ');
  
  // Step 13: Final cleanup
  cleaned = cleaned
    .replace(/\s+/g, ' ') // Normalize spaces
    .replace(/\.{2,}/g, '.') // Remove double periods
    .replace(/,\./g, '.') // Fix comma-period issues
    .replace(/^\.+/, '') // Remove leading periods
    .replace(/\.+$/, '') // Remove trailing periods
    .trim();
  
  return cleaned || '';
}

/**
 * ElevenLabs Text-to-Speech API
 * Uses the ElevenLabs REST API with xi-api-key authentication
 */
export async function POST(request: Request) {
  try {
    const { text, voiceId = 'JBFqnCBsd6RMkjVDRZzb' } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // Get ElevenLabs API key
    const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
    if (!elevenLabsApiKey) {
      console.error('ELEVENLABS_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'ELEVENLABS_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // Thoroughly clean the script for TTS - only spoken words
    const cleanedText = cleanScriptForVoiceover(text);

    if (!cleanedText || cleanedText.length < 5) {
      return NextResponse.json(
        { error: 'Text is empty or too short after cleaning' },
        { status: 400 }
      );
    }

    console.log('Cleaned script for voiceover:', cleanedText.substring(0, 100) + '...');

    // ElevenLabs TTS API endpoint
    const ELEVENLABS_API_URL = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    // Make request to ElevenLabs
    const response = await fetch(ELEVENLABS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      body: JSON.stringify({
        text: cleanedText,
        model_id: 'eleven_flash_v2_5', // Fast, high-quality model
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      
      // Return HTTP 200 with error info - never fail the pipeline
      // Client can check response body for success field
      return NextResponse.json(
        { 
          success: false,
          error: `Voiceover service error: ${response.status}`,
          message: 'Voiceover generation failed. Video will continue without narration.'
        },
        { status: 200 }  // Always return 200 to not break the pipeline
      );
    }

    // Get the audio buffer from the response
    const audioBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(audioBuffer);

    // Return audio as streaming response
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length.toString(),
        'Content-Disposition': 'inline; filename="voiceover.mp3"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Voiceover generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate voiceover' },
      { status: 500 }
    );
  }
}
