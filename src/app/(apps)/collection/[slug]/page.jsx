import LayoutMain from '@/layouts/main/LayoutMain';
import CategoryCollectionDetail from '@/components/category-collection/CategoryCollectionDetail';
import { collections } from '@/seo/AppDashboard';
import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const slug = params.slug;
  const cacheFileName = 'collections';
  let cachedMetadata = readCache(cacheFileName);

  if (cachedMetadata[slug]) {
    const { metadata, timestamp } = cachedMetadata[slug];
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
    const collection = await CategoriesApiService.getConversationCollection(
      slug,
      'best_match',
      1,
      24,
      'uk',
      'rank',
      'all',
      0,
      0,
    );
    const { title, description, metaTitle, canonical } = collections;

    const metadata = {
      title: title(collection.data.text, currentYear),
      description: description(collection.data.text, currentYear),
      metaTitle: metaTitle(collection.data.text, currentYear),
      canonical: canonical(slug),
    };

    cachedMetadata[slug] = {
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
    console.error('Error fetching collections detail:', error);
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

export default async function Collection({ params }) {
  const slug = params.slug;
  let dataInitial = {
    initialData: {},
    initialPricingRange: [],
    initialAvgPrice: 0,
    initialDataCategory: [],
    initialTotal: 0,
    initialPage: 1,
  };

  try {
    const collection = await CategoriesApiService.getConversationCollection(
      slug,
      'best_match',
      1,
      24,
      'uk',
      'rank',
      'all',
      0,
      0,
    );

    if (collection.code === 0) {
      dataInitial = {
        initialData: collection.data,
        initialPricingRange: collection.filter_range_price,
        initialAvgPrice: collection.price_avg,
        initialDataCategory: collection.data.apps,
        initialTotal: collection.total,
        initialPage: 1,
      };
    }
  } catch (error) {
    console.error('Error fetching collections detail:', error);
  }

  return (
    <LayoutMain>
      <CategoryCollectionDetail dataInitial={dataInitial} />
    </LayoutMain>
  );
}
