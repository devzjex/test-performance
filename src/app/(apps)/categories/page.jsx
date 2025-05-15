import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import LayoutMain from '@/layouts/main/LayoutMain';
import { landingPage } from '@/seo/LandingPage';
import { Empty } from 'antd';
import './styles.scss';
import MyLink from '@/components/ui/link/MyLink';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}categories`,
  },
};

export default async function Categories() {
  let dataCategories = [];

  try {
    const result = await CategoriesApiService.getCategories();
    if (result && result.category) {
      let sortedData = result.category.map((cat) => {
        return {
          ...cat,
          child: cat.child
            .map((subCat) => {
              return {
                ...subCat,
                child: subCat.child.sort((a, b) => b.app_count - a.app_count),
              };
            })
            .sort((a, b) => b.app_count - a.app_count),
        };
      });
      dataCategories = sortedData;
    }
  } catch (error) {
    console.error('Error fetching list categories:', error);
  }

  const renderedList = dataCategories
    ? dataCategories.map((item, index) => {
        const itemsChild = item && item.child ? item.child : '';
        const renderedListAll = (categories, dataCategories = [], margin = 0, size = 0, fontWeight = 0) => {
          let data = dataCategories;
          margin = margin + 30;
          size = size + 16;
          fontWeight = fontWeight + 500;
          categories.forEach((item, index) => {
            data.push(
              <div
                style={{ marginLeft: margin, fontSize: size }}
                className="list-item-categories"
                key={item.category_id || index}
              >
                <div className="item-categories-detail">
                  <div className="item-name">
                    <MyLink style={{ fontWeight: fontWeight }} href={'/category/' + item.category_id}>
                      {item.category_name}
                    </MyLink>
                  </div>
                  <div className="amount-app">{item.total_apps} apps</div>
                </div>
              </div>,
            );
            if (item.child && item.child.length) {
              renderedListAll(item.child, data, margin + 15, size - 18, fontWeight - 600);
            }
          });
          return data;
        };
        return (
          <div className="item-list" key={item._id || index}>
            <div className="item-categories">
              <div className="title-categories">
                <div className="item-categories-detail">
                  <div className="item-name">
                    <MyLink style={{ fontWeight: 600 }} href={'/category/' + item.category_id}>
                      {item.category_name}
                    </MyLink>
                  </div>
                  <div className="amount-app">{item.total_apps} apps</div>
                </div>
              </div>
              {renderedListAll(itemsChild, [])}
            </div>
          </div>
        );
      })
    : '';

  return (
    <LayoutMain>
      <div className="categories container">
        <div className="header-categories">
          <h1 className="header-categories-title">Categories</h1>
        </div>
        {dataCategories && dataCategories.length > 0 ? <>{renderedList}</> : <Empty />}
      </div>
    </LayoutMain>
  );
}
