import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64 for Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'real-estate',
      resource_type: 'auto',
    });

    // Return the Cloudinary URL
    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Fallback to local upload if Cloudinary is not configured
    try {
      const { writeFile, mkdir } = await import('fs/promises');
      const { join } = await import('path');
      const { existsSync } = await import('fs');
      
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      
      if (!file) throw new Error('No file');
      
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = file.name.split('.').pop();
      const filename = `${uniqueSuffix}.${fileExtension}`;
      const filePath = join(uploadDir, filename);
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (localError) {
      console.error('Local upload also failed:', localError);
    }
    
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
