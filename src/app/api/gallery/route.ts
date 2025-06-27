// src/app/api/gallery/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const galleryDir = path.join(process.cwd(), 'public/images/gallery');
  
  try {
    const imageFiles = fs.readdirSync(galleryDir)
      // .webp 파일만 필터링
      .filter(file => /\.webp$/i.test(file)); 
      
    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error("Error reading gallery directory in API route:", error);
    return NextResponse.json({ error: 'Failed to load gallery images' }, { status: 500 });
  }
}