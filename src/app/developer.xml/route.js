export const dynamic = 'force-dynamic';

import { fetchData } from '@/utils/functions';
import { NextResponse } from 'next/server';
import { sendUrlsToIndexNow } from '../sitemap.xml/route';
import { checkAndUpdateLastSentDate } from '@/utils/data/bing/CacheTimeRequest';

export async function GET() {
  try {
    const currentDate = new Date().toISOString();
    const developers = await fetchData(`https://api.letsmetrix.com/partner/sitemap`, { cacheOption: 'no-store' });

    const urls = developers.partners
      .filter((item) => !item.id.includes('&'))
      .map((item) => ({
        loc: `https://letsmetrix.com/developer/${item.id}`,
        lastmod: currentDate,
      }));

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach((url) => {
      sitemapXml += `
      <url>
        <loc>${url.loc}</loc>
        <changefreq>weekly</changefreq>
        <lastmod>${url.lastmod}</lastmod>
        <priority>0.8</priority>
      </url>`;
    });

    sitemapXml += `
    </urlset>`;

    const isTimeToSend = await checkAndUpdateLastSentDate('developerIndexNow.json');

    if (isTimeToSend) {
      await sendUrlsToIndexNow(urls);
    }

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
