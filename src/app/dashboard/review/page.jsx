import LayoutMain from '@/layouts/main/LayoutMain';
import ReviewAppDetail from './_components/ReviewAppDetail';
import { ReviewDetail } from '@/seo/Reviews';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';

export const generateMetadata = async ({ searchParams }) => {
  const params = new URLSearchParams(searchParams);
  const queryString = Array.from(params.keys())
    .map((key) => `${key}=${encodeURIComponent(params.get(key))}`)
    .join('&');
  const { canonical } = ReviewDetail;

  return {
    alternates: {
      canonical: canonical(queryString),
    },
  };
};

export default async function Review(searchParams) {
  let initialDataDetailRV = {
    data: [],
  };

  const nameReviewer = searchParams.searchParams.nameReviewer || '';
  const reviewer_location = searchParams.searchParams.reviewer_location || '';
  const created_at = searchParams.searchParams.created_at || '';
  const PAGE_DEFAULT_REVIEW = 1;
  const PER_PAGE_REVIEW = 10;

  try {
    const res = await DetailAppApiService.getReviewDashboard(
      PAGE_DEFAULT_REVIEW,
      PER_PAGE_REVIEW,
      reviewer_location,
      nameReviewer,
      created_at,
      '',
    );
    if (res) {
      initialDataDetailRV = { data: res };
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }

  return (
    <LayoutMain>
      <ReviewAppDetail initialDataDetailRV={initialDataDetailRV} />
    </LayoutMain>
  );
}
