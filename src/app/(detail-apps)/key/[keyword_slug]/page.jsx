import LayoutMain from '@/layouts/main/LayoutMain';
import DetailKey from './_components/DetailKey';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { cookies } from 'next/headers';

export default async function KeywordSlugPage({ params }) {
  const token = cookies().get('accessToken')?.value;

  let initialData = {
    data: [],
    dataKey: [],
    total: 0,
  };

  try {
    const result = await DetailAppApiService.getKeywordByLanguageToServer(params.keyword_slug, token);

    if (result.code !== 102) {
      initialData = {
        data: { ...result.data, text: result.data.text ? result.data.text : data.text },
        dataKey: result.data.apps,
        total: result.total,
      };
    }
  } catch (error) {
    console.error(`Error fetch data keyword by language`, error);
  }

  return (
    <LayoutMain>
      <DetailKey initialData={initialData} />
    </LayoutMain>
  );
}
