import LayoutMain from '@/layouts/main/LayoutMain';
import DetailStore from './_components/DetailStore';
import StoreApiService from '@/api-services/api/StoreApiService';
import { cookies } from 'next/headers';

export default async function DetailStorePage({ params, searchParams }) {
  const token = cookies().get('accessToken')?.value;
  const { domain } = params;
  const sourceStore = searchParams.source;

  let initialDataStoreDetail = {
    storeData: [],
  };

  try {
    const response = await StoreApiService.getDetailStoreToServer(domain, sourceStore, token);
    if (response && response.code === 0) {
      initialDataStoreDetail = {
        storeData: response.data,
      };
    }
  } catch (error) {
    console.error('Error calling API Detail Store:', error);
  }

  return (
    <LayoutMain>
      <DetailStore initialDataStoreDetail={initialDataStoreDetail} />
    </LayoutMain>
  );
}
