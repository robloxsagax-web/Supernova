import { NextResponse } from 'next/server';

// Note: Video saving to server filesystem is not supported on Vercel Free Tier
// Users should download videos directly from the browser using the Remotion Player controls
// This endpoint is kept for API compatibility but does not save files to the server

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // On Vercel Free Tier, we cannot write to the filesystem
    // Return a success message directing users to use browser download
    return NextResponse.json({ 
      success: true,
      message: 'Video generated successfully. Please use the download button in the video player to save your video.',
      note: 'Server-side file saving is not available on Vercel Free Tier. Use browser download instead.'
    });
  } catch (error) {
    console.error('Error saving video:', error);
    return NextResponse.json(
      { error: 'Failed to save video' },
      { status: 500 }
    );
  }
}