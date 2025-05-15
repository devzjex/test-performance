'use client';

import React, { useState } from 'react';
import './DeveloperDetail.scss';
import { Row, Col, Spin, Empty, Breadcrumb } from 'antd';
import { Pagination, Select } from 'antd';
import ItemDetailDeveloper from './ItemDetailDeveloper';
import { HomeOutlined, LoadingOutlined, RightOutlined, StarFilled } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import MyLink from '@/components/ui/link/MyLink';

const { Option } = Select;

function DeveloperDetail({ initialDataDetail }) {
  const pathname = usePathname();
  const [data, setData] = useState(initialDataDetail.data);

  const page = 1;
  const per_page = 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(per_page);
  const [total, setTotal] = useState(initialDataDetail.total);

  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const id = lastPart;
  const [selectValue, setSelectValue] = useState('review');
  const [loading, setLoading] = useState(false);

  const asyncFetch = async (id, page, per_page, selectValue) => {
    setLoading(true);
    let result = await DashboardDeveloperApiService.getDetailDeveloper(id, page, per_page, selectValue);
    if (result && result.code === 0) {
      setData(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setLoading(false);
  };

  const handleSelectChange = (value) => {
    setSelectValue(value);
    asyncFetch(id, page, per_page, value);
  };

  const onChangePage = (page, per_page) => {
    asyncFetch(id, page, per_page, selectValue);
  };

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
      <div className="breadcrumb-header">
        <div className="container">
          <Breadcrumb
            items={[
              {
                href: '/',
                title: <HomeOutlined />,
              },
              {
                href: '/developers',
                title: <span>Developers Dashboard</span>,
              },
              {
                title: <span>{data ? data.name : ''}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      {data?.apps ? (
        <div className="developer-detail container">
          <div className="list-developer-detail">
            <div className="info-developer-detail">
              <div>
                <h1 className="title-name">{data ? data.name : ''} </h1>
                <div className="amount-app">
                  <span>{total} apps</span>
                  <p>
                    <StarFilled className="icon-star" /> {data.avg_star} / {data.review_count} reviews
                  </p>
                </div>
                <div className="link">
                  <MyLink
                    target="_blank"
                    href={`https://apps.shopify.com/partners/${id}?utm_source=letsmetrix.com&utm_medium=developer&utm_content=${
                      data ? data.name : ''
                    }`}
                    rel="noopener nofollow noreferrer"
                  >
                    {`apps.shopify.com/partners/${id}`}
                  </MyLink>
                </div>
              </div>
              <div>
                <label>Sort:</label>
                <Select className="sort-developer-detail type-select" value={selectValue} onChange={handleSelectChange}>
                  <Option value="review">Review</Option>
                  <Option value="first launched">First launched</Option>
                </Select>
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
                          xs={24} // 1 cột trên màn hình mobile
                          sm={12} // 2 cột trên tablet nhỏ
                          md={12} // 2 cột trên tablet lớn
                          lg={8} // 3 cột trên desktop
                          key={'' + index}
                        >
                          <ItemDetailDeveloper value={item} />
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
  );
}

export default DeveloperDetail;
