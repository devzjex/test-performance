'use client';

import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { Breadcrumb, Col, Empty, Pagination, Row, Spin } from 'antd';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import ItemDetail from '../item-detail/ItemDetail';
import './CategoryCollectionCompare.scss';
import { ExportOutlined, HomeOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
import MyLink from '../ui/link/MyLink';

export default function CategoryCollectionCompare({ initialData }) {
  const pathname = usePathname();
  const isCategory = pathname.includes('category');
  const [data, setData] = useState(initialData.data);
  const page = 1;
  const per_page = 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(per_page);
  const [total, setTotal] = useState(initialData.total);
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 2];
  const id = lastPart;
  const [loading, setLoading] = useState(false);
  const sort_by = 'best_match';
  const language = 'uk';
  const priceType = 'all';
  const sortType = 'rank';
  const priceRange = 'all';

  const asyncFetch = async (id, page, per_page, sort_by, language, sortType, priceType, priceRange) => {
    setLoading(true);
    const rangeMax = 0;
    const rangeMin = 0;
    let result = isCategory
      ? await CategoriesApiService.getConversationCategory(
          id,
          sort_by,
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        )
      : await CategoriesApiService.getConversationCollection(
          id,
          sort_by === 'popular' ? 'most_popular' : 'best_match',
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        );
    setLoading(false);
    if (result && result.code == 0) {
      setData(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total);
    } else {
      message.error('Internal Server Error');
    }
  };

  const onChangePage = (page, per_page) => {
    asyncFetch(id, page, per_page, sort_by, language, sortType, priceType, priceRange);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="breadcrumb-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                href: `/${isCategory ? 'categories' : 'collections'}`,
                title: <span> {isCategory ? 'Categories' : 'Collections'}</span>,
              },
              {
                title: <span>{data ? data.text : ''}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
        {data?.apps ? (
          <div className="developer-detail container">
            <div className="list-developer-detail">
              <div className="info-developer-detail">
                <div className="information-cate-compare">
                  <div className="amount-app">
                    <h1 className="title-name">{data ? data.text : ''} </h1>
                    <span>{total} apps</span>
                  </div>
                  <MyLink
                    target="_blank"
                    href={`https://apps.shopify.com/partners/${id}?utm_source=letsmetrix.com&utm_medium=developer&utm_content=${
                      data ? data.text : ''
                    }`}
                    rel="noopener nofollow noreferrer"
                  >
                    <div className="link">
                      View Shopify
                      <ExportOutlined className="icon-share" />
                    </div>
                  </MyLink>
                </div>
              </div>
              <div className="body-developer-detail">
                <div className="list-item">
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    {data?.apps &&
                      data?.apps.map((item, index) => {
                        return (
                          <Col
                            style={{ marginTop: '15px' }}
                            className="gutter-row"
                            lg={8}
                            xs={12}
                            md={12}
                            key={'' + index}
                          >
                            <ItemDetail value={item} />
                          </Col>
                        );
                      })}
                  </Row>
                </div>
              </div>
            </div>
            {total > 0 ? (
              <div className="pagination flex justify-center">
                <Pagination
                  pageSize={numberPage}
                  current={currentPage}
                  onChange={(page, pageSize) => {
                    setCurrentPage(page);
                    setNumberPage(pageSize);
                    onChangePage(page, pageSize);
                  }}
                  total={total}
                  showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
                  pageSizeOptions={[24, 48, 96, 192].map(String)}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Empty />
        )}
      </Spin>
    </>
  );
}
