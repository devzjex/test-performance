'use client';

import React, { useMemo, useState } from 'react';
import './ProductPage.scss';
import { Row, Col, Button, DatePicker, Skeleton, Empty, Collapse, Carousel, message } from 'antd';
import CategoryCollectionPos from '@/components/category-collection-pos/CategoryCollectionPos';
import dayjs from 'dayjs';
import { EditFilled, MinusOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import ChartCategory from '@/components/chart/chart-category/ChartCategory';
import { convertDataChartChangeLog, createData } from '@/utils/functions';
import ChartWeeklyRating from '@/components/chart/chart-weekly-rating/ChartWeeklyRating';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ItemDetail from '@/components/item-detail/ItemDetail';
import SkeletonImage from 'antd/es/skeleton/Image';
import ChartChangeLog from '@/components/chart/chart-change-log/ChartChangeLog';
import { LayoutPaths, Paths } from '@/utils/router';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import MyLink from '@/components/ui/link/MyLink';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export default function ProductPage({
  initialDataAppInfo,
  initialDataCateCollections,
  app_id,
  initialDataChart,
  token,
}) {
  const dateFormat = 'YYYY-MM-DD';
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, 'd').format(dateFormat));
  const [toDate, setToDate] = useState(dayjs().format(dateFormat));
  const [dataDetailApp, setDataDetailApp] = useState(initialDataChart);
  const [loadingAppDetail, setLoadingAppDetail] = useState(false);

  const pathname = usePathname();
  const parts = pathname.split('/');
  const appName = parts[2] || '';

  const dataInfoApps = initialDataAppInfo.appDetail;

  const imageScreenshots = useMemo(() => dataInfoApps?.data?.detail?.img || [], [dataInfoApps]);

  const dataAlternativesRender = () => {
    const data = dataInfoApps?.data?.app_compare?.flatMap((item) => item.top_3_apps) || [];
    const uniqueData = Array.from(new Map(data.map((item) => [item.app_id, item])).values());
    const limitedData = uniqueData.slice(0, 6);
    const filteredDataApps = limitedData.filter((item) => item.app_id !== appName);

    return (
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {filteredDataApps?.length > 0 ? (
          <>
            {filteredDataApps.map((item) => (
              <Col style={{ marginTop: '15px' }} lg={8} xs={12} md={12} key={item.app_id}>
                <ItemDetail value={item} />
              </Col>
            ))}
          </>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} className="no-data-image" />
        )}
      </Row>
    );
  };

  const renderImages = () => {
    return (
      <div className="screen-shot">
        {!dataInfoApps && imageScreenshots.length === 0 ? (
          <div className="skeleton-image">
            <SkeletonImage active={true} className="skeleton-image-custom" />
          </div>
        ) : (
          <Carousel
            arrows={true}
            infinite={false}
            dots={true}
            autoplay={false}
            autoplaySpeed={3000}
            className="carousel-screenshot"
          >
            {imageScreenshots.map((img, index) => (
              <div key={index} className="image-screenshot">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={1000}
                  height={550}
                  style={{ borderRadius: 8 }}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  priority={index === 0}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </Carousel>
        )}
      </div>
    );
  };

  const renderFAQ = () => {
    if (!dataInfoApps || !dataInfoApps.data || !dataInfoApps.data.detail) return null;

    const pricingPlans = dataInfoApps.data.detail.pricing_plan || [];
    const hasFreePlan = pricingPlans.some((plan) => plan.pricing.toLowerCase().includes('free'));
    const minPricing =
      pricingPlans?.length > 0
        ? `$${Math.min(...pricingPlans.map((plan) => parseFloat(plan.pricing.replace('$', ''))))}`
        : 'N/A';

    return (
      <div className="faq-section">
        <h2>{dataInfoApps.data.detail.name} FAQs</h2>
        <Collapse
          defaultActiveKey={1}
          expandIconPosition="end"
          bordered="false"
          expandIcon={({ isActive }) =>
            isActive ? <MinusOutlined className="faq-icon faq-active" /> : <PlusOutlined className="faq-icon" />
          }
        >
          <Panel header={`1. Is ${dataInfoApps.data.detail.name} free on Shopify?`} key="1">
            {hasFreePlan ? (
              <p>
                Yes! Try {dataInfoApps.data.detail.name} free plan. For more details about{' '}
                {dataInfoApps.data.detail.name} pricing, check{' '}
                <MyLink href={`/app/${dataInfoApps.data.detail.app_id}/pricing`}>here</MyLink>.
              </p>
            ) : (
              <p>
                No. {dataInfoApps.data.detail.name} pricing starts at {minPricing}. For more details about{' '}
                {dataInfoApps.data.detail.name} pricing, check
                <MyLink href={`/app/${dataInfoApps.data.detail.app_id}/pricing`}> here</MyLink>.
              </p>
            )}
          </Panel>
          <Panel header={`2. How do I install ${dataInfoApps.data.detail.name} on my Shopify store?`} key="2">
            <p>
              - Navigate to the Shopify App Store, search for {dataInfoApps.data.detail.name}, and click “Add app.”{' '}
              <br />
              - Follow the prompts to install. <br />
              <strong>Pro Tip:</strong> Ensure you’re logged into your Shopify admin account.
            </p>
          </Panel>
          {dataInfoApps.data.detail.languages && dataInfoApps.data.detail.languages.length > 0 ? (
            <Panel header={`3. What languages does ${dataInfoApps.data.detail.name} support?`} key="3">
              <p>
                {dataInfoApps.data.detail.name} supports: {dataInfoApps.data.detail?.languages?.join(', ')}
              </p>
            </Panel>
          ) : null}

          {dataInfoApps.data.detail.integrations && dataInfoApps.data.detail.integrations.length > 0 ? (
            <Panel header={`4. Which App/Tool does ${dataInfoApps.data.detail.name} integrate with?`} key="4">
              <p>
                {dataInfoApps.data.detail.name} integrates seamlessly with{' '}
                {dataInfoApps.data.detail?.integrations[0].split(/\s+/).join(', ')}
              </p>
            </Panel>
          ) : null}
        </Collapse>
      </div>
    );
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dateStrings) {
      setFromDate(dateStrings[0]);
      setToDate(dateStrings[1]);
    }
  };

  const searchByDate = async (id, fromDate, toDate) => {
    setLoadingAppDetail(true);
    try {
      const [ratingChange, reviewsChange, changeLog, dataCategoryPos] = await Promise.all([
        DetailAppApiService.getRatingChange(id, fromDate, toDate),
        DetailAppApiService.getReviewsChange(id, fromDate, toDate),
        DetailAppApiService.getChangeLog(id, fromDate, toDate),
        DetailAppApiService.getCategoryPositionChange(id, fromDate, toDate),
      ]);

      setDataDetailApp({
        dataCategoryPos: dataCategoryPos.data,
        ratingChange: ratingChange.data,
        reviewsChange: reviewsChange.data.filter((item) => item.type === 'Review'),
        changeLog: changeLog.data,
      });
    } catch (error) {
      message.error('Error fetching data for the search', error);
    } finally {
      setLoadingAppDetail(false);
    }
  };

  return (
    <div className="container-product-page">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div className="detail-section">
            <div className="top">
              <h2>Details</h2>
              <div className="pen-login">
                <MyLink className="pen-icon" href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>
                  <EditFilled />
                </MyLink>
              </div>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>App name</span>
                  </div>
                  {!dataInfoApps ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {dataInfoApps?.data.detail.name ? (
                        <span>{dataInfoApps?.data.detail.name}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>Tagline</span>
                  </div>
                  {!dataInfoApps ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {dataInfoApps?.data.detail.tagline ? (
                        <span>{dataInfoApps?.data.detail.tagline}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>Title tag</span>
                  </div>
                  {!dataInfoApps ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {dataInfoApps?.data.detail.metatitle ? (
                        <span>{dataInfoApps?.data.detail.metatitle}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div className="content-desc content-meta">
                  <div className="label">
                    <span>Meta description</span>
                  </div>
                  {!dataInfoApps ? (
                    <div className="value">
                      <Skeleton paragraph={{ rows: 0 }} active />
                    </div>
                  ) : (
                    <div className="value">
                      {dataInfoApps?.data.detail.metadesc ? (
                        <span>{dataInfoApps?.data.detail.metadesc}</span>
                      ) : (
                        <span>............</span>
                      )}
                    </div>
                  )}
                </div>
              </Col>
            </Row>

            <div className="desc">
              <div className="label">
                <span>Description</span>
              </div>
              <div className="value">
                {!dataInfoApps ? (
                  <Skeleton paragraph={{ rows: 1 }} active />
                ) : (
                  <span>{dataInfoApps?.data.detail.description || '............'}</span>
                )}
              </div>
            </div>

            <span className="screen-text">Screenshot</span>
            {renderImages()}
          </div>
        </Col>

        <Col span={24}>
          <div className="analytics-section">
            <h2>Analytics</h2>
            <span style={{ display: 'block', fontSize: '14px', color: '#444A51', marginBottom: '20px' }}>
              In our report, Letsmetrix'll cover the following analytics on usage of the{' '}
              <strong>{dataInfoApps?.data.detail.name}</strong> Shopify app.
            </span>
            <CategoryCollectionPos
              isUnlist={dataInfoApps?.data?.delete || dataInfoApps?.data?.unlisted}
              dataCategory={initialDataCateCollections && initialDataCateCollections.dataCategory}
              dataCollection={initialDataCateCollections && initialDataCateCollections.dataCollection}
              infoApp={dataInfoApps}
            />
            <div className="selected-date_range">
              {fromDate && toDate && (
                <div className="date-range">
                  <span className="title-name">Date Range: </span>
                  <div className="date-picker">
                    <RangePicker
                      defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
                      format={dateFormat}
                      allowClear={false}
                      onChange={onChangeDateRange}
                      disabledDate={disabledFutureDate}
                      style={{ marginRight: '10px' }}
                    />

                    <Button
                      type="primary"
                      loading={loadingAppDetail}
                      icon={<SearchOutlined />}
                      className="icon-search-date"
                      onClick={() => searchByDate(app_id, fromDate, toDate)}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="chart-weekly-category-keyword">
              <ChartCategory
                loading={loadingAppDetail}
                dataBestMatch={dataDetailApp && createData(dataDetailApp.dataCategoryPos.best_match)}
                dataPopular={dataDetailApp && createData(dataDetailApp.dataCategoryPos.popular)}
              />
            </div>
            <div className="chart-weekly-review-rating">
              <div className="chart-weekly-reviews">
                <ChartWeeklyRating
                  isReview
                  value={dataDetailApp && createData(dataDetailApp.reviewsChange)}
                  loading={loadingAppDetail}
                  infoApp={dataInfoApps}
                />
              </div>
              <div className="chart-weekly-rating">
                <ChartWeeklyRating
                  value={dataDetailApp && createData(dataDetailApp.ratingChange)}
                  loading={loadingAppDetail}
                  infoApp={dataInfoApps}
                />
              </div>
            </div>
            <div className="chart-weekly-change-trend">
              <div id="chart-log-weekly" className="chart-weekly-change">
                <ChartChangeLog
                  value={
                    dataDetailApp &&
                    convertDataChartChangeLog(dataDetailApp && dataDetailApp.changeLog ? dataDetailApp.changeLog : [])
                  }
                  loading={loadingAppDetail}
                  infoApp={dataInfoApps}
                />
              </div>
            </div>
            <div className="data-from-ga">
              Connect your Google Analytics
              {!token && (
                <>
                  {' '}
                  or
                  <MyLink href={`${LayoutPaths.Auth}${Paths.LoginApp}`}> login</MyLink>
                </>
              )}{' '}
              to view the analyzed detail
            </div>
          </div>
        </Col>

        <Col span={24}>
          <div className="alternatives-section">
            <h2>Alternatives</h2>
            <div className="item-app-compare">{dataAlternativesRender()}</div>
          </div>
        </Col>

        <Col span={24}>{renderFAQ()}</Col>
      </Row>
    </div>
  );
}
