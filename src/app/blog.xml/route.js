import { NextResponse } from 'next/server';
import { fetchData } from '@/utils/functions';
import { sendUrlsToIndexNow } from '../sitemap.xml/route';
import { checkAndUpdateLastSentDate } from '@/utils/data/bing/CacheTimeRequest';

export async function GET() {
  try {
    const currentDate = new Date().toISOString();
    const page = 1;
    const per_page = 10;
    const url = `https://api.letsmetrix.com/blogs/all?page=${page}&per_page=${per_page}`;
    const blogs = await fetchData(url);

    const urls = blogs.data.map((item) => ({
      loc: `https://letsmetrix.com/blogs/${item.slug}`,
      lastmod: currentDate,
    }));

    let sitemapXml = `<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach((url) => {
      sitemapXml += `
      <url>
        <loc>${url.loc}</loc>
        <changefreq>weekly</changefreq>
        <lastmod>${url.lastmod}</lastmod>
        <priority>0.6</priority>
      </url>`;
    });

    sitemapXml += `
    </urlset>`;

    const isTimeToSend = await checkAndUpdateLastSentDate('blogIndexNow.json');

    if (isTimeToSend) {
      await sendUrlsToIndexNow(urls);
    }

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
