import LayoutMain from '@/layouts/main/LayoutMain';
import { Col, Row } from 'antd';
import './page.scss';
import { fetchData } from '@/utils/functions';
import MyLink from '@/components/ui/link/MyLink';

async function fetchSitemapData() {
  const [collectionsRes, categoriesRes, developersRes] = await Promise.all([
    fetchData('https://api.letsmetrix.com/collection/sitemap'),
    fetchData('https://api.letsmetrix.com/category/sitemap'),
    fetchData('https://api.letsmetrix.com/partner/sitemap'),
  ]);

  return {
    collections: collectionsRes.collection,
    categories: categoriesRes.category,
    developers: developersRes.partners,
  };
}

const renderCategories = (categories, margin = 12, size = 0, fontWeight = 0) => {
  size = size + 16;
  fontWeight = fontWeight + 600;
  return categories.map((item) => (
    <Col key={item.category_id} md={8} sm={12} xs={24} className="category-name">
      <div className="list-item-categories" style={{ margin: margin, fontSize: size }}>
        <div className="item-categories-detail">
          <div className="item-name">
            <MyLink style={{ fontWeight: fontWeight }} href={`/category/${item.category_id}`}>
              {item.category_name}
            </MyLink>
          </div>
        </div>
        {item.child && renderCategories(item.child, margin, size - 17, fontWeight - 700)}
      </div>
    </Col>
  ));
};

export default async function SitemapPage() {
  const { collections, categories, developers } = await fetchSitemapData();

  return (
    <LayoutMain>
      <div className="sitemap container">
        <div className="header-category">Categories</div>
        {categories && <Row gutter={[16, 16]}>{renderCategories(categories)}</Row>}
        <div className="header-category">Collections</div>
        {collections && (
          <Row gutter={20}>
            {collections.map((item) => (
              <Col key={item.collection_id} md={8} sm={12} xs={24} className="collection-name">
                <MyLink href={`/collection/${item.collection_id}`} style={{ fontWeight: 600 }}>
                  {item.collection_name}
                </MyLink>
              </Col>
            ))}
          </Row>
        )}
        <div className="header-category">Developers</div>
        {developers && (
          <Row>
            {developers.map((item) => (
              <Col key={item.id} md={8} sm={12} xs={24} className="developer-name">
                <MyLink href={`/developer/${item.id}`} style={{ fontWeight: 600 }}>
                  {item.name}
                </MyLink>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </LayoutMain>
  );
}
