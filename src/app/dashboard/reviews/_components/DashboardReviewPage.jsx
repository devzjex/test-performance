'use client';

import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, message, Row, Spin } from 'antd';
import './DashboardReviewPage.scss';
import DashboardReviewsApiService from '@/api-services/api/DashboardReviewsApiService';
import dayjs from 'dayjs';
import TotalReview from './total-review/TotalReview';
import DeletedPercent from './deleted-percent/DeletedPercent';
import TopStore from './top-store/TopStore';
import TopNewReviews from './top-new-reviews/TopNewReviews';

const { RangePicker } = DatePicker;

export default function DashboardReviewPage({ initialDataReview }) {
  const dateFormat = 'YYYY-MM-DD';
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, 'day').format(dateFormat));
  const [toDate, setToDate] = useState(dayjs().format(dateFormat));
  const [data, setData] = useState(initialDataReview);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetailApp = async (fromDate, toDate) => {
    setIsLoading(true);
    try {
      const [totalReviews, reviewsDeleted, topReviews, topStore, topLocation, reviewsCategory] = await Promise.all([
        DashboardReviewsApiService.getTotalReviews(fromDate, toDate),
        DashboardReviewsApiService.getReviewDeleted(fromDate, toDate),
        DashboardReviewsApiService.getTopNewReviews(fromDate, toDate),
        DashboardReviewsApiService.storeMostReview(fromDate, toDate),
        DashboardReviewsApiService.locationMostReview(fromDate, toDate),
        DashboardReviewsApiService.getReviewCategory(fromDate, toDate),
      ]);
      setData({
        totalReviews: totalReviews.result,
        reviewsDeleted: reviewsDeleted.result,
        topReviews: topReviews.result,
        topStore: topStore.result,
        topLocation: topLocation.result,
        reviewsCategory: reviewsCategory.result,
      });
    } catch (error) {
      message.error('Error fetching initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      setFromDate(dates[0].format(dateFormat));
      setToDate(dates[1].format(dateFormat));
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    fetchDetailApp(fromDate, toDate);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="container dashboard">
        <h1 className="dashboard-title">Review Dashboard</h1>
        <div className="dashboard-range">
          <RangePicker
            defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
            format={dateFormat}
            allowClear={false}
            onChange={onChangeDateRange}
            disabledDate={disabledFutureDate}
          />
          <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
            Search
          </Button>
        </div>
        <Row className="dashboard-content" justify="space-between">
          <Col className="content-review-chart total-day">
            <div className="chart-title">Total Review By Day</div>
            <div className="chart-desc">Number of new reviews per day</div>
            <TotalReview data={data ? data?.totalReviews : []} />
          </Col>
          <Col className="content-review-chart percent-chart">
            <Row>
              <Col span={24}>
                <div className="chart-title">Category Breakdown</div>
              </Col>
              <div className="chart-desc">Number of reviews in category</div>
            </Row>
            <Row justify="center">
              {data && (
                <DeletedPercent
                  data={data?.reviewsCategory.map((item) => {
                    return {
                      type: item.name,
                      value: item.review_count,
                      _id: item._id,
                    };
                  })}
                  total={60}
                />
              )}
            </Row>
          </Col>
          <Col className="content-review-chart location-chart">
            <div className="chart-title">The store has the most reviews</div>
            <div className="chart-desc">
              Stage: {`${dayjs(fromDate).format(dateFormat)} - ${dayjs(toDate).format(dateFormat)}`}
            </div>
            <TopStore data={data ? data.topStore : []} isStore />
          </Col>
          <Col className="content-review-chart location-chart">
            <div className="chart-title">The location has the most reviews</div>
            <div className="chart-desc">
              Stage: {`${dayjs(fromDate).format(dateFormat)} - ${dayjs(toDate).format(dateFormat)}`}
            </div>
            <TopStore data={data ? data.topLocation : []} />
          </Col>
          <Col span={24} className="content-chart-reviews">
            <div className="chart-title">Top New Reviews</div>
            <TopNewReviews data={data ? data.topReviews : []} />
          </Col>
          <Col span={24} className="content-chart-reviews">
            <div className="chart-title">Deleted Reviews</div>
            <TopNewReviews data={data ? data.reviewsDeleted : []} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}
