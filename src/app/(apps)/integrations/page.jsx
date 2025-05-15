import LayoutMain from '@/layouts/main/LayoutMain';
import AppListing from './_components/AppListing';
import { landingPage } from '@/seo/LandingPage';
import DashboardApiService from '@/api-services/api/DashboardApiService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}integrations`,
  },
};

export default async function Integrations() {
  let initialData = {
    data: [],
    total: 0,
  };

  try {
    const result = await DashboardApiService.getIntegrations(1, 24, 'newest');
    if (result && result.code === 0) {
      initialData = {
        data: result.result,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error(`Error fetch data ${error}`);
  }

  return (
    <LayoutMain>
      <AppListing initialData={initialData} />
    </LayoutMain>
  );
}
