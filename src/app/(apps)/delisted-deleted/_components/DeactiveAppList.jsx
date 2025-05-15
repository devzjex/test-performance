'use client';

import React, { useState } from 'react';
import DashboardApiService from '@/api-services/api/DashboardApiService';
import { Table, Pagination, Spin, Tag, Select } from 'antd';
import { optionsSortByDeactive, optionsSortTypeDeactive } from '@/utils/data/filter-option';
import { getParameterQuery, openNotification } from '@/utils/functions';
import { SketchOutlined, StarFilled, LinkOutlined, DownOutlined, UpOutlined, LoadingOutlined } from '@ant-design/icons';
import './DeactiveAppList.scss';
import Image from 'next/image';
import MyLink from '@/components/ui/link/MyLink';

function DeactiveAppList({ initialData }) {
  const [data, setData] = useState(initialData.data);
  const params = getParameterQuery();
  const page = params.page ? parseInt(params.page, 10) : 1;
  const perPage = params.per_page ? parseInt(params.per_page, 10) : 24;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState(initialData.total);
  const [sort_by, setSort_by] = useState(params.sort_by || 'newest');
  const [sort_type, setSort_type] = useState(params.sort_type || 'deleted');

  const fetchData = async (page, perPage, sortType, sortBy) => {
    setIsLoading(true);
    const result = await DashboardApiService.getListDeactiveApps(sortType, page, perPage, sortBy);
    if (result) {
      setData(
        result.result.map((item, index) => ({
          ...item.detail,
          updated_at: item.updated_at,
          key: index,
          rank: perPage * (page - 1) + index + 1,
        })),
      );
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  };

  const onChangePage = (page, pageSize) => {
    fetchData(page, pageSize, sort_type, sort_by);
    setCurrentPage(page);
    setNumberPage(pageSize);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank, record) => (
        <div className="rank">
          <span>{record.index || record.rank}</span>
        </div>
      ),
    },
    {
      title: 'App',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="content-app">
          <div className="image">
            <Image
              onClick={() => openNotification(true)}
              src={record.app_icon ? record.app_icon : ''}
              width={75}
              height={75}
              alt=""
            />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              {record.before_rank && record.rank && !isLoading && record.before_rank - record.rank > 0 ? (
                <span className="calular-incre">
                  <UpOutlined /> {record.before_rank - record.rank}
                </span>
              ) : (
                ''
              )}
              {record.before_rank && record.rank && !isLoading && record.before_rank - record.rank < 0 ? (
                <span className="calular-decre">
                  <DownOutlined /> {record.rank - record.before_rank}
                </span>
              ) : (
                ''
              )}
              <span
                onClick={() => openNotification(true)}
                className="link-name"
                style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
              >
                {record.name}
              </span>
              {record.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for shopify
                </Tag>
              )}
            </div>
            <div className="tagline">{record.tagline ? record.tagline : record.metatitle}</div>
            <div className="link-app-shopify">
              <MyLink
                target="_blank"
                href={
                  'https://apps.shopify.com/' +
                  record._id +
                  `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.name}`
                }
                className="link"
                rel="noopener nofollow noreferrer"
              >
                <LinkOutlined />
              </MyLink>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (highlights) =>
        highlights && highlights.length > 0 ? (
          <ul>
            {highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        ) : null,
    },
    {
      title: sort_type === 'deleted' ? 'Deleted Date' : 'Delisted Date',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (updated_at) => <span>{updated_at ? updated_at.slice(0, 10) : null}</span>,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      render: (star, record) => (
        <div className="icon-star">
          <StarFilled /> {record.star > 5 ? record.star / 10 : record.star}
          {record.before_star && record.star && record.before_star - record.star > 0 ? (
            <span className="calular-incre">
              <UpOutlined className="icon" /> {(record.before_star - record.star).toFixed(1)}
            </span>
          ) : (
            ''
          )}
          {record.before_star && record.star && record.before_star - record.star < 0 ? (
            <span className="calular-decre">
              <DownOutlined /> {(record.star - record.before_star).toFixed(1)}
            </span>
          ) : (
            ''
          )}
        </div>
      ),
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      render: (review_count, record) => (
        <div>
          {record.review_count > 0 ? record.review_count : record.review || null}
          {record.before_review && record.review - record.before_review > 0 ? (
            <span> (+{record.review - record.before_review})</span>
          ) : (
            ''
          )}
        </div>
      ),
    },
  ];

  const renderSelect = (options, label, value, onChange) => {
    return (
      <div className="sort-container">
        <label className="select-label">{label}</label>
        <Select value={value} onChange={onChange} style={{ width: 150 }} className="type-select">
          <Select.OptGroup label={label}>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        </Select>
      </div>
    );
  };

  const handleChangeSort = (type, value) => {
    switch (type) {
      case 'sortBy':
        setSort_by(value);
        fetchData(page, perPage, sort_type, value);
        return;
      default:
        setSort_type(value);
        fetchData(page, perPage, value, sort_by);
        return;
    }
  };

  return (
    <Spin spinning={isLoading} indicator={<LoadingOutlined spin />} size="large">
      <div className="detail-delisted_deleted">
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Delisted or Deleted Apps</h1>
              <div className="title-apps">{total} apps</div>
            </div>
            <div className="sort">
              {renderSelect(optionsSortByDeactive, 'Sort By', sort_by, (value) => handleChangeSort('sortBy', value))}
              {renderSelect(optionsSortTypeDeactive, 'Sort Type', sort_type, (value) =>
                handleChangeSort('sortType', value),
              )}
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName="item-detail"
            bordered
            scroll={{ x: 'max-content' }}
          />
          <div className="pagination">
            <Pagination
              pageSize={numberPage}
              current={currentPage}
              onChange={onChangePage}
              total={total}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
              pageSizeOptions={[24, 48, 96, 192].map(String)}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default DeactiveAppList;
