import CompareAppService from '@/api-services/api/CompareAppApiService';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import LandingPage from '@/components/landing-page/LandingPage';
import LayoutMain from '@/layouts/main/LayoutMain';
import { landingPage } from '@/seo/LandingPage';
import { cookies } from 'next/headers';

const URL_DOMAIN_APP = process.env.NEXT_PUBLIC_REACT_APP_DOMAIN;

export const metadata = {
  openGraph: {
    title: 'Letsmetrix',
    description: `${landingPage.description}`,
    url: `${URL_DOMAIN_APP}`,
    siteName: 'Letsmetrix',
    images: [
      {
        url: 'https://letsmetrix.com/_next/image?url=%2Fimage%2Flogo_update.webp&w=96&q=75',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function Home() {
  let initialData = {
    categories: [],
    topApp: {},
    count: {},
    top5App: [],
    dataCompareApps: [],
    topKeywords: [],
  };

  const defaultSelectedApps = [
    {
      app_id: 'judgeme',
      name: 'Judge.me Product Reviews App',
      icon: 'https://cdn.shopify.com/app-store/listing_images/8cada0f5da411a64e756606bb036f1ed/icon/CIfp9fWd34sDEAE=.png',
    },
    {
      app_id: 'loox',
      name: 'Loox ‑ Product Reviews App',
      icon: 'https://cdn.shopify.com/app-store/listing_images/252ae7c55fa0e8a35df7f6ff3c8c1596/icon/CPLp1Kb0lu8CEAE=.jpg',
    },
  ];
  const baseApp = defaultSelectedApps[0].app_id;
  const compareApps = defaultSelectedApps
    .slice(1)
    .map((app) => app.app_id)
    .join('-lmtvs-');

  const dataCategory = (allCategory) => {
    if (allCategory) {
      return allCategory.map((item) => {
        return {
          value: item.category_id,
          title: item.category_name,
          children: dataCategory(item.child),
        };
      });
    }
  };

  try {
    const [top5Apps, dataCategoryPos, dataTopMover, dataTopReview, dataTopRelease, count, dataCompare] =
      await Promise.all([
        LandingPageApiService.getTop5Apps('finding-products'),
        LandingPageApiService.getCategoriesHome('uk'),
        LandingPageApiService.getTopMoverHome(),
        LandingPageApiService.getTopReviewHome(),
        LandingPageApiService.getTopReleaseHome(),
        LandingPageApiService.getCount(),
        CompareAppService.compareApps(baseApp, compareApps),
      ]);

    if (
      top5Apps.code === 0 &&
      dataCategoryPos.code === 0 &&
      dataTopMover.code === 0 &&
      dataTopReview.code === 0 &&
      dataTopRelease.code === 0 &&
      count.code === 0 &&
      dataCompare.code === 0
    ) {
      const categories = dataCategory(dataCategoryPos?.category);
      const topApp = {
        topMovers: dataTopMover?.data,
        topReviews: dataTopReview?.result,
        topRelease: dataTopRelease?.top_release,
      };
      const top5App = top5Apps?.data?.apps ? top5Apps.data.apps.sort((a, b) => a.star - b.star) : [];
      const dataCompareApps = dataCompare.data;

      const dataAppCompare = dataCompareApps[1]?.app_compare || [];
      const allAppIds = [dataCompareApps[0]?.app_host?.app_id, ...dataAppCompare.map((item) => item.app_id)];

      const keywordsPromises = allAppIds.map(async (appId) => {
        if (appId) {
          const response = await CompareAppService.getTopKeyWords(appId);
          return response.data;
        }
      });

      const resolvedKeywords = await Promise.all(keywordsPromises);

      initialData = {
        categories,
        topApp,
        count,
        top5App,
        dataCompareApps,
        topKeywords: resolvedKeywords.flat(),
      };
    }
  } catch (error) {
    console.error(`Error loading data: ${error.message || 'Unknown'}`);
  }

  return (
    <LayoutMain>
      <LandingPage initialData={initialData} />
    </LayoutMain>
  );
}
