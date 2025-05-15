import LayoutMain from '@/layouts/main/LayoutMain';
import TableListDeveloper from './_components/TableListDeveloper';
import { landingPage } from '@/seo/LandingPage';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}developers-by-day`,
  },
};

export default async function DevelopersByDay(searchParam) {
  let initialDataDeveloperByDay = {
    data: [],
    total: 0,
  };
  const date = searchParam.searchParams.date;

  try {
    const result = await DashboardDeveloperApiService.getDeveloperByDate(1, 20, date);

    if (result && result.code == 0) {
      initialDataDeveloperByDay = {
        data: result.result,
        total: result.total,
      };
    }
  } catch (error) {
    console.error('Error fetch data ', error);
  }

  return (
    <LayoutMain>
      <TableListDeveloper initialDataDeveloperByDay={initialDataDeveloperByDay} />
    </LayoutMain>
  );
}
