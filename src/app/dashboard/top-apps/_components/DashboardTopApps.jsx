'use client';

import React, { useState } from 'react';
import './DashboardTopApps.scss';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import { Col, message, Row, TreeSelect } from 'antd';
import GrowthReview from './growth-review/GrowthReview';
import ReviewCategory from './review-category/ReviewCategory';
import MostReview from './most-review/MostReview';
import GrowRate from './growth-rate/GrowRate';
import MyLink from '@/components/ui/link/MyLink';

export default function DashboardTopApps({ initialDataTopApps }) {
  const [valueFilter, setValueFilter] = useState('finding-products');
  const initialData = {
    growthReview: initialDataTopApps.growthReview,
    growthRate: initialDataTopApps.growthRate,
    mostReview: initialDataTopApps.mostReview,
    categories: initialDataTopApps.categories,
  };
  const [reviewCategoryData, setReviewCategoryData] = useState(initialDataTopApps.reviewCategoryData);
  const [loadingReviewCategory, setLoadingReviewCategory] = useState(false);

  const fetchReviewCategoryData = async (category_id) => {
    setLoadingReviewCategory(true);
    try {
      const reviewCategory = await DashboardTopAppService.getDashboardReviewCategory(category_id);
      if (reviewCategory.code === 0) {
        setReviewCategoryData(reviewCategory.result);
      }
    } catch (error) {
      message.error('Error fetching review category data:', error);
    } finally {
      setLoadingReviewCategory(false);
    }
  };

  const onChangeFilter = (value) => {
    setValueFilter(value);
    fetchReviewCategoryData(value);
  };

  const chartData =
    reviewCategoryData?.map((item) => ({
      type: item.apps.app_name,
      value: item.apps.review_count,
      _id: item._id,
    })) || [];

  return (
    <div className="container dashboard-cate">
      <h1 className="dashboard-cate-title">Top App Dashboard</h1>
      <Row className="dashboard-cate-content" justify="space-between">
        <Col className="content-chart total-day">
          <div className="title-top_chart">
            <div className="header-left">
              <div className="chart-title">Top the app growth review</div>
              <MyLink href={`/growth_review`}>Show more</MyLink>
            </div>
            <div className="chart-desc">Number of app growth reviews in 30 days</div>
          </div>
          <GrowthReview data={initialData?.growthReview || []} />
        </Col>
        <Col className="content-chart percent-chart">
          <Row>
            <Col span={24} className="top-review_cate">
              <div className="chart-title">Top App Review Distribution by Category</div>
              <div className="filter-cate">
                <TreeSelect
                  showSearch
                  value={valueFilter}
                  placeholder="Please select"
                  onChange={onChangeFilter}
                  treeData={initialData?.categories}
                  virtual={false}
                />
              </div>
            </Col>
            <div className="chart-desc">Distribution of App Reviews Across Categories</div>
          </Row>
          <Row justify="center">
            {chartData && <ReviewCategory chartData={chartData} loadingReviewCategory={loadingReviewCategory} />}
          </Row>
        </Col>
        <Col className="content-chart location-chart">
          <div className="title-top_chart">
            <div className="header-left">
              <div className="chart-title">Top Apps with the Most Reviews</div>
              <MyLink href={`/top-reviewed`}>Show more</MyLink>
            </div>
            <div className="chart-desc">Number of Reviews for Top Apps in the Last 30 Days</div>
          </div>
          <MostReview mostReview={initialData?.mostReview || []} />
        </Col>
        <Col className="content-chart location-chart">
          <div className="title-top_chart">
            <div className="header-left">
              <div className="chart-title">Top App Growth Ranking in Category</div>
              <MyLink href={`/growth_rate`}>Show more</MyLink>
            </div>
            <div className="chart-desc">App Growth Ranking in Category Over 30 Days</div>
          </div>
          <GrowRate growthRate={initialData?.growthRate || []} />
        </Col>
      </Row>
    </div>
  );
}
