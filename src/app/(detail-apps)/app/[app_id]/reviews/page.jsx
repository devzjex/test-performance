import LayoutMain from '@/layouts/main/LayoutMain';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { AppDetailReviews } from '@/seo/AppDetail';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';
import Script from 'next/script';
import { cookies } from 'next/headers';
import ReviewNotLogged from './_components/review-not-logged/ReviewNotLogged';
import ReviewLogged from './_components/review-logged/ReviewLogged';

export const generateMetadata = async ({ params }) => {
  const app_id = params.app_id;
  const cacheFileName = 'appReviews';
  let cachedMetadata = readCache(cacheFileName);

  if (cachedMetadata[app_id]) {
    const { metadata, timestamp } = cachedMetadata[app_id];
    if (!shouldUpdateMetadata(timestamp, 1)) {
      const { title, description, metaTitle, canonical } = metadata;
      return {
        title: title || '',
        description: description || '',
        openGraph: {
          title: metaTitle || '',
          description: description || '',
        },
        alternates: {
          canonical: canonical || '',
        },
        other: {
          title: metaTitle || '',
        },
      };
    } else {
      clearCache(cacheFileName);
    }
  }

  try {
    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    const { title, description, metaTitle, canonical } = AppDetailReviews;
    const appName = appDetail.data.detail.name;

    const metadata = {
      title: title(appName),
      description: description(appName),
      metaTitle: metaTitle(appName),
      canonical: canonical(app_id),
    };

    cachedMetadata[app_id] = {
      metadata,
      timestamp: new Date().getTime(),
    };
    writeCache(cacheFileName, cachedMetadata);

    return {
      title: metadata.title || '',
      description: metadata.description || '',
      openGraph: {
        title: metadata.metaTitle || '',
        description: metadata.description || '',
      },
      alternates: {
        canonical: metadata.canonical || '',
      },
      other: {
        title: metadata.metaTitle || '',
      },
    };
  } catch (error) {
    console.error('Error fetching app_reviews detail:', error);
    return {
      title: '',
      description: '',
      openGraph: {
        title: '',
        description: '',
      },
      alternates: {
        canonical: '',
      },
      other: {
        title: '',
      },
    };
  }
};

export default async function Reviews({ params }) {
  const token = cookies().get('accessToken')?.value;
  const app_id = params.app_id;
  let jsonLd = null;

  let initialDataAppInfo = {
    appDetail: [],
  };

  let initialDataReviews = {
    dataListOfReview: [],
    dataSummaryReview: [],
  };

  try {
    const reviewSchemaDetail = await DetailAppApiService.getDataSchemaReviewId(app_id);
    if (reviewSchemaDetail && reviewSchemaDetail.data) {
      const { app_name, review_count, star, data } = reviewSchemaDetail;

      const aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: star || 0,
        ratingCount: review_count || 0,
      };

      const reviews = data.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.reviewer_name || '',
        },
        datePublished: review.create_date || '',
        reviewBody: review.content || '',
        reviewRating: {
          '@type': 'Rating',
          bestRating: '5',
          ratingValue: review.star.toString() || '0',
          worstRating: '1',
        },
      }));

      if (review_count > 0 && star > 0) {
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: app_name || '',
          operatingSystem: 'Shopify',
          applicationCategory: 'DeveloperApplication',
          aggregateRating,
          review: reviews,
        };
      }
    }

    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    if (appDetail.code === 0) {
      initialDataAppInfo = {
        appDetail: appDetail,
      };
    }

    const [dataFilterRV, dataRVInfoSummary] = await Promise.all([
      DetailAppApiService.getFilterReviewApp(app_id, null, 1, 10, 'create_date', [], [], [], [], []),
      DetailAppApiService.getReviewAppInfoSummary(app_id),
    ]);

    if (dataFilterRV.code === 0 && dataRVInfoSummary.code === 0) {
      initialDataReviews = {
        dataListOfReview: dataFilterRV,
        dataSummaryReview: dataRVInfoSummary,
      };
    }
  } catch (error) {
    console.error('Error fetching review schema details:', error);
  }

  return (
    <>
      <LayoutMain>
        {token ? (
          <ReviewLogged initialDataReviews={initialDataReviews} />
        ) : (
          <ReviewNotLogged initialDataAppInfo={initialDataAppInfo} initialDataReviews={initialDataReviews} />
        )}
      </LayoutMain>
      {jsonLd && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
          id={app_id}
        />
      )}
    </>
  );
}
