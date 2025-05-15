import LayoutMain from '@/layouts/main/LayoutMain';
import SearchDetail from './_components/SearchDetail';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';

export const metadata = {
  robots: {
    index: false,
  },
};

export default async function SearchPage(search) {
  const query = search.searchParams.q;

  let initialData = {
    apps: [],
    partners: [],
    categories: [],
    collections: [],
    total: 0,
  };

  try {
    const result = await SearchDataApiService.searchDataHome(query, 1, 20);
    if (result && result.code === 0) {
      initialData = {
        apps: result.data.apps,
        partners: result.data.partners,
        categories: result.data.categories,
        collections: result.data.collections,
        total: result.total,
      };
    }
  } catch (error) {
    console.error('Error fetching search data:', error);
  }

  return (
    <LayoutMain>
      <SearchDetail initialData={initialData} />
    </LayoutMain>
  );
}
