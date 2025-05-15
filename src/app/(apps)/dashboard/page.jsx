import LayoutMain from '@/layouts/main/LayoutMain';
import DashboardApp from './_components/DashboardApp';
import { AppDashboard } from '@/seo/AppDashboard';
import { landingPage } from '@/seo/LandingPage';
import DashboardApiService from '@/api-services/api/DashboardApiService';
import dayjs from 'dayjs';

const { title } = AppDashboard;
const { canonical } = landingPage;

export const metadata = {
  title: title,
  alternates: {
    canonical: `${canonical}dashboard`,
  },
};

export default async function Dashboard() {
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = dayjs().subtract(30, 'd').format(dateFormat);
  const toDate = dayjs().format(dateFormat);

  let initialData = {
    appsByDay: [],
    statusApps: [],
    appsMostReview: [],
    appsBFS: [],
  };

  try {
    const [appsByDay, statusApps, appsMostReview, appsBFS] = await Promise.all([
      DashboardApiService.getAppsByDay(fromDate, toDate),
      DashboardApiService.getStatusApps(fromDate, toDate),
      DashboardApiService.getAppsMostReview(1, 10),
      DashboardApiService.getAppsBFS(fromDate, toDate),
    ]);

    if (appsByDay.code === 0 && statusApps.code === 0 && appsMostReview.code === 0 && appsBFS.code === 0) {
      initialData = {
        appsByDay: appsByDay.result,
        statusApps: statusApps.result[0].result,
        appsMostReview: appsMostReview.result,
        appsBFS: appsBFS.result,
      };
    }
  } catch (error) {
    console.error('Error fetch data fail', error);
  }

  return (
    <LayoutMain>
      <DashboardApp initialData={initialData} />
    </LayoutMain>
  );
}
