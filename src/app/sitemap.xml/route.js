import { BASE_URL } from '@/common/constants';
import { DOMAIN } from '@/constants/ApiUrl';
import { NextResponse } from 'next/server';

export const sendUrlsToIndexNow = async (urls) => {
  const key = '6848abfa538d4407bffd694153c0a6c9';
  const keyLocation = `${BASE_URL}key-lmt.txt`;
  const searchEngineUrl = `www.bing.com`;
  const apiUrl = `https://${searchEngineUrl}/indexnow`;

  const chunkSize = 1000;

  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize); // Chia nhỏ danh sách URL thành từng chunk

    const body = {
      host: 'letsmetrix.com',
      key: key,
      keyLocation: keyLocation,
      urlList: chunk.map((url) => url.loc),
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        console.log(`Chunk ${i / chunkSize + 1}: URLs sent successfully to IndexNow`);
      } else {
        const errorText = await response.text();
        console.error(
          `Chunk ${i / chunkSize + 1}: Failed to notify IndexNow. Status: ${response.status}, Response: ${errorText}`,
        );
      }
    } catch (error) {
      console.error(`Chunk ${i / chunkSize + 1}: Error sending URLs to IndexNow:`, error);
    }
  }
};

export async function GET() {
  try {
    const currentDate = new Date().toISOString();
    const sitemapFiles = [
      { filename: 'category.xml', lastmod: currentDate },
      { filename: 'collection.xml', lastmod: currentDate },
      { filename: 'app.xml', lastmod: currentDate },
      { filename: 'developer.xml', lastmod: currentDate },
      { filename: 'blog.xml', lastmod: currentDate },
      { filename: 'app-pricing.xml', lastmod: currentDate },
    ];

    let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemapFiles.forEach((sitemap) => {
      sitemapIndexXml += `
        <sitemap>
          <loc>${DOMAIN}${sitemap.filename}</loc>
          <lastmod>${sitemap.lastmod}</lastmod>
        </sitemap>`;
    });

    sitemapIndexXml += `
      </sitemapindex>`;

    return new NextResponse(sitemapIndexXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
