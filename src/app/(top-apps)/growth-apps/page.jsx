import LayoutMain from '@/layouts/main/LayoutMain';
import GrowthApps from './_components/GrowthApps';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import dayjs from 'dayjs';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';

export default async function page() {
  let initialDataTopGrowth = {
    data: [],
    total: 0,
    cate: [],
  };

  const dateFormat = 'YYYY-MM-DD';
  const start_date = dayjs().subtract(30, 'd').format(dateFormat);
  const end_date = dayjs().format(dateFormat);

  const formatCategoriesToTreeData = (categories) => {
    return categories.map((category) => ({
      title: category.category_name,
      value: category.category_id,
      children: category.child ? formatCategoriesToTreeData(category.child) : [],
    }));
  };

  try {
    const [data, dataCate] = await Promise.all([
      DashboardTopAppService.getDashboardGrowthApps(1, 20, start_date, end_date, '', false, 0),
      LandingPageApiService.getCategoriesHome(),
    ]);

    if (data && data.code === 0 && dataCate) {
      const formattedCategories = formatCategoriesToTreeData(dataCate.category);

      initialDataTopGrowth = {
        data: data.data,
        total: data.total_app,
        cate: formattedCategories,
      };
    }
  } catch (error) {
    console.error(`Error fetch data growth app ${error}`);
  }

  return (
    <LayoutMain>
      <GrowthApps initialDataTopGrowth={initialDataTopGrowth} />
    </LayoutMain>
  );
}
