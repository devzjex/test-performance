import LayoutMain from '@/layouts/main/LayoutMain';
import GrowthReview from './_components/GrowthReview';
import { landingPage } from '@/seo/LandingPage';
import dayjs from 'dayjs';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-reviewed`,
  },
};

export default async function TopReviewed() {
  let initialDataTopGrowthRV = {
    data: [],
    total: 0,
  };

  const dateFormat = 'YYYY-MM-DD';
  const fromDate = dayjs().subtract(30, 'd').format(dateFormat);
  const toDate = dayjs().format(dateFormat);

  try {
    let result = await DashboardTopAppService.getTopGrowthReview(fromDate, toDate, 1, 20, '');
    if (result) {
      initialDataTopGrowthRV = {
        data: result.result,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error(`Error fetch data top growth review  ${error}`);
  }

  return (
    <LayoutMain>
      <GrowthReview initialDataTopGrowthRV={initialDataTopGrowthRV} />
    </LayoutMain>
  );
}
