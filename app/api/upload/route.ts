import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { auth } from '@/lib/auth';

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// POST /api/upload
// Accepts multipart/form-data with:
//   - file: File
//   - formId: string
//   - questionId: string
export async function POST(req: NextRequest) {
  // Require auth OR allow public (for respondent file uploads)
  // We allow both — just tag folder differently

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const formId = formData.get('formId') as string;
    const questionId = formData.get('questionId') as string;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: `Ukuran file melebihi batas maksimal 10 MB.` },
        { status: 413 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine resource type
    const mimeType = file.type;
    let resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto';
    if (mimeType.startsWith('image/')) resourceType = 'image';
    else if (mimeType.startsWith('video/')) resourceType = 'video';

    const result = await uploadToCloudinary(buffer, {
      folder: `ssiti/responses/${formId ?? 'misc'}`,
      resource_type: resourceType,
    });

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      format: result.format,
      bytes: result.bytes,
      originalName: file.name,
    });
  } catch (err) {
    console.error('[POST /api/upload]', err);
    return NextResponse.json({ error: 'Upload gagal. Coba lagi.' }, { status: 500 });
  }
}

