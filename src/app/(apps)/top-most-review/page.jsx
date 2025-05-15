import LayoutMain from '@/layouts/main/LayoutMain';
import DetailReviewApps from './_components/DetailReviewApps';
import { landingPage } from '@/seo/LandingPage';
import DashboardApiService from '@/api-services/api/DashboardApiService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-most-review`,
  },
};

export default async function TopMostReview() {
  let initialListApp = {
    listApp: [],
    total: 0,
  };

  try {
    const result = await DashboardApiService.getAppsMostReview(1, 24);
    if (result && result.code == 0) {
      initialListApp = {
        listApp: result.result,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error(`Error fetch data ${error}`);
  }

  return (
    <LayoutMain>
      <DetailReviewApps initialListApp={initialListApp} />
    </LayoutMain>
  );
}
