import LayoutMain from '@/layouts/main/LayoutMain';
import { landingPage } from '@/seo/LandingPage';
import GrowthRate from './_components/GrowthRate';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}growth_rate`,
  },
};

export default async function GrowthRatePage() {
  let initialDataGrowthRate = {
    data: [],
    total: 0,
  };

  try {
    let result = await DashboardTopAppService.getGrowthRate(1, 20, '');
    if (result) {
      initialDataGrowthRate = {
        data: result.data,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error(`Error fetch data growth rate  ${error}`);
  }

  return (
    <LayoutMain>
      <GrowthRate initialDataGrowthRate={initialDataGrowthRate} />
    </LayoutMain>
  );
}
