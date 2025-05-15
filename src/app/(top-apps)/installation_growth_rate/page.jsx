import LayoutMain from '@/layouts/main/LayoutMain';
import InstallationGrowthRate from './_components/InstallationGrowthRate';
import { landingPage } from '@/seo/LandingPage';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}installation_growth_rate`,
  },
};

export default async function InstallationGrowthRatePage() {
  let initialDataInstallationGrowRate = {
    data: [],
    total: 0,
  };

  try {
    let result = await DashboardTopAppService.getInstallationGrowthRate(1, 20, '');
    if (result) {
      initialDataInstallationGrowRate = {
        data: result.data,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error(`Error fetch data installation growth rate  ${error}`);
  }

  return (
    <LayoutMain>
      <InstallationGrowthRate initialDataInstallationGrowRate={initialDataInstallationGrowRate} />
    </LayoutMain>
  );
}
