import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DOWNLOADS_DIR = path.join(process.cwd(), 'public');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Basic path traversal guard
  const sanitized = path.basename(filename);
  const filePath = path.join(DOWNLOADS_DIR, sanitized);

  // Only serve known PDF files
  const allowed = ['icc-sample-questions.pdf', 'icc-sample-questions-fr.pdf', 'study-checklist-30-day.pdf', 'study-checklist-30-day-fr.pdf'];
  if (!allowed.includes(sanitized)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const buffer = fs.readFileSync(filePath);
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${sanitized}"`,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
