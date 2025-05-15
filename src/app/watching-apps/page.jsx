import LayoutMain from '@/layouts/main/LayoutMain';
import WatchingAppsComponent from './_components/WatchingApps';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}watching-apps`,
  },
};

export default function WatchingApps() {
  return (
    <LayoutMain>
      <WatchingAppsComponent />
    </LayoutMain>
  );
}
