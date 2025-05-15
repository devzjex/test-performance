import DashboardApiService from '@/api-services/api/DashboardApiService';
import ListAppByDay from '@/components/list-app/ListAppByDay';
import LayoutMain from '@/layouts/main/LayoutMain';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}app-by-day`,
  },
};

export default async function AppByDay(params) {
  const sort_by = params.searchParams.sort_by;
  const date = params.searchParams.date;

  let initialData = {
    listApp: [],
    total: 0,
  };

  try {
    const result = await DashboardApiService.getAppsByDate(sort_by, date, 1, 20);
    if (result && result.code == 0) {
      initialData = {
        listApp: result.result,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.error('Error fetching list app by day:', error);
  }

  return (
    <LayoutMain>
      <ListAppByDay initialData={initialData} />
    </LayoutMain>
  );
}
