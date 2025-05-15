import LayoutMain from '@/layouts/main/LayoutMain';
import MostReviews from './_components/MostReviews';
import { landingPage } from '@/seo/LandingPage';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-reviewed`,
  },
};

export default async function TopReviewed() {
  let initialData = {
    data: [],
    total: 0,
  };

  try {
    let result = await DashboardTopAppService.getTopReview(1, 20, '');
    if (result) {
      initialData = {
        data: result.result.map((item, index) => ({
          ...item.detail,
          pricing_max: item.pricing_max,
          pricing_min: item.pricing_min,
          rank: 20 * (1 - 1) + index + 1,
          key: index,
        })),
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error(`Error fetch data ${error}`);
  }

  return (
    <LayoutMain>
      <MostReviews initialData={initialData} />
    </LayoutMain>
  );
}
