import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import CategoryCollectionDetail from '@/components/category-collection/CategoryCollectionDetail';
import DescriptionContent from '@/components/category-collection/description-content/DescriptionContent';
import LayoutMain from '@/layouts/main/LayoutMain';
import { categories } from '@/seo/AppDashboard';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const slug = params.slug;
  const cacheFileName = 'categories';
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
    const categoryData = await CategoriesApiService.getConversationCategory(
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

    if (categoryData.code === 0) {
      const { title, description, metaTitle, canonical } = categories;

      const metadata = {
        title: title(categoryData.data.text, currentYear),
        description: description(categoryData.data.text),
        metaTitle: metaTitle(categoryData.data.text),
        canonical: canonical(slug),
      };

      cachedMetadata[slug] = {
        metadata,
        timestamp: new Date().getTime(),
      };
      writeCache(cacheFileName, cachedMetadata);

      return {
        title: title(categoryData.data.text, currentYear),
        description: description(categoryData.data.text),
        openGraph: {
          title: metaTitle(categoryData.data.text),
          description: description(categoryData.data.text),
        },
        alternates: {
          canonical: canonical(slug),
        },
        other: {
          title: metaTitle(categoryData.data.text) || '',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching categories detail:', error);
  }

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
};

export default async function Category({ params }) {
  const slug = params.slug;

  let textCate = '';
  let descCate = '';
  let dataInitial = {
    initialData: {},
    initialPricingRange: [],
    initialAvgPrice: 0,
    initialDataCategory: [],
    initialTotal: 0,
    initialPage: 1,
  };

  try {
    const [categoryData, dataDescCate] = await Promise.all([
      CategoriesApiService.getConversationCategory(slug, 'best_match', 1, 24, 'uk', 'rank', 'all', 0, 0),
      CategoriesApiService.getDescCategory(slug),
    ]);

    textCate = categoryData?.code === 0 ? categoryData : null;
    descCate = dataDescCate?.code === 0 ? dataDescCate.data.description : '';

    if (categoryData.code === 0) {
      dataInitial = {
        initialData: categoryData.data,
        initialPricingRange: categoryData.filter_range_price,
        initialAvgPrice: categoryData.price_avg,
        initialDataCategory: categoryData.data.apps,
        initialTotal: categoryData.total,
        initialPage: 1,
      };
    }
  } catch (error) {
    console.error('Error fetching desc cate:', error);
  }

  return (
    <LayoutMain>
      <DescriptionContent text={descCate} dataText={textCate} />
      <CategoryCollectionDetail dataInitial={dataInitial} />
    </LayoutMain>
  );
}
