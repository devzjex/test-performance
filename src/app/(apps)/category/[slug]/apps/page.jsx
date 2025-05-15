import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import CategoryCollectionCompare from '@/components/category-collection-compare/CategoryCollectionCompare';
import LayoutMain from '@/layouts/main/LayoutMain';

export default async function page({ params }) {
  let initialData = {
    data: [],
    total: 0,
  };

  try {
    const result = await CategoriesApiService.getConversationCategory(
      params.slug,
      'best_match',
      1,
      24,
      'uk',
      'rank',
      'all',
      0,
      0,
    );

    if (result && result.code == 0) {
      initialData = {
        data: result.data,
        total: result.total,
      };
    }
  } catch (error) {
    console.log(`Error fetch data ${error}`);
  }

  return (
    <LayoutMain>
      <CategoryCollectionCompare initialData={initialData} />
    </LayoutMain>
  );
}
