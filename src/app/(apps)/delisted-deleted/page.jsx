import LayoutMain from '@/layouts/main/LayoutMain';
import DeactiveAppList from './_components/DeactiveAppList';
import { landingPage } from '@/seo/LandingPage';
import DashboardApiService from '@/api-services/api/DashboardApiService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}delisted-deleted`,
  },
};

export default async function DelistedOrDeteledApp() {
  let initialData = {
    data: [],
    total: 0,
  };

  try {
    const result = await DashboardApiService.getListDeactiveApps('deleted', 1, 24, 'newest');
    if (result.code === 0) {
      initialData = {
        data: result.result.map((item, index) => ({
          ...item.detail,
          updated_at: item.updated_at,
          key: item.app_id,
          rank: 24 * (1 - 1) + index + 1,
        })),
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error(`Error fetch data ${error}`);
  }

  return (
    <LayoutMain>
      <DeactiveAppList initialData={initialData} />
    </LayoutMain>
  );
}
