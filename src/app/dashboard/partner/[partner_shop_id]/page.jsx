import LayoutMain from '@/layouts/main/LayoutMain';
import DashBoardPartner from './_components/DashBoardPartner/DashBoardPartner';
import MyPartnerApiService from '@/api-services/api/MyPartnerApiService';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';

export default async function DetailPartnerPage({ params, searchParams }) {
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = dayjs().subtract(30, 'd').format(dateFormat);
  const toDate = dayjs().format(dateFormat);
  const partnerID = params.partner_shop_id;
  const token = cookies().get('accessToken')?.value;

  let initialDataPartner = {
    dataPartner: [],
  };

  try {
    try {
      const response = await MyPartnerApiService.getAppDetailPartnerIdToServer(partnerID, fromDate, toDate, token);
      if (response && response.code === 0) {
        initialDataPartner = {
          dataPartner: response.data,
        };
      }
    } catch (error) {
      console.error('Error fetching dashboard partner:', error);
    }
  } catch (error) {
    console.error('Error fail fetch data partner', error);
  }

  return (
    <LayoutMain>
      <DashBoardPartner
        partnerId={partnerID}
        partnerName={searchParams.partner}
        initialDataPartner={initialDataPartner}
      />
    </LayoutMain>
  );
}
