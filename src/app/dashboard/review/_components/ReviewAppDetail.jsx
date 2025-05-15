'use client';

import React, { useState } from 'react';
import { DeleteOutlined, HomeOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
import './ReviewAppDetail.scss';
import { List, Pagination, Rate, Spin, Tag, Empty, Breadcrumb } from 'antd';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { useSearchParams } from 'next/navigation';
import MyLink from '@/components/ui/link/MyLink';

export default function ReviewAppDetail({ initialDataDetailRV }) {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [listOfReview, setListOfReview] = useState(initialDataDetailRV.data);

  const nameReviewer = searchParams.get('nameReviewer') || '';
  const reviewer_location = searchParams.get('reviewer_location') || '';
  const created_at = searchParams.get('created_at') || '';
  const PAGE_DEFAULT_REVIEW = 1;
  const PER_PAGE_REVIEW = 10;

  const getReviewDashboardList = async (page, per_page, reviewer_location, reviewer_name, created_at, is_deleted) => {
    setLoading(true);
    const res = await DetailAppApiService.getReviewDashboard(
      page,
      per_page,
      reviewer_location,
      reviewer_name,
      created_at,
      is_deleted,
    );
    if (res) {
      setListOfReview(res);
    }
    setLoading(false);
  };

  const renderTitle = () => {
    const decodedReviewer = decodeURIComponent(nameReviewer || '');
    const decodedLocation = decodeURIComponent(reviewer_location || '');

    if (created_at) {
      return created_at;
    }
    if (decodedReviewer && decodedLocation) {
      return `${decodedReviewer} from ${decodedLocation}`;
    }
    if (decodedLocation) {
      return `merchants from ${decodedLocation}`;
    }
    if (decodedReviewer) {
      return decodedReviewer;
    }
    return '';
  };

  const constructTitle = () => {
    const baseTitle = 'All Shopify App Store reviews';
    const datePart = created_at ? ` created on ${renderTitle()}` : '';
    const reviewerPart = nameReviewer || reviewer_location ? ` by ${renderTitle()}` : '';

    return `${baseTitle}${datePart}${reviewerPart}`;
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
                href: '/dashboard/reviews',
                title: <span>Dashboard Review</span>,
              },
              {
                title: <span>{renderTitle()}</span>,
              },
            ]}
            separator={<RightOutlined />}
          />
        </div>
      </div>
      <div className="review_app_dashboard container">
        {listOfReview && listOfReview.data && listOfReview.data.length > 0 ? (
          <>
            <h1 className="dashboard-title">{constructTitle()}</h1>
            <List
              itemLayout="vertical"
              dataSource={listOfReview.data}
              size="large"
              renderItem={(item) => (
                <List.Item
                  key={item.title}
                  style={{
                    backgroundColor: item.is_deleted ? '#ffe6e6' : '',
                  }}
                >
                  <List.Item.Meta
                    title={
                      <div className="header-review">
                        <div className="flex items-center">
                          {nameReviewer && reviewer_location ? (
                            <b>{item.reviewer_name}</b>
                          ) : created_at || reviewer_location ? (
                            <span
                              onClick={(e) => {
                                e.preventDefault();
                                getReviewDashboardList(
                                  PAGE_DEFAULT_REVIEW,
                                  PER_PAGE_REVIEW,
                                  reviewer_location,
                                  item.reviewer_name,
                                  created_at,
                                  '',
                                );
                                window.location.href = `/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`;
                              }}
                            >
                              <MyLink
                                href={`/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`}
                              >
                                {item.reviewer_name}
                              </MyLink>
                            </span>
                          ) : (
                            <b>{item.reviewer_name}</b>
                          )}

                          {item.is_deleted && (
                            <Tag
                              icon={<DeleteOutlined />}
                              style={{
                                borderRadius: '4px',
                                marginLeft: '10px',
                              }}
                              color="#cd201f"
                            >
                              Deleted
                            </Tag>
                          )}
                        </div>
                        <span className="lable-star">
                          <Rate disabled={true} style={{ color: '#ffc225', marginRight: '10px' }} value={item.star} />
                          <span className="created-date">{item.create_date} </span>
                        </span>
                      </div>
                    }
                  />
                  <div className="total">
                    From app:{' '}
                    <MyLink href={`/app/${item.app_id}`}>
                      {item.app_name ? item.app_name : item.app_id.charAt(0).toUpperCase() + item.app_id.slice(1)}
                    </MyLink>
                  </div>
                  <div className="locale">
                    Location:{' '}
                    {nameReviewer && reviewer_location ? (
                      <b>{item.reviewer_location}</b>
                    ) : created_at || nameReviewer ? (
                      <span
                        onClick={(e) => {
                          e.preventDefault();
                          getReviewDashboardList(
                            PAGE_DEFAULT_REVIEW,
                            PER_PAGE_REVIEW,
                            item.reviewer_location,
                            nameReviewer,
                            created_at,
                            '',
                          );
                          window.location.href = `/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`;
                        }}
                      >
                        <MyLink
                          href={`/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`}
                        >
                          {item.reviewer_location}
                        </MyLink>
                      </span>
                    ) : (
                      <b>{item.reviewer_location}</b>
                    )}
                    {item.time_spent_using_app ? ` - ${item.time_spent_using_app}` : ''}
                  </div>
                  <span className="content">{item.content}</span>
                </List.Item>
              )}
            />
          </>
        ) : (
          <Empty />
        )}
        {listOfReview.data?.length > 0 ? (
          <div className="pagination">
            <Pagination
              total={listOfReview.total_all}
              onChange={(page, pageSize) =>
                getReviewDashboardList(page, pageSize, reviewer_location, nameReviewer, created_at, '')
              }
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total.toLocaleString('en-US')} reviews`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Spin>
  );
}
