import LayoutMain from '@/layouts/main/LayoutMain';
import DashboardDeveloper from './_components/DashboardDeveloper';
import { DeveloperDashboard } from '@/seo/Developer';
import { landingPage } from '@/seo/LandingPage';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import dayjs from 'dayjs';

const { canonical } = landingPage;
const { title } = DeveloperDashboard;

export const metadata = {
  title: title,
  alternates: {
    canonical: `${canonical}developers`,
  },
};

export default async function Developers() {
  let initialDataDevelopers = {
    developerByDay: [],
    developerMostApp: [],
    newDevelopers: [],
    status: [],
    developerCountry: [],
  };

  const dateFormat = 'YYYY-MM-DD';
  const fromDate = dayjs().subtract(30, 'd').format(dateFormat);
  const toDate = dayjs().format(dateFormat);

  try {
    const [developerByDay, developerMostApps, newDeveloper, statusDeveloper, partnerCountry] = await Promise.all([
      DashboardDeveloperApiService.getDeveloperByDay(fromDate, toDate),
      DashboardDeveloperApiService.getDeveloperMostApps(fromDate, toDate),
      DashboardDeveloperApiService.getNewDevelopers(fromDate, toDate),
      DashboardDeveloperApiService.getStatusDevelopers(fromDate, toDate),
      DashboardDeveloperApiService.getMostFrequentPartnerCountry(),
    ]);
    if (
      developerByDay.code === 0 &&
      developerMostApps.code === 0 &&
      newDeveloper.code === 0 &&
      statusDeveloper.code === 0 &&
      partnerCountry.code === 0
    )
      initialDataDevelopers = {
        developerByDay: developerByDay.result,
        developerMostApp: developerMostApps.result,
        newDevelopers: newDeveloper.result,
        status: statusDeveloper,
        developerCountry: partnerCountry,
      };
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }

  return (
    <LayoutMain>
      <DashboardDeveloper initialDataDevelopers={initialDataDevelopers} />
    </LayoutMain>
  );
}
