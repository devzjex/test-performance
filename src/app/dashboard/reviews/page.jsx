import LayoutMain from '@/layouts/main/LayoutMain';
import DashboardReviewPage from './_components/DashboardReviewPage';
import { DashboardReview } from '@/seo/Reviews';
import dayjs from 'dayjs';
import DashboardReviewsApiService from '@/api-services/api/DashboardReviewsApiService';

const { title, canonical } = DashboardReview;

export const metadata = {
  title: title,
  alternates: {
    canonical: canonical,
  },
};

export default async function DashBoardReviews() {
  let initialDataReview = {
    totalReviews: 0,
    reviewsDeleted: [],
    topReviews: [],
    topStore: [],
    topLocation: [],
    reviewsCategory: [],
  };

  const dateFormat = 'YYYY-MM-DD';
  const fromDate = dayjs().subtract(30, 'day').format(dateFormat);
  const toDate = dayjs().format(dateFormat);

  try {
    const [totalReviews, reviewsDeleted, topReviews, topStore, topLocation, reviewsCategory] = await Promise.all([
      DashboardReviewsApiService.getTotalReviews(fromDate, toDate),
      DashboardReviewsApiService.getReviewDeleted(fromDate, toDate),
      DashboardReviewsApiService.getTopNewReviews(fromDate, toDate),
      DashboardReviewsApiService.storeMostReview(fromDate, toDate),
      DashboardReviewsApiService.locationMostReview(fromDate, toDate),
      DashboardReviewsApiService.getReviewCategory(fromDate, toDate),
    ]);
    initialDataReview = {
      totalReviews: totalReviews.result,
      reviewsDeleted: reviewsDeleted.result,
      topReviews: topReviews.result,
      topStore: topStore.result,
      topLocation: topLocation.result,
      reviewsCategory: reviewsCategory.result,
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }

  return (
    <LayoutMain>
      <DashboardReviewPage initialDataReview={initialDataReview} />
    </LayoutMain>
  );
}
