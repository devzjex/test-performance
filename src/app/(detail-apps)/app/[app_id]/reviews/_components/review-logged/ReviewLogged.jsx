'use client';

import { HomeOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React from 'react';
import ReviewApp from '../review/ReviewApp';

export default function ReviewLogged({ initialDataReviews }) {
  const countData = initialDataReviews?.dataSummaryReview?.data;

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
                title: <span> App</span>,
              },
              {
                href: `/app/${countData?.app_id}`,
                title: <span>{countData?.app_name}</span>,
              },
              {
                title: <span>Reviews</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <ReviewApp initialDataReviews={initialDataReviews} />
    </>
  );
}
