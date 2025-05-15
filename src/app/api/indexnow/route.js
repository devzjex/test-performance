import { BASE_URL } from '@/common/constants';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { url } = await req.json();
  const key = '6848abfa538d4407bffd694153c0a6c9';
  const keyLocation = `${BASE_URL}key-lmt.txt`;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const searchEngineUrl = `www.bing.com`;

  const apiUrl = `https://${searchEngineUrl}/indexnow?url=${encodeURIComponent(
    url,
  )}&key=${key}&keyLocation=${encodeURIComponent(keyLocation)}`;

  try {
    const response = await fetch(apiUrl, { method: 'GET' });
    if (response.status === 200) {
      return NextResponse.json({ message: 'URL sent successfully to IndexNow' });
    } else {
      return NextResponse.json({ error: 'Failed to notify IndexNow' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Request failed' }, { status: 500 });
  }
}
