'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CloseOutlined,
  DeleteOutlined,
  FilterOutlined,
  LoadingOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Pagination,
  Rate,
  Progress,
  Select,
  Spin,
  Button,
  Empty,
  message,
  Switch,
  Popover,
  Tooltip,
  Collapse,
  Checkbox,
  Divider,
  Typography,
  Drawer,
  Input,
} from 'antd';
import './ReviewApp.scss';
import ReviewItem from './item/ReviewItem';
import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const { Panel } = Collapse;
const { Title } = Typography;

export default function ReviewApp({ initialDataReviews }) {
  const params = useParams();
  const idDetail = params.app_id;
  const PAGE_DEFAULT_REVIEW = 1;
  const PER_PAGE_REVIEW = 10;
  const [listOfReview, setListOfReview] = useState(initialDataReviews.dataListOfReview);
  const [total, setTotal] = useState(initialDataReviews.dataListOfReview.total_all);
  const countData = initialDataReviews.dataSummaryReview.data;
  const [sort, setSort] = useState('create_date');
  const [isDeleted, setIsDeleted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nameLocation, setNameLocation] = useState([]);
  const [rating, setRating] = useState([]);
  const [timeSpent, setTimeSpent] = useState([]);
  const [replyTime, setReplyTime] = useState([]);
  const [showReply, setShowReply] = useState([]);
  const [reviewerName, setReviewerName] = useState('');
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const prosList = initialDataReviews.dataSummaryReview.data.pros_app
    ? initialDataReviews.dataSummaryReview.data.pros_app.split('\n').map((item) => item.replace(/^- /, '').trim())
    : [];
  const consList = initialDataReviews.dataSummaryReview.data.cons_app
    ? initialDataReviews.dataSummaryReview.data.cons_app.split('\n').map((item) => item.replace(/^- /, '').trim())
    : [];
  const [filters, setFilters] = useState([]);
  const [isSize, setIsSize] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);

  const handleFeedback = () => {
    message.info('Thanks for the feedback');
    setVisible(false);
  };

  const content = (
    <div>
      <Button className="feedback-button" type="link" onClick={() => handleFeedback()}>
        Helpful
      </Button>
      <br />
      <Button className="feedback-button" type="link" onClick={() => handleFeedback()}>
        Not Helpful
      </Button>
    </div>
  );

  const getReviewListDetailApp = async (
    id,
    isDeleted,
    page,
    perPage,
    sortBy,
    reviewerLocation,
    timeSpentUsingApp,
    rating,
    replyTime,
    reviewerName,
  ) => {
    setLoading(true);
    const res = await DetailAppApiService.getFilterReviewApp(
      id,
      isDeleted,
      page,
      perPage,
      sortBy,
      reviewerLocation,
      timeSpentUsingApp,
      rating,
      replyTime,
      reviewerName,
    );
    setShowReply([]);
    if (res.code === 0) {
      setLoading(false);
      setListOfReview(res);
      setTotal(res.total_all);
    } else {
      message.error(res.message);
      setLoading(false);
    }
  };

  const handleApplyFilters = useCallback(() => {
    getReviewListDetailApp(
      idDetail,
      isDeleted,
      PAGE_DEFAULT_REVIEW,
      PER_PAGE_REVIEW,
      sort,
      nameLocation,
      timeSpent,
      rating,
      replyTime,
      reviewerName,
    );
  }, [idDetail, nameLocation, timeSpent, rating, replyTime, reviewerName]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1250) {
        setIsContentVisible(false);
      } else {
        setIsContentVisible(true);
      }
      setIsSize(window.innerWidth <= 1250);
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSize]);

  const handleClickGetItem = (type, value) => {
    let updatedFilters = [...filters];
    const filterKey = `${type}:${value}`;
    const otherKey = `${type}:other_${type}`;

    if (typeof value === 'string' && value.startsWith('other_')) {
      // Nếu "Other" đã được chọn trước đó, bỏ chọn "Other"
      if (updatedFilters.includes(filterKey)) {
        updatedFilters = updatedFilters.filter((filter) => filter !== filterKey);

        if (type === 'location') {
          setNameLocation([]);
        } else if (type === 'time_spent') {
          setTimeSpent([]);
        } else if (type === 'time_reply') {
          setReplyTime([]);
        }
      } else {
        // Nếu "Other" chưa được chọn, chọn nó và bỏ hết các lựa chọn khác
        updatedFilters = updatedFilters.filter((filter) => !filter.startsWith(`${type}:`));
        updatedFilters.push(filterKey);

        if (type === 'location') {
          setNameLocation([value]);
        } else if (type === 'time_spent') {
          setTimeSpent([value]);
        } else if (type === 'time_reply') {
          setReplyTime([value]);
        }
      }

      setFilters(updatedFilters);
    } else {
      // Nếu "Other" đang được chọn, bỏ chọn nó
      if (updatedFilters.includes(filterKey) || updatedFilters.includes(otherKey)) {
        updatedFilters = updatedFilters.filter((filter) => filter !== otherKey);

        if (type === 'location') {
          setNameLocation([]);
        } else if (type === 'time_spent') {
          setTimeSpent([]);
        } else if (type === 'time_reply') {
          setReplyTime([]);
        } else if (type === 'rating') {
          setRating([]);
        }
      }

      if (updatedFilters.includes(filterKey)) {
        // Nếu đã chọn thì bỏ chọn
        updatedFilters = updatedFilters.filter((filter) => filter !== filterKey);

        if (type === 'location') {
          setNameLocation((prev) => prev.filter((item) => item !== value));
        } else if (type === 'time_spent') {
          setTimeSpent((prev) => prev.filter((item) => item !== value));
        } else if (type === 'time_reply') {
          setReplyTime((prev) => prev.filter((item) => item !== value));
        } else if (type === 'rating') {
          setRating((prev) => prev.filter((item) => item !== value));
        }
      } else {
        // Nếu chưa chọn thì thêm vào
        updatedFilters.push(filterKey);

        if (type === 'location') {
          setNameLocation((prev) => [...prev, value]);
        } else if (type === 'time_spent') {
          setTimeSpent((prev) => [...prev, value]);
        } else if (type === 'time_reply') {
          setReplyTime((prev) => [...prev, value]);
        } else if (type === 'rating') {
          setRating((prev) => [...prev, value]);
        }
      }

      setFilters(updatedFilters);
    }
  };

  const handleClickResetData = () => {
    getReviewListDetailApp(idDetail, null, PAGE_DEFAULT_REVIEW, PER_PAGE_REVIEW, 'create_date', [], [], [], [], '');
    setNameLocation([]);
    setTimeSpent('');
    setRating([]);
    setReplyTime([]);
    setFilters('');
  };

  const handleChangeSort = (value) => {
    const isDeletedValue = value === 1 ? true : null;
    setIsDeleted(isDeletedValue);
    getReviewListDetailApp(
      idDetail,
      isDeletedValue,
      PAGE_DEFAULT_REVIEW,
      PER_PAGE_REVIEW,
      sort,
      nameLocation,
      timeSpent,
      rating,
      replyTime,
      reviewerName,
    );
  };

  const checkTimeSpent = (type) => {
    switch (type) {
      case 'lt_1_days':
        return 'Less than 1 day';
      case 'lt_3_days':
        return 'Less than 3 days';
      case 'lt_7_days':
        return 'Less than 7 days';
      case 'lt_14_days':
        return 'Less than 14 days';
      case 'lt_28_days':
        return 'Less than 28 days';
      default:
        return 'Other';
    }
  };

  const sumReviews = (data) => {
    return data.reduce((total, item) => total + item.total_reviews, 0);
  };

  const renderFilterStatus = () => {
    return `${filters.length} filter${filters.length > 1 ? 's' : ''} applied`;
  };

  const handleSearchByReviewerName = () => {
    getReviewListDetailApp(
      idDetail,
      isDeleted,
      PAGE_DEFAULT_REVIEW,
      PER_PAGE_REVIEW,
      sort,
      nameLocation,
      timeSpent,
      rating,
      replyTime,
      reviewerName,
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderFilterStatusReviews = () => {
    return (
      <Collapse defaultActiveKey={['1', '2', '3', '4']} ghost>
        {countData.rating?.some((item) => item.total_reviews > 0) && (
          <Panel header="Overall rating" key="1">
            <div className="scroll_list_show_normal">
              {countData.rating
                ?.filter((item) => item.total_reviews > 0)
                ?.map(
                  (item, index) =>
                    item._id !== null && (
                      <div key={index} className="review_app_flex_box_title_wrapper">
                        <Checkbox
                          onClick={() => handleClickGetItem('rating', item._id)}
                          checked={filters.includes(`rating:${item._id}`)}
                        />
                        <p className="overall_rating">{item._id}</p>
                        <Rate disabled={true} style={{ color: '#ffc225' }} count={1} value={1}></Rate>
                        <Progress
                          showInfo={false}
                          percent={(item.total_reviews / sumReviews(countData.rating)) * 100}
                        />
                        <p className="onhover_click_data">{item.total_reviews}</p>
                      </div>
                    ),
                )}
            </div>
          </Panel>
        )}

        {countData.reviewer_location?.some((item) => item.total_reviews > 0) && (
          <Panel header="Top Locations" key="2">
            <div className="scroll_list_show">
              {countData.reviewer_location
                ?.filter((item) => item.total_reviews > 0)
                ?.map(
                  (item, index) =>
                    item._id !== null && (
                      <div key={index} className="review_app_flex_box_title_wrapper">
                        <Checkbox
                          onClick={() => handleClickGetItem('location', item._id)}
                          checked={filters.includes(`location:${item._id}`)}
                        />
                        <p>{item.value}</p>
                        <p className="onhover_click_data">({item.total_reviews})</p>
                      </div>
                    ),
                )}
            </div>
          </Panel>
        )}

        {countData.time_spent_using_app?.some((item) => item.total_reviews > 0) && (
          <Panel header="Time Spent Using App" key="3">
            <div className="scroll_list_show">
              {countData.time_spent_using_app
                ?.filter((item) => item.total_reviews > 0)
                ?.map(
                  (item, index) =>
                    item._id !== null && (
                      <div key={index} className="review_app_flex_box_title_wrapper">
                        <Checkbox
                          onClick={() => handleClickGetItem('time_spent', item._id)}
                          checked={filters.includes(`time_spent:${item._id}`)}
                        />
                        <p>{checkTimeSpent(item._id)}</p>
                        <p className="onhover_click_data">({item.total_reviews})</p>
                      </div>
                    ),
                )}
            </div>
          </Panel>
        )}

        {countData.time_reply?.some((item) => item.total_reviews > 0) && (
          <Panel header="Review Reply Time" key="4">
            <div className="scroll_list_show">
              {countData.time_reply
                ?.filter((item) => item.total_reviews > 0)
                ?.map(
                  (item, index) =>
                    item._id !== null && (
                      <div key={index} className="review_app_flex_box_title_wrapper">
                        <Checkbox
                          onClick={() => handleClickGetItem('time_reply', item._id)}
                          checked={filters.includes(`time_reply:${item._id}`)}
                        />
                        <p>{checkTimeSpent(item._id)}</p>
                        <p className="onhover_click_data">({item.total_reviews})</p>
                      </div>
                    ),
                )}
            </div>
          </Panel>
        )}
      </Collapse>
    );
  };

  const renderContentReviews = () => (
    <>
      {countData && countData.total_reviews > 0 ? (
        <div className="container">
          <div className="review_app_wrapper">
            <div className="review_app_flex_box_title">
              <div className="title-content_ai">
                <h1 className="review_app_name">{countData?.app_name} Reviews</h1>
                {total && total > 30 ? (
                  <div className="content-ai">
                    <div className="title">
                      <strong>
                        <span>
                          <Tooltip title={'AI-generated review summary'}>
                            <Image src={'/image/ai-summary.webp'} alt="" width={36} height={37} />
                          </Tooltip>
                          What people think about this app?
                        </span>
                        <Switch checked={isContentVisible} onChange={() => setIsContentVisible(!isContentVisible)} />
                      </strong>
                      <div className="action-feedback">
                        <Popover
                          content={content}
                          trigger="click"
                          visible={visible}
                          onVisibleChange={(visible) => setVisible(visible)}
                          placement="bottomLeft"
                        >
                          <MoreOutlined />
                        </Popover>
                      </div>
                    </div>
                    {isContentVisible ? (
                      <>
                        <div className="desc">
                          <p>{countData && countData.ai_think ? countData.ai_think : null}</p>
                        </div>
                        <div className="summary">
                          {prosList.length ? (
                            <div className="pros">
                              <strong>Pros</strong>
                              <ul>
                                {prosList
                                  .filter((pro) => pro.trim() !== '')
                                  .map((pro, index) => (
                                    <li key={index}>
                                      <CaretUpOutlined />
                                      <span>{pro}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ) : (
                            <></>
                          )}
                          {consList.length ? (
                            <div className="cons">
                              <strong>Cons</strong>
                              <ul>
                                {consList
                                  .filter((con) => con.trim() !== '')
                                  .map((con, index) => (
                                    <li key={index}>
                                      <CaretDownOutlined />
                                      <span>{con}</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="desc">
                        <span>Use AI to summarize the reviews</span>
                      </div>
                    )}
                  </div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="review_app_flex_box_content-item">
              {isSize ? (
                <nav className="navbar">
                  <Drawer
                    title={
                      <div className="filter-header">
                        <div className="filter-status">
                          <Title level={4}>{filters.length > 0 ? renderFilterStatus() : 'Filter reviews by'}</Title>
                          {filters.length > 0 && (
                            <>
                              <Button
                                icon={<FilterOutlined />}
                                size="small"
                                onClick={handleApplyFilters}
                                className="button-apply"
                              >
                                Apply Filters
                              </Button>
                              <Button
                                icon={<DeleteOutlined />}
                                size="small"
                                onClick={() => handleClickResetData()}
                                className="button-clear"
                              >
                                Clear
                              </Button>
                            </>
                          )}
                        </div>
                        <Button
                          type="text"
                          icon={<CloseOutlined />}
                          onClick={() => setVisibleFilter(false)}
                          style={{ fontSize: '16px', color: '#000' }}
                        />
                      </div>
                    }
                    placement="left"
                    onClose={() => setVisibleFilter(false)}
                    visible={visibleFilter}
                    closeIcon={false}
                    width={500}
                  >
                    {renderFilterStatusReviews()}
                  </Drawer>
                </nav>
              ) : (
                <div className="review_app_flex_box_filter">
                  <div className="filter-header-desktop">
                    <div className="filter-status">
                      <Title level={4}>{filters.length > 0 ? renderFilterStatus() : 'Filter reviews by'}</Title>
                      {filters.length > 0 && (
                        <>
                          <Button
                            icon={<FilterOutlined />}
                            onClick={handleApplyFilters}
                            size="small"
                            className="button-apply"
                          >
                            Apply Filters
                          </Button>
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleClickResetData()}
                            size="small"
                            className="button-clear"
                          >
                            Clear
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <Divider style={{ marginBottom: 0 }} />
                  {renderFilterStatusReviews()}
                </div>
              )}

              <div className="review_app_flex_box_content">
                <Title level={4}>{total} Reviews</Title>
                <div className="review_app_flex_box_content_sort-filter">
                  {isSize && (
                    <Button
                      className="btn-filter-review"
                      type="primary"
                      icon={<FilterOutlined />}
                      onClick={() => setVisibleFilter(true)}
                    >
                      Filters
                    </Button>
                  )}
                  <div className="review_app_flex_box_content_sort">
                    <div className="search-review_name">
                      <Input
                        placeholder="Enter Search Reviewer Name"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        onPressEnter={handleSearchByReviewerName}
                        suffix={<SearchOutlined />}
                      />
                    </div>
                    <div className="sort_by-reviews">
                      <p>Sort by </p>
                      <Select
                        defaultValue="create_date"
                        onChange={(value) => {
                          setSort(value);
                          getReviewListDetailApp(
                            idDetail,
                            isDeleted,
                            PAGE_DEFAULT_REVIEW,
                            PER_PAGE_REVIEW,
                            value,
                            nameLocation,
                            timeSpent,
                            rating,
                            replyTime,
                            reviewerName,
                          );
                        }}
                        options={[
                          { value: 'create_date', label: 'Create Date' },
                          {
                            value: 'relevance_position',
                            label: 'Relevance Position',
                          },
                        ]}
                        className="type-select"
                      />
                      <Select
                        defaultValue={0}
                        style={{ width: 130 }}
                        onChange={handleChangeSort}
                        options={[
                          { value: 0, label: 'Full Reviews' },
                          { value: 1, label: 'Deleted' },
                        ]}
                        className="type-select"
                      />
                    </div>
                  </div>
                </div>
                {listOfReview && (
                  <ReviewItem
                    data={listOfReview}
                    appName={countData ? countData.app_name : 'N/A'}
                    showReply={showReply}
                    setShowReply={setShowReply}
                  />
                )}
                {listOfReview.data?.length > 1 ? (
                  <Pagination
                    total={listOfReview.total_all}
                    onChange={(page, pageSize) => {
                      getReviewListDetailApp(
                        idDetail,
                        isDeleted,
                        page,
                        pageSize,
                        sort,
                        nameLocation,
                        timeSpent,
                        rating,
                        replyTime,
                        reviewerName,
                      );
                      window.scrollTo({ top: 600, behavior: 'smooth' });
                    }}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
      )}
    </>
  );

  return (
    <Spin spinning={loading} indicator={<LoadingOutlined spin />} size="large">
      {renderContentReviews()}
    </Spin>
  );
}
