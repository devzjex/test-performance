import LayoutMain from '@/layouts/main/LayoutMain';
import MyPartner from './_components/MyPartner';
import MyPartnerApiService from '@/api-services/api/MyPartnerApiService';
import { cookies } from 'next/headers';

export default async function MyPartnerPage() {
  const token = cookies().get('accessToken')?.value;

  let initialData = {
    data: [],
    filteredApps: [],
    total: 0,
  };

  try {
    const response = await MyPartnerApiService.getMyPartnersToServer(token);

    if (response.code === 0) {
      initialData = {
        data: response.data,
        filteredApps: response.data.flatMap((partner) => partner.apps),
        total: response.data.flatMap((partner) => partner.apps).length,
      };
    }
  } catch (error) {
    console.error('Failed to fetch data my partner:', error);
  }

  return (
    <LayoutMain>
      <MyPartner initialData={initialData} />
    </LayoutMain>
  );
}
