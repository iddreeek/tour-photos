import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
 
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
 
  const blob = await put(`tour-photo/${filename}`, request.body, {
    access: 'public',
  });
 
  return NextResponse.json(blob);
}