'use client';

import DetailAppApiService from '@/api-services/api/DetailAppApiService';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import { Breadcrumb, Pagination, Select, Spin, Table, Tag, message } from 'antd';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {
  StarFilled,
  UpOutlined,
  DownOutlined,
  LinkOutlined,
  SketchOutlined,
  HomeOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { optionsLanguage, optionsSortBy } from '@/utils/data/filter-option';
import './DetailKey.scss';
import MyLink from '@/components/ui/link/MyLink';

export default function DetailKey({ initialData }) {
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState(initialData.total);
  const [sort_by, setSort_by] = useState('best_match');
  const [sort_type, setSort_type] = useState('rank');
  const [dataKey, setDataKey] = useState(initialData.dataKey);
  const [data, setData] = useState(initialData.data);
  const [language, setLanguage] = useState('uk');
  const [isLoading, setIsLoading] = useState(false);
  const fromDate = '';
  const toDate = '';
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.slice(5);

  const asyncFetch = async (id, page, perPage, sort_by, sort_type, language, fromDate, toDate) => {
    setIsLoading(true);
    try {
      const result = await DetailAppApiService.getKeywordByLanguage(
        id,
        page,
        perPage,
        sort_by,
        sort_type,
        language,
        fromDate,
        toDate,
      );

      if (result.code === 102) {
        message.error('No data');
        return;
      }
      if (result && result.code !== 102) {
        setData({
          ...result.data,
          text: result.data.text ? result.data.text : data.text,
        });
        if (result.data) {
          setDataKey(result.data.apps);
        }
        setCurrentPage(result.current_page);
        setTotal(result.total);
      }
    } catch (error) {
      message.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const checkLocale = () => {
    if (language === 'uk') {
      return '';
    }
    if (language === 'cn') {
      return 'locale=zh-CN&';
    }
    if (language === 'tw') {
      return 'locale=zh-TW&';
    }
    return `locale=${language}&`;
  };

  const getLinkNameKey = (keyword) => {
    return `apps.shopify.com/search?${checkLocale()}q=` + keyword;
  };

  const handleChangeSort = (type, value) => {
    if (type == 'sortBy') {
      setSort_by(value);
      asyncFetch(id, page, perPage, value, sort_type, language, fromDate, toDate);
      return;
    }
    if (type == 'language') {
      setLanguage(value);
      asyncFetch(id, page, perPage, sort_by, sort_type, value, fromDate, toDate);
      return;
    }
    setSort_type(value);
    asyncFetch(id, page, perPage, sort_by, value, language, fromDate, toDate);
  };

  const optionsSortType = [
    { label: 'Rank', value: 'rank' },
    { label: 'Review', value: 'review' },
    { label: 'Star', value: 'star' },
  ];

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page: page,
      per_page: per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(id, page, per_page, sort_by, sort_type, language, fromDate, toDate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record) => {
        return (
          <div className="rank">
            <span>{record.index || record.rank}</span>
          </div>
        );
      },
    },
    {
      title: 'App',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="content-app">
          <div className="image">
            <Image onClick={openAppDetail(record.app_id)} src={record.app_icon} width={75} height={75} alt="" />
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
              <MyLink href={'/app/' + record.app_id} className="link-name">
                {record.name}
              </MyLink>
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
                  'https://shopify.com/' +
                  record.app_id +
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
      showSorterTooltip: false,
      render: (review_count, record) => (
        <>
          {record.review_count > 0 ? record.review_count : record.review || null}
          {record.before_review && record.review - record.before_review > 0 ? (
            <span> (+{record.review - record.before_review})</span>
          ) : (
            ''
          )}
        </>
      ),
    },
  ];

  const renderSelect = (options, label, value, onChange) => {
    return (
      <div className="sort-container">
        <label className="select-label">{label}</label>
        <Select value={value} onChange={onChange} style={{ width: 150 }}>
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

  return (
    <Spin spinning={isLoading}>
      <div className="detail-keys">
        <div className="breadcrumb-header">
          <div className="container">
            <Breadcrumb
              items={[
                {
                  href: '/',
                  title: <HomeOutlined />,
                },
                {
                  title: <span>Keys</span>,
                },
                {
                  title: <span>{data && data.text ? data.text : ''}</span>,
                },
              ]}
              separator={<RightOutlined />}
            />
          </div>
        </div>
        <div className="detail-key-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <div className="title">{data && data.text ? data.text : ''}</div>
              <div className="title-apps">{total} apps</div>
              <div className="link">
                <MyLink
                  target="_blank"
                  href={
                    `https://apps.shopify.com/search?${checkLocale()}q=` +
                    encodeURIComponent(data && data.text ? data.text : '').replace(/%20/g, '+') +
                    '&sort_by=' +
                    sort_by +
                    `&utm_source=letsmetrix.com&utm_medium=keyword&utm_content=${data && data.text ? data.text : ''}`
                  }
                  rel="noopener nofollow noreferrer"
                >
                  {getLinkNameKey(data && data.text ? data.text + '&sort_by=' + sort_by : '')}
                </MyLink>
              </div>
            </div>
            <div className="sort_by">
              {renderSelect(optionsSortBy, 'Sort By', sort_by, (value) => handleChangeSort('sortBy', value))}
              {renderSelect(optionsSortType, 'Sort Type', sort_type, (value) => handleChangeSort('sortType', value))}
              {renderSelect(optionsLanguage, 'Location', language, (value) => handleChangeSort('language', value))}
            </div>
          </div>
          <div className="detail-key">
            <Table
              columns={columns}
              dataSource={dataKey}
              pagination={false}
              rowClassName="item-detail"
              bordered
              scroll={{ x: 'max-content' }}
            />
          </div>
          {total > 0 ? (
            <div className="pagination">
              <Pagination
                pageSize={numberPage}
                current={currentPage}
                onChange={(pageNumber, pageSize) => {
                  setCurrentPage(pageNumber);
                  setNumberPage(pageSize);
                  onChangePage(pageNumber, pageSize);
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
      </div>
    </Spin>
  );
}
