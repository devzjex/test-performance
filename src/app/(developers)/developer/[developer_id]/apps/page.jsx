import LayoutMain from '@/layouts/main/LayoutMain';
import DeveloperDetailApps from './_components/DeveloperDetailApps';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';

export default async function DeveloperPageCompare({ params }) {
  const id = params.developer_id;

  let initialDataDetail = {
    data: [],
    total: 0,
  };

  try {
    let result = await DashboardDeveloperApiService.getDetailDeveloper(id, 1, 24, 'review');
    if (result && result.code === 0) {
      initialDataDetail = {
        data: result.data,
        total: result.total_app,
      };
    }
  } catch (error) {
    console.log('Error fetch data', error);
  }

  return (
    <LayoutMain>
      <DeveloperDetailApps initialDataDetail={initialDataDetail} />
    </LayoutMain>
  );
}
