import LayoutMain from '@/layouts/main/LayoutMain';
import DetailAppPage from './_components/detail-app/DetailAppPage';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { AppDetail } from '@/seo/AppDetail';
import Script from 'next/script';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';
import { cookies } from 'next/headers';
import dayjs from 'dayjs';
import LayoutDetailApp from './_components/detail-app-not-logged/LayoutDetailApp';
import ProductPage from './_components/detail-app-not-logged/product/ProductPage';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const app_id = params.app_id;
  const cacheFileName = 'appDetails';
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

  let title, description, metaTitle, canonical;
  let appName = '',
    appMetaTitle = '',
    appMetaDesc = '';

  try {
    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    if (appDetail && appDetail.data && appDetail.data.detail) {
      appName = appDetail.data.detail.name || '';
      appMetaTitle = appDetail.data.detail.metatitle || '';
      appMetaDesc = appDetail.data.detail.metadesc || '';
    }
  } catch (error) {
    console.error('Error fetching app detail:', error);
  }

  if (AppDetail) {
    const {
      title: getTitle,
      description: getDescription,
      metaTitle: getMetaTitle,
      canonical: getCanonical,
    } = AppDetail;
    title = getTitle(appName, currentYear);
    description = getDescription(appName, appMetaDesc);
    metaTitle = getMetaTitle(appName, currentYear);
    canonical = getCanonical(app_id);
  }

  const metadata = { title, description, metaTitle, canonical };

  cachedMetadata[app_id] = {
    metadata,
    timestamp: new Date().getTime(),
  };
  writeCache(cacheFileName, cachedMetadata);

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
};

export default async function DetailApp({ params }) {
  const token = cookies().get('accessToken')?.value;
  const app_id = params.app_id;
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = dayjs().subtract(30, 'd').format(dateFormat);
  const toDate = dayjs().format(dateFormat);

  let star = 0,
    reviewCount = 0,
    appIcon = '',
    desc = '',
    name = '',
    partnerName = '',
    pricingPlans = [];
  let jsonLd = null;
  let jsonLdFAQ = null;
  let isDeleted = false;

  let initialDataAppInfo = {
    appDetail: [],
  };

  let initialDataCateCollections = {
    dataCategory: [],
    dataCollection: [],
  };

  let initialDataChart = {
    dataCategoryPos: [],
    ratingChange: [],
    reviewsChange: [],
    changeLog: [],
  };

  let initialPanes = [];

  try {
    const [appDetail, ratingChange, reviewsChange, changeLog, dataCategoryPos, dataCategory, dataCollection] =
      await Promise.all([
        token ? DetailAppApiService.getInfoAppLoggedServer(app_id, token) : DetailAppApiService.getAppInfo(app_id),
        DetailAppApiService.getRatingChange(app_id, fromDate, toDate),
        DetailAppApiService.getReviewsChange(app_id, fromDate, toDate),
        DetailAppApiService.getChangeLog(app_id, fromDate, toDate),
        DetailAppApiService.getCategoryPositionChange(app_id, fromDate, toDate),
        DetailAppApiService.getCategoryPosition(app_id, fromDate, toDate),
        DetailAppApiService.getCollectionPosition(app_id, fromDate, toDate),
      ]);

    if (ratingChange && reviewsChange && changeLog && dataCategoryPos) {
      initialDataChart = {
        dataCategoryPos: dataCategoryPos.data,
        ratingChange: ratingChange.data,
        reviewsChange: reviewsChange.data.filter((item) => item.type === 'Review'),
        changeLog: changeLog.data,
      };
    }

    if (dataCategory.code === 0 && dataCollection.code === 0) {
      initialDataCateCollections = {
        dataCategory: dataCategory.data,
        dataCollection: dataCollection.data,
      };
    }

    if (appDetail && appDetail.data && appDetail.data.detail) {
      initialDataAppInfo = {
        appDetail: appDetail,
      };

      star = appDetail.data.detail.star || 0;
      reviewCount = appDetail.data.detail.review_count || 0;
      appIcon = appDetail.data.detail.app_icon || '';
      desc = appDetail.data.detail.description || '';
      name = appDetail.data.detail.name || '';
      partnerName = appDetail.data.detail.partner?.name || '';
      pricingPlans = appDetail.data.detail.pricing_plan || [];
      isDeleted = appDetail.data?.delete;

      let offers;
      const priceRegex = /^\$\d+(\.\d{1,2})?$/;

      if (pricingPlans.length === 0) {
        offers = {
          '@type': 'Offer',
          name: 'Free',
          availability: 'InStock',
          price: '0',
          priceCurrency: 'USD',
        };
      } else {
        offers = pricingPlans.map((plan) => {
          const isValidPrice = priceRegex.test(plan.pricing);

          return {
            '@type': 'Offer',
            name: plan.title || 'Free',
            availability: 'InStock',
            price: isValidPrice ? plan.pricing.replace('$', '').trim() : '0',
            priceCurrency: 'USD',
          };
        });
      }

      if (reviewCount > 0 && star > 0) {
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${name}`,
          url: `https://letsmetrix.com/app/${app_id}`,
          description: `${desc}`,
          image: `${appIcon}`,
          brand: {
            '@type': 'Brand',
            name: `${partnerName}`,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            worstRating: '1',
            bestRating: '5',
            ratingValue: `${star}`,
            reviewCount: `${reviewCount}`,
          },
          offers: offers,
        };
      } else {
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${name}`,
          url: `https://letsmetrix.com/app/${app_id}`,
          description: `${desc}`,
          image: `${appIcon}`,
          brand: {
            '@type': 'Brand',
            name: `${partnerName}`,
          },
          offers: offers,
        };
      }

      const infoApp = appDetail.data.detail;
      const pricingPlan = infoApp.pricing_plan || [];
      const hasFreePlan = pricingPlan.some((plan) => plan.pricing.toLowerCase().includes('free'));
      const minPricing =
        pricingPlan?.length > 0
          ? `$${Math.min(...pricingPlan.map((plan) => parseFloat(plan.pricing.replace('$', ''))))}`
          : 'N/A';

      jsonLdFAQ = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `1. Is ${infoApp.name} free on Shopify?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${
                hasFreePlan
                  ? `Yes! Try ${infoApp.name} free plan. For more details about ${infoApp.name} pricing, check here`
                  : `No. ${infoApp.name} pricing starts at [${minPricing}/month]. For more details about ${infoApp.name} pricing, check here`
              }`,
            },
          },
          {
            '@type': 'Question',
            name: `2. How do I install ${infoApp.name} on my Shopify store?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: ` - Navigate to the Shopify App Store, search for ${infoApp.name}, and click “Add app.” - Follow the prompts to install.Pro Tip: Ensure you’re logged into your Shopify admin account.`,
            },
          },
          ...(infoApp.languages && infoApp.languages.length > 0
            ? [
                {
                  '@type': 'Question',
                  name: `3. What languages does ${infoApp.name} support?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${infoApp.name} supports: ${infoApp.languages.join(', ')}`,
                  },
                },
              ]
            : []),
          ...(infoApp.integrations && infoApp.integrations.length > 0
            ? [
                {
                  '@type': 'Question',
                  name: `4. Which App/Tool does ${infoApp.name} integrate with?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${infoApp.name} integrates seamlessly with ${infoApp.integrations[0].split(/\s+/).join(', ')}`,
                  },
                },
              ]
            : []),
        ],
      };

      initialPanes = [
        {
          appId: appDetail.data.app_id,
          title: {
            ...appDetail,
            built_for_shopify: appDetail.data.detail.built_for_shopify,
            name: appDetail.data.detail.name || '',
          },
          content: <></>,
          changed: appDetail.changed,
          name: appDetail.data.detail.name || '',
          isFollow: {
            appId: appDetail.data.app_id,
            isFollow: appDetail.is_follow,
          },
          key: '1',
          closable: false,
        },
      ];

      appDetail.competitor?.map((item) => {
        const activeKey = (initialPanes && initialPanes.length ? +initialPanes[initialPanes.length - 1].key : 0) + 1;
        initialPanes.push({
          appId: item.app_id,
          title: {
            ...item,
            name: item.name,
          },
          content: <></>,
          changed: item.changed,
          name: item.name || '',
          isFollow: {
            appId: item.app_id,
            isFollow: item.is_follow,
          },
          key: activeKey,
        });
      });
    }
  } catch (error) {
    console.error('Error fetching app detail:', error);
  }

  return (
    <>
      <LayoutMain>
        {token ? (
          <DetailAppPage
            app_id={app_id}
            initialDataAppInfo={initialDataAppInfo}
            initialPanes={initialPanes}
            initialDataCateCollections={initialDataCateCollections}
            token={token}
          />
        ) : (
          <LayoutDetailApp initialDataAppInfo={initialDataAppInfo}>
            <ProductPage
              initialDataAppInfo={initialDataAppInfo}
              initialDataCateCollections={initialDataCateCollections}
              app_id={app_id}
              initialDataChart={initialDataChart}
              token={token}
            />
          </LayoutDetailApp>
        )}
      </LayoutMain>
      {!isDeleted && jsonLd && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
          id={app_id}
        />
      )}
      {!token && (
        <Script
          id="FAQ"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
