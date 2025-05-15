import { fetchData } from '@/utils/functions';
import { NextResponse } from 'next/server';
import { sendUrlsToIndexNow } from '../sitemap.xml/route';
import { checkAndUpdateLastSentDate } from '@/utils/data/bing/CacheTimeRequest';

export async function GET() {
  try {
    const dataApps = await fetchData(`https://api.letsmetrix.com/app/get_all_apps`, { cacheOption: 'no-store' });
    const urls = dataApps.data.map((item) => ({
      loc: `https://letsmetrix.com/app/${item.app_id}/pricing`,
    }));

    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach((url) => {
      sitemapXml += `
      <url>
        <loc>${url.loc}</loc>
      </url>`;
    });

    sitemapXml += `
    </urlset>`;

    const isTimeToSend = await checkAndUpdateLastSentDate('appPricingIndexNow.json');

    if (isTimeToSend) {
      await sendUrlsToIndexNow(urls);
    }

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
