import LayoutMain from '@/layouts/main/LayoutMain';
import { landingPage } from '@/seo/LandingPage';
import CollectionApiService from '@/api-services/api/CollectionApiService';
import { Empty } from 'antd';
import './styles.scss';
import MyLink from '@/components/ui/link/MyLink';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}collections`,
  },
};

export default async function Collections() {
  let dataCollections = [];

  try {
    const result = await CollectionApiService.getCollections();
    if (result && result.collection) {
      dataCollections = result.collection.sort((a, b) => b.app_count - a.app_count);
    }
  } catch (error) {
    console.error('Error fetching list collections:', error);
  }

  const renderedList = dataCollections.length > 0 ? dataCollections : [];

  return (
    <LayoutMain>
      <div className="collections container">
        <div className="header-collections">
          <h1 className="header-collections-title">Collections</h1>
        </div>
        {renderedList && renderedList.length > 0 ? (
          <div className="item-list">
            <div className="item-collections">
              {renderedList.map((item, index) => (
                <div key={index} className="item-list-collections">
                  <MyLink href={`/collection/${item.collection_id}`}>{item.collection_name}</MyLink>
                  <div className="amount-app">{item.total_apps} apps</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </LayoutMain>
  );
}
