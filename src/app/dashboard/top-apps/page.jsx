import LayoutMain from '@/layouts/main/LayoutMain';
import DashboardTopApps from './_components/DashboardTopApps';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';

export default async function DashboardTopAppPage() {
  let initialDataTopApps = {
    growthReview: [],
    growthRate: [],
    mostReview: [],
    categories: [],
    reviewCategoryData: [],
  };

  const dataCategory = (allCategory) => {
    if (allCategory) {
      return allCategory.map((item) => ({
        value: item.category_id,
        title: item.category_name,
        children: dataCategory(item.child) || [],
      }));
    }
  };

  try {
    const [growthReview, growthRate, mostReview, allCategory, reviewCategory] = await Promise.all([
      DashboardTopAppService.getDashboardGrowthReview(),
      DashboardTopAppService.getDashboardGrowthRate(),
      DashboardTopAppService.getDashboardMostReview(),
      LandingPageApiService.getCategoriesHome(),
      DashboardTopAppService.getDashboardReviewCategory('finding-products'),
    ]);

    if (
      growthReview.code === 0 &&
      growthRate.code === 0 &&
      mostReview.code === 0 &&
      allCategory.code === 0 &&
      reviewCategory.code === 0
    ) {
      const categories = dataCategory(allCategory?.category);
      initialDataTopApps = {
        growthReview: growthReview.result,
        growthRate: growthRate.data,
        mostReview: mostReview.result,
        categories,
        reviewCategoryData: reviewCategory.result,
      };
    }
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }

  return (
    <LayoutMain>
      <DashboardTopApps initialDataTopApps={initialDataTopApps} />
    </LayoutMain>
  );
}
