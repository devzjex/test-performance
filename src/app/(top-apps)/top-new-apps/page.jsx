import LayoutMain from '@/layouts/main/LayoutMain';
import TopNewApp from './_components/NewApps';
import { landingPage } from '@/seo/LandingPage';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-new-apps`,
  },
};

export default async function TopNewApps() {
  let initialData = {
    data: [],
  };

  try {
    const result = await DashboardTopAppService.getTopNewApps(1, 20);
    if (result) {
      initialData = {
        data: result.top_release.map((item, index) => ({
          ...item.detail,
          key: index,
          rank: 20 * (1 - 1) + index + 1,
          created_at: item.detail.launched,
        })),
      };
    }
  } catch (error) {
    console.error(`Error fetch data top new apps ${error}`);
  }

  return (
    <LayoutMain>
      <TopNewApp initialData={initialData} />
    </LayoutMain>
  );
}
